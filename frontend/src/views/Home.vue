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
      class="bg-blue-600 text-white text-base font-semibold rounded-md shadow-md hover:bg-indigo-600 p-3"
    >Search</button>
  </div>
  <p class="text-center text-red-600">{{ inputError }}</p>

</template>