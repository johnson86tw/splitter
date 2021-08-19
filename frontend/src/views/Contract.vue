<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import Address from "../components/Address.vue";
import Modal, { useModal } from "../components/Modal.vue";
import Button from "../components/Button.vue";
import useMetaMask from "../composables/metamask";
import useSplitter from "../composables/splitter";
import useConfig from "../config";
import { useLoader } from "../components/Loader.vue";
import { useNotify } from "../components/Notification.vue";
import { formatEther } from "@ethersproject/units";
import usePayees from "../composables/payees";
import { displayEther, shortenAddress } from "../utils/filters";

enum Role {
  Owner,
  Payee,
  OwnerAndPayee,
  Others,
}

export default defineComponent({
  components: { Modal, Address, Button },
  name: "Contract",
  setup() {
    const route = useRoute();
    const {
      state,
      withdrawable,
      fetch,
      clearState,
      addPayees,
      withdraw,
      finalize,
      fetchWithdrawableAmount,
    } = useSplitter();
    const { signer, provider, sendEther, hasSetupWallet, userAddress } =
      useMetaMask();
    const { appChainId, isDev } = useConfig();
    const { isLoading } = useLoader();
    const { notify } = useNotify();

    // role
    const role = ref<Role>(Role.Others);
    const updateRole = () => {
      role.value = Role.Others;
      if (!userAddress.value) return;
      if (state.owner === userAddress.value) {
        role.value = Role.Owner;
      }
      for (let i = 0; i < state.payees.length; i++) {
        if (state.payees[i].address === userAddress.value) {
          if (state.owner === userAddress.value) {
            role.value = Role.OwnerAndPayee;
            break;
          } else {
            role.value = Role.Payee;
            break;
          }
        }
      }
    };
    watch(hasSetupWallet, async () => {
      if (isDev) console.log("watching hasSetupWallet");
      updateRole();
    });
    watch(
      () => ({ ...state }), // deep watch
      async () => {
        updateRole();
      }
    );

    // feature: Withdraw
    watch(role, async (val) => {
      if (val === Role.Payee || val === Role.OwnerAndPayee) {
        await fetchWithdrawableAmount(signer.value!, contractAddr);
      }
    });

    const withdrawHandler = async () => {
      if (state.state === "Opening")
        throw new Error("cannot withdraw in Opening state.");
      if (!signer.value) throw new Error("please connect wallet at first");
      const tx = await withdraw(signer.value, contractAddr, userAddress.value);
      notify("transaction pending...");
      await tx.wait();
      notify("transaction confirmed");
      await fetchData();
    };

    // fetch data
    const contractAddr = route.params.address as string;
    const fetchError = ref("");
    const formatError = (e: Error) => {
      return e.message.substring(0, e.message.indexOf("("));
    };
    const fetchData = async () => {
      if (route.name !== "Contract") return;
      fetchError.value = "";
      try {
        isLoading.value = true;
        await fetch(contractAddr);

        if (hasSetupWallet.value && signer.value) {
          await fetchWithdrawableAmount(signer.value, contractAddr);
          if (isDev) console.log("fetchData: withdrawableAmount updated");
        }
      } catch (e) {
        fetchError.value = formatError(e);
        clearState();
      } finally {
        isLoading.value = false;
      }
      if (isDev) console.log("fetchData: data updated");
    };

    // feature: Event Listener
    const addEventListener = async () => {
      if (state.splitter) {
        // issue: https://github.com/ethers-io/ethers.js/issues/1096
        const startBlockNumber = await provider.value.getBlockNumber();

        state.splitter?.on("PaymentReceived", (to, amount, event) => {
          if (event.blockNumber <= startBlockNumber) return;
          notify(
            `received ${formatEther(amount)} ETH from ${shortenAddress(to)}`
          );
          fetchData();
        });

        state.splitter?.on("PayeeAdded", (account, share, event) => {
          if (event.blockNumber <= startBlockNumber) return;
          notify(`payee added: ${shortenAddress(account)} with share ${share}`);
          fetchData();
        });

        if (isDev) {
          const network = await state.splitter?.provider.getNetwork();
          console.log(`start listening Event at chainId: `, network?.chainId);
        }
      }
    };

    watch(appChainId, async () => {
      if (isDev) console.log("watching appChainId...");
      await fetchData();
      updateRole();
      addEventListener();
    });
    onMounted(async () => {
      await fetchData();
      addEventListener();
    });
    onUnmounted(() => {
      // @ts-ignore removeAllListeners can accept no arguments, but typescript not accept
      state.splitter?.removeAllListeners();
      console.log("removed Event listener");
    });

    // send ether feature
    const sendEtherModal = ref(false);
    const sendEtherHandler = () => {
      sendError.value = "";
      sendEtherModal.value = true;
    };
    const sendAmount = ref(0);

    const dropdown = ref(false);
    const dropdownHandler = () => {
      dropdown.value = !dropdown.value;
    };

    const sendError = ref("");
    const sendTxHandler = async () => {
      // let tx;
      try {
        const txHash = await sendEther(contractAddr, sendAmount.value);
        sendEtherModal.value = false;
        notify("transaction pending...");
        const tx = await provider.value.getTransaction(txHash);
        await tx.wait();
        notify("transaction confirmed");
      } catch (e) {
        sendError.value = e.message;
      }
    };

    // owner setting feature
    const settingModal = ref(false);
    const settingHandler = () => {
      settingModal.value = true;
    };

    // feature: Payees
    const {
      payees,
      add,
      remove,
      share,
      address,
      errMsg: payeesError,
      clearState: clearPayees,
    } = usePayees();

    watch(settingModal, (val) => {
      if (!val) {
        clearPayees();
        payeesError.value = "";
      }
    });

    // feature: Add Payees
    const addPayeesHandler = async () => {
      if (!signer.value) throw new Error("please connect wallet at first");

      let addrs: string[] = [];
      let shares: number[] = [];
      payees.value.forEach((payee) => {
        addrs.push(payee.address);
        shares.push(payee.share);
      });

      await addPayees(signer.value, contractAddr, addrs, shares);
      settingModal.value = false;
      notify("transaction pending...");
    };

    // feature: Finalize
    const {
      modalOpen: finalizeModal,
      open: openFinalizeModal,
      close: closeFinalizeModal,
    } = useModal();
    const finalizeHandler = async () => {
      if (state.state === "Finalized") throw new Error("state is finalized");
      if (!signer.value) throw new Error("please connect wallet at first");
      const tx = await finalize(signer.value, contractAddr);
      closeFinalizeModal();
      notify("transaction pending...");
      await tx.wait();
      notify("transaction confirmed");
      await fetchData();
    };

    const displayWithdrawableAmount = computed(() => {
      return displayEther(state.withdrawableAmount);
    });

    return {
      role,
      Role,

      // contract
      state,
      withdrawable,
      displayWithdrawableAmount,

      settingModal,
      sendEtherModal,
      contractAddr: computed(() => contractAddr),
      sendAmount,
      dropdown,
      fetchError,
      sendError,
      dropdownHandler,
      settingHandler,
      sendEtherHandler,
      sendTxHandler,
      displayEther,

      // payees
      payees,
      add,
      remove,
      share,
      address,
      payeesError,
      addPayeesHandler,

      // finalize & withdraw
      finalizeModal,
      openFinalizeModal,
      closeFinalizeModal,
      withdrawHandler,
      finalizeHandler,
    };
  },
});
</script>

