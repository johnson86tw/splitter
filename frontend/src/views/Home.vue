<script lang="ts">
import { defineComponent, ref } from "vue";
import useMetaMask from "../composables/metamask";
import useNotify from "../composables/notify";
import { useRouter, useRoute } from "vue-router";
import { isAddress } from "@ethersproject/address";

export default defineComponent({
  name: "Home",
  setup() {
    const { etherBalance, connectError } = useMetaMask();
    const router = useRouter();
    const { notify } = useNotify();

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
      notify("hello");
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
    <modal
      :modalOpen="createSplitterModal"
      @modalClose="createSplitterModal = false"
    >
      <hr>
      <div class="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
      <hr>
      <div class="ml-auto">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Agree
        </button>
        <button
          @click="createSplitterModal = false"
          class="bg-transparent hover:bg-gray-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        >
          Close
        </button>
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
              <div class="flex-grow font-medium px-2">0xe7f...512</div>
              <div class="text-sm text-gray-500 tracking-wide">delete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>