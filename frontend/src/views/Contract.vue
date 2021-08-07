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
import Modal from "../components/Modal.vue";
import useMetaMask from "../composables/metamask";
import useSplitter from "../composables/splitter";
import useConfig from "../config";
import { useLoader } from "../components/Loader.vue";
import { useNotify } from "../components/Notification.vue";
import { formatEther } from "@ethersproject/units";

enum Role {
  Owner,
  Payee,
  OwnerAndPayee,
  Others,
}

export default defineComponent({
  components: { Modal, Address },
  name: "Contract",
  setup() {
    const route = useRoute();
    const { state, fetch, clearState } = useSplitter();
    const { provider, sendEther, hasSetupWallet, userAddress } = useMetaMask();
    const { appChainId } = useConfig();
    const { isLoading } = useLoader();
    const { notify } = useNotify();

    // role
    const role = ref<Role>(Role.Others);
    const updateRole = () => {
      role.value = Role.Others;

      for (let i = 0; i < state.payees.length; i++) {
        if (state.payees[i].address === userAddress.value) {
          if (state.owner === userAddress.value) {
            role.value = Role.OwnerAndPayee;
          } else {
            role.value = Role.Payee;
          }
        } else if (state.owner === userAddress.value) {
          role.value = Role.Owner;
        }
      }
    };
    watch(hasSetupWallet, (value) => {
      updateRole();

      if (value) {
        // listen user's transaction
        provider.value.on("pending", async (tx) => {
          await tx.wait();
          fetch(contractAddr);
          notify("transaction confirmed");
        });
      }
    });
    // @todo check if payee added can update role
    watch(state, () => {
      updateRole();
    });

    // fetch data
    const contractAddr = route.params.address as string;
    const fetchError = ref("");
    const formatError = (e: Error) => {
      return e.message.substring(0, e.message.indexOf("("));
    };
    const fetchData = async () => {
      fetchError.value = "";
      try {
        isLoading.value = true;
        await fetch(contractAddr);
      } catch (e) {
        console.error(e);
        fetchError.value = formatError(e);
        clearState();
      } finally {
        isLoading.value = false;
      }
    };
    watch(appChainId, () => {
      fetchData();
      updateRole();
    });
    onMounted(async () => {
      await fetchData();

      // listen contract event
      let initListener = false;
      state.splitter?.on("PaymentReceived", (to, amount) => {
        if (!initListener) {
          initListener = true;
          return;
        }
        notify(`received ${formatEther(amount)} ETH from ${to}`);
        fetch(contractAddr);
      });
    });
    onUnmounted(() => {
      state.splitter?.removeAllListeners();
      provider.value.removeAllListeners();
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
      try {
        await sendEther(contractAddr, sendAmount.value);
        sendEtherModal.value = false;
        notify("transaction pending...");
      } catch (e) {
        console.error(e);
        sendError.value = e.message;
      }
    };

    // owner setting feature
    const settingModal = ref(false);
    const settingHandler = () => {
      settingModal.value = true;
    };

    return {
      role,
      Role,
      state,
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
          v-if="role === Role.Owner"
          class="text-3xl text-gray-500"
        >Owner</p>
        <p
          v-else-if="role === Role.Payee"
          class="text-3xl text-gray-500"
        >Payee</p>
        <p
          v-else-if="role === Role.OwnerAndPayee"
          class="text-3xl text-gray-500"
        >Owner & Payee</p>

        <!-- fetch error -->
        <p class="text-red-600">{{ fetchError }}</p>

        <div class="p-5">
          <p class="text-lg text-center font-medium">Contract Address</p>
          <p class="text-center text-gray-500">
            <Address
              :address="contractAddr"
              :short="false"
            />
          </p>
        </div>
        <button
          @click="sendEtherHandler"
          class="btn w-full"
          :disabled="fetchError ? true : false"
        >Send Ether</button>
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
          <p class="text-lg font-bold">State</p>
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
                v-if="role === Role.Owner"
                @click="settingHandler"
              />
            </div>
            <div class="flex justify-start items-center px-2 py-2 my-2">
              <div class="text-lg flex-grow font-bold px-2">Payees</div>
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
              <div class="text-sm text-gray-500 tracking-wide mr-6"> {{ payee.share / state.totalShares * 100 }} %</div>
              <div class="text-sm text-gray-500 tracking-wide">{{ payee.available }} ETH</div>
            </div>
          </div>
          <!-- only payees -->
          <button
            v-if="role === Role.Payee || role === Role.OwnerAndPayee"
            class="btn w-full"
          >Withdraw</button>
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
            <h3 class="font-normal text-lg p-1 leading-tight">Payees and Shares</h3>
            <div class="flex items-center">
              <input
                type="text"
                placeholder="payee's address"
                class="my-2 mr-2 text-sm bg-grey-light text-grey-darkest rounded h-10 p-3 focus:outline-none"
              />
              <input
                type="number"
                placeholder="shares"
                class="my-2 mr-2 w-2/7 text-sm bg-grey-light text-grey-darkest rounded h-10 p-3 focus:outline-none"
              />
              <button class="h-10 flex-grow px-3 py-1 rounded inline-block bg-blue-100 text-gray-600 cursor-pointer hover:bg-blue-200 focus:outline-none disabled:cursor-default disabled:opacity-70 disabled:bg-blue-100">
                Add
              </button>
            </div>
            <div class="w-full">
              <div class="flex">
                <div class="flex items-center mr-3">
                  <span class="bg-blue-400 h-1.5 w-1.5 m-2 rounded-full"></span>
                </div>
                <div class="w-4/6 flex items-center">
                  <p class="">Kevin Durant</p>
                </div>
                <div class="w-1/6 flex items-center">
                  <p class="text-sm text-grey-dark">30%</p>
                </div>
                <div class="w-1/6 flex justify-center items-center">
                  <p class="text-sm text-grey-dark">
                    <delete />
                  </p>
                </div>
              </div>
              <div class="flex">
                <div class="flex items-center mr-3">
                  <span class="bg-blue-400 h-1.5 w-1.5 m-2 rounded-full"></span>
                </div>
                <div class="w-4/6 flex items-center">
                  <p class="">Kevin Durant</p>
                </div>
                <div class="w-1/6 flex items-center">
                  <p class="text-sm text-grey-dark">30%</p>
                </div>
                <div class="w-1/6 flex justify-center items-center">
                  <p class="text-sm text-grey-dark">
                    <delete />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sm:flex bg-grey-light sm:items-center py-4">
          <div class="flex-grow">
            <button class="btn w-full">Send Transaction</button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>