<script lang="ts">
import { defineComponent, ref } from "vue";
import useMetaMask from "../composables/metamask";
import { useNotify } from "../components/Notification.vue";
import { useRouter, useRoute } from "vue-router";
import { isAddress } from "@ethersproject/address";
import Delete from "../components/icons/Delete.vue";

export default defineComponent({
  components: { Delete },
  name: "Home",
  setup() {
    const { etherBalance, connectError } = useMetaMask();
    const router = useRouter();

    const addressInput = ref("0xe7f1725e7734ce288f8367e1bb143e90bb3f0512");
    const inputError = ref("");

    const searchHandler = () => {
      inputError.value = "";
      if (isAddress(addressInput.value)) {
        router.push(`/contract/${addressInput.value}`);
      } else {
        inputError.value = "invalid address";
      }
    };

    const createSplitterModal = ref(false);

    const createSplitterHandler = () => {
      createSplitterModal.value = true;
    };

    return {
      addressInput,
      etherBalance,
      connectError,
      inputError,
      createSplitterModal,
      searchHandler,
      createSplitterHandler,
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

    <!-- Create Splitter Modal -->
    <modal
      :modalOpen="createSplitterModal"
      @modalClose="createSplitterModal = false"
    >
      <div class="w-full relative overflow-hidden mb-8">
        <div class="bg-white mx-auto max-w-sm overflow-hidden">
          <div class="sm:flex sm:items-center">
            <div class="flex-grow">
              <h3 class="font-normal text-lg p-1 leading-tight">Owner Address</h3>
              <input
                type="text"
                placeholder="owner's address"
                class="my-2 w-full text-sm bg-grey-light text-grey-darkest rounded h-10 p-3 focus:outline-none"
              />
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
              <button class="btn w-full">Deploy</button>
            </div>
          </div>
        </div>
      </div>
    </modal>
  </div>

  <div class="w-full max-w-screen-xl mx-auto px-6">
    <div class="flex justify-center p-2 px-3">
      <div class="w-full max-w-md">
        <div class="bg-white shadow rounded-lg px-3 py-2 mb-4">
          <div class="py-3 text-md">
            <div class="flex justify-start px-2 py-2 my-2">
              <div class="text-lg flex-grow font-bold px-2">Search History</div>
            </div>
            <div class="flex justify-start rounded-md px-2 py-2 my-2 cursor-pointer text-gray-700 hover:text-blue-600  hover:bg-blue-100">
              <span class="bg-blue-400 h-2 w-2 m-2 rounded-full"></span>
              <div class="flex-grow font-medium px-2">
                <Address address="0xe7f1725e7734ce288f8367e1bb143e90bb3f0512" />
              </div>
              <div class="text-sm text-gray-500 tracking-wide">
                <delete />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>