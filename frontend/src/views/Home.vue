<script lang="ts">
import { defineComponent, ref } from "vue";
import useMetaMask from "../composables/metamask";
import { useRouter, useRoute } from "vue-router";
import { isAddress } from "@ethersproject/address";

export default defineComponent({
  name: "Home",
  setup() {
    const { etherBalance, connectError } = useMetaMask();
    const router = useRouter();

    const addressInput = ref("");
    const inputError = ref("");

    const searchHandler = () => {
      inputError.value = "";
      if (isAddress(addressInput.value)) {
        router.push(`/contract/${addressInput.value}`);
      } else {
        inputError.value = "invalid address";
      }
    };

    return {
      addressInput,
      etherBalance,
      connectError,
      inputError,
      searchHandler,
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
    <button class="btn">Create Splitter</button>
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
              <div class="flex-grow font-medium px-2">0xe7f1...512</div>
              <div class="text-sm text-gray-500 tracking-wide">delete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>