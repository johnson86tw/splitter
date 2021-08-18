<script lang="ts">
import { computed, defineComponent, onUnmounted, ref, watch } from "vue";
import useMetaMask from "../composables/metamask";
import Button from "../components/Button.vue";
import { useRouter, useRoute } from "vue-router";
import { isAddress } from "@ethersproject/address";
import Delete from "../components/icons/Delete.vue";
import usePayees from "../composables/payees";
import useSplitter from "../composables/splitter";
import useConfig from "../config";
import useHistory from "../composables/history";
import NETWORK from "../constants";

export default defineComponent({
  components: { Delete, Button },
  name: "Home",
  setup() {
    const { etherBalance, connectError, signer } = useMetaMask();
    const router = useRouter();

    // feat: History
    const { add: addHistory, remove: removeHistory, storage } = useHistory();
    const reverseStorage = computed(() => {
      let reverseStore = storage.value.slice();
      return reverseStore.reverse();
    });

    // feature: Modal
    const createSplitterModal = ref(false);
    const createSplitterHandler = () => {
      createSplitterModal.value = true;
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

    watch(createSplitterModal, (val) => {
      if (!val) {
        clearPayees();
        payeesError.value = "";
      }
    });

    const addressInput = ref("");
    const { isDev, appChainId } = useConfig();
    if (isDev)
      addressInput.value = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
    const inputError = ref("");

    const searchHandler = () => {
      inputError.value = "";
      if (isAddress(addressInput.value)) {
        addHistory({
          address: addressInput.value,
          chainId: appChainId.value,
        });
        router.push(`/contract/${addressInput.value}`);
      } else {
        inputError.value = "invalid address";
      }
    };

    // feature: Deploy
    const { deploy } = useSplitter();
    const ownerInput = ref("");
    const deployHandler = async () => {
      if (!signer.value) throw new Error("please connect wallet at first");

      let addrs: string[] = [];
      let shares: number[] = [];
      payees.value.forEach((payee) => {
        addrs.push(payee.address);
        shares.push(payee.share);
      });
      const address = await deploy(
        signer.value,
        ownerInput.value,
        addrs,
        shares
      );
      addHistory({ address, chainId: appChainId.value });
      router.push(`/contract/${address}`);
    };

    return {
      addressInput,
      etherBalance,
      connectError,
      inputError,
      createSplitterModal,
      searchHandler,
      createSplitterHandler,

      // usePayees
      payees,
      add,
      remove,
      share,
      address,
      payeesError,

      // deploy
      ownerInput,
      deployHandler,

      // history
      reverseStorage,
      removeHistory,
      NETWORK,
    };
  },
});
</script>

<template>
  <p class="text-center text-red-600">{{ connectError }}</p>

  <div class="max-w-sm mx-auto p-1 pr-0 flex items-center">
    <input
      v-model="addressInput"
      type="text"
      placeholder="contract address"
      class="flex-1 appearance-none rounded shadow p-3 text-grey-dark mr-2 focus:outline-none"
    >
    <button
      @click="searchHandler"
      class="btn"
    >Search</button>
  </div>
  <p class="text-center text-red-600">{{ inputError }}</p>

  <div class="text-center p-6">
    <button
      @click="createSplitterHandler"
      class="btn"
    >Create Splitter</button>
  </div>

  <!-- History -->
  <div
    v-if="reverseStorage.length > 0"
    class="w-full max-w-screen-xl mx-auto px-6"
  >
    <div class="flex justify-center p-2 px-3">
      <div class="w-full max-w-md">
        <div class="bg-white shadow rounded-lg px-3 py-2 mb-4">
          <div class="py-3 text-md">
            <div class="flex justify-start px-2 py-2 my-2">
              <div class="text-lg flex-grow font-bold px-2">History</div>
            </div>
            <div
              v-for="(searchAddress, i) in reverseStorage"
              :key="i"
              class="flex justify-start rounded-md px-2 py-2 my-2 cursor-pointer text-gray-700 hover:bg-blue-100"
            >
              <span class="bg-blue-400 h-2 w-2 m-2 rounded-full"></span>
              <div class="flex-grow font-medium px-2">
                <Address :address="searchAddress.address" />
              </div>
              <div class="mr-10">
                {{ NETWORK(searchAddress.chainId)?.name }}
              </div>
              <router-link
                :to="{ name: 'Contract', params: { address: searchAddress.address }, query: { chainId: searchAddress.chainId}}"
                class="text-sm text-gray-500 tracking-wide mr-10"
              >
                <Link />
              </router-link>
              <div class="text-sm text-gray-500 tracking-wide">
                <Delete @click="removeHistory(reverseStorage.length-1-i)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ======================= Create Splitter Modal ======================= -->
  <Modal
    :modalOpen="createSplitterModal"
    @modalClose="createSplitterModal = false"
  >
    <div class="w-full relative overflow-hidden mb-4">
      <div class="bg-white mx-auto max-w-lg px-2 overflow-hidden">
        <div class="sm:flex sm:items-center">
          <div class="flex-grow">
            <h3 class="font-normal text-lg p-1 leading-tight">Owner Address</h3>
            <input
              v-model="ownerInput"
              type="text"
              placeholder="owner's address"
              class="my-2 w-full text-sm bg-grey-light text-grey-darkest rounded h-10 p-3 focus:outline-none"
            />
            <h3 class="font-normal text-lg p-1 leading-tight">Payees and Shares</h3>
            <div class="flex items-center">
              <input
                v-model="address"
                type="text"
                placeholder="payee's address"
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
                v-for="(payee,i ) in payees"
                :key="i"
                class="flex"
              >
                <div class="flex items-center mr-3">
                  <span class="bg-blue-400 h-1.5 w-1.5 m-2 rounded-full"></span>
                </div>
                <div class="w-4/6 flex items-center">
                  <p class="">
                  <Address :address="payee.address"></Address>
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
          <div class="flex-grow w-full">
            <Button
              :handlerFn="deployHandler"
              globalLoader
              loadingMsg="Deploying..."
            >Deploy</Button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>