<template>
  <div class="w-full max-w-screen-xl mx-auto px-6">
    <div class="flex justify-center p-2 px-3">
      <div class="w-full max-w-md text-center">
        <!-- role -->
        <p
          v-if="role !== Role.Others"
          class="text-gray-500"
        >role</p>
        <p
          v-if="role === Role.Owner"
          class="text-3xl text-gray-500"
        >Owner</p>
        <p
          v-else-if="role === Role.Payee"
          class="text-3xl text-gray-500"
        >Recipient</p>
        <p
          v-else-if="role === Role.OwnerAndPayee"
          class="text-3xl text-gray-500"
        >Owner & Recipient</p>

        <!-- fetch error -->
        <p class="text-red-600">{{ fetchError }}</p>

        <!-- withdraw -->
        <div
          v-if="state.state === 'Finalized' && (role === Role.Payee || role === Role.OwnerAndPayee)"
          class="py-2 px-5"
        >
          <p class="p-2 text-xl text-gray-500">You can withdraw {{ displayWithdrawableAmount }} ETH </p>
          <Button
            :handlerFn="withdrawHandler"
            v-if="withdrawable && state.state === 'Finalized' && (role === Role.Payee || role === Role.OwnerAndPayee)"
          >Withdraw</Button>
        </div>
      </div>
    </div>
  </div>

  <!-- Contract -->
  <div class="w-full max-w-screen-xl mx-auto px-6">
    <div class="flex justify-center p-2 px-3">
      <div class="w-full max-w-md text-center">
        <div class="p-5 shadow rounded-lg">
          <p class="text-center text-lg font-bold text-xl mb-2">Contract</p>
          <p class="text-center text-gray-500 text-xl">
            balance: {{ state.balance }} ETH
          </p>
          <p class="text-center text-gray-500 text-sm">
            <Address
              :address="contractAddr"
              :short="false"
            />
          </p>
          <button
            @click="sendEtherHandler"
            class="btn w-full mt-2"
            :disabled="fetchError ? true : false"
          >Send Ether</button>
        </div>
      </div>
    </div>
  </div>

  <div class="w-full max-w-screen-xl mx-auto px-6">
    <div class="flex justify-center p-4 px-3">
      <div class="flex w-full max-w-md">
        <div class="w-1/2 rounded shadow p-5 mr-2">
          <p class="text-lg font-bold">Total Received</p>
          <p class="text-xl text-gray-500">{{ state.totalReceived }} ETH</p>
        </div>
        <div class="w-1/2 rounded shadow p-5 ml-2">
          <div class="flex justify-between">
            <p class="text-lg font-bold">State</p>
            <!-- only owner -->
            <tune
              v-if="state.state === 'Opening' && (role === Role.Owner || role === Role.OwnerAndPayee)"
              @click="openFinalizeModal"
            />
          </div>

          <p class="text-xl text-gray-500">{{ state.state }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="w-full max-w-screen-xl mx-auto px-6">
    <div class="flex justify-center p-2 px-3">
      <div class="w-full max-w-md">
        <div class="bg-white shadow rounded-lg px-3 py-2 mb-4">
          <div class="py-3">
            <div class="flex justify-start items-center px-2 py-2 my-2">
              <div class="text-lg font-bold px-2">Owner</div>
              <div class="text-lg flex-grow text-gray-500">
                <Address :address="state.owner" />
              </div>
              <!-- only owner -->
              <tune
                v-if="state.state === 'Opening' && (role === Role.Owner || role === Role.OwnerAndPayee)"
                @click="settingHandler"
              />
            </div>
            <div class="flex justify-start items-center px-2 py-2 my-2">
              <div class="text-lg flex-grow font-bold px-2">Recipients</div>
              <div class="text-lg text-gray-500 tracking-wide">Total: {{ state.totalPayees }}</div>
            </div>
            <div
              v-for="payee in state.payees"
              :key="payee.address"
              class="flex justify-start rounded-md px-2 py-2 my-2"
            >
              <span class="bg-blue-400 h-2 w-2 m-2 rounded-full"></span>
              <div class="flex-grow font-medium px-2">
                <Address :address="payee.address" />
              </div>
              <div class="text-sm text-gray-500 tracking-wide mr-6">
                {{ (payee.share / state.totalShares * 100).toFixed(1) }} %
              </div>
              <div class="text-sm text-gray-500 tracking-wide">{{ payee.available }} ETH</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ======================= SendEther Modal ======================= -->
  <Modal
    :modalOpen="sendEtherModal"
    @modalClose="sendEtherModal = false"
  >
    <div class="max-w-sm mx-auto py-2 flex items-center">
      <input
        v-model="sendAmount"
        type="number"
        placeholder="amount"
        class="flex-1 appearance-none rounded px-4 py-2 text-grey-dark mr-2 focus:outline-none"
      >

      <!-- dropdown -->
      <div class="relative inline-block text-left">
        <div>
          <button
            @click="dropdownHandler"
            v-click-outside="() => dropdown = false"
            type="button"
            class="inline-flex justify-center w-full capitalize rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            aria-expanded="true"
            aria-haspopup="true"
          >
            ETH
            <svg
              class="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div
          v-if="dropdown"
          class="origin-top-right absolute right-0 mt-2 w-30 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div
            class="py-1"
            role="none"
          >
            <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
            <div class="text-gray-700 capitalize block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">USDC</div>
          </div>
        </div>
      </div>
    </div>
    <!-- send Error -->
    <div class="w-full py-2">
      <p class="text-red-600 text-center">{{ sendError }}</p>
    </div>

    <button
      @click="sendTxHandler"
      class="btn w-full"
    >Send</button>
  </Modal>

  <!-- ======================= Setting Modal ======================= -->
  <Modal
    :modalOpen="settingModal"
    @modalClose="settingModal = false"
  >
    <div class="w-full relative overflow-hidden mb-8">
      <div class="bg-white mx-auto max-w-sm overflow-hidden">
        <div class="sm:flex sm:items-center">
          <div class="flex-grow">
            <h3 class="font-normal text-lg p-1 leading-tight">Recipients and Shares</h3>
            <div class="flex items-center">
              <input
                v-model="address"
                type="text"
                placeholder="recipient's address"
                class="my-2 mr-2 text-sm bg-grey-light text-grey-darkest rounded h-10 p-3 focus:outline-none"
              />
              <input
                v-model="share"
                type="number"
                placeholder="shares"
                class="my-2 mr-2 w-2/7 text-sm bg-grey-light text-grey-darkest rounded h-10 p-3 focus:outline-none"
              />
              <button
                @click="add"
                class="h-10 flex-grow px-3 py-1 rounded inline-block bg-blue-100 text-gray-600 cursor-pointer hover:bg-blue-200 focus:outline-none disabled:cursor-default disabled:opacity-70 disabled:bg-blue-100"
              >
                Add
              </button>
            </div>
            <p class="text-sm text-center text-red-600">{{ payeesError }}</p>
            <div class="w-full">
              <div
                v-for="(payee,i) in payees"
                :key="i"
                class="flex"
              >
                <div class="flex items-center mr-3">
                  <span class="bg-blue-400 h-1.5 w-1.5 m-2 rounded-full"></span>
                </div>
                <div class="w-4/6 flex items-center">
                  <p class="">
                    <Address :address="payee.address" />
                  </p>
                </div>
                <div class="w-1/6 flex items-center">
                  <p class="text-sm text-grey-dark">{{ payee.share }}</p>
                </div>
                <div class="w-1/6 flex justify-center items-center">
                  <p class="text-sm text-grey-dark">
                    <delete @click="remove(payee.address)" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sm:flex bg-grey-light sm:items-center py-4">
          <div class="flex-grow">
            <Button :handlerFn="addPayeesHandler">Add Recipients</Button>
          </div>
        </div>
      </div>
    </div>
  </Modal>

  <!-- ======================= Finalize Modal ======================= -->
  <Modal
    :modalOpen="finalizeModal"
    @modalClose="closeFinalizeModal"
  >
    <div class="w-full text-center">
      <p class="text-2xl">Finalize</p>
      <p class="text-xl my-4">Are you sure to finalize the splitter?</p>
      <Button :handlerFn="finalizeHandler">Confirm</Button>
    </div>
  </Modal>
</template>