<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import useMetaMask from "../composables/metamask";
import useGreeterContract from "../composables/greeter";

export default defineComponent({
  name: "Home",
  setup() {
    const { etherBalance, connectError } = useMetaMask();
    const { setGreeting, greet, errMsg, greeterAddress } = useGreeterContract();

    const greetInput = ref("");
    const displayGreeterAddress = computed(() =>
      greeterAddress.value
        ? greeterAddress.value.slice(0, 6) +
          "..." +
          greeterAddress.value.slice(-4)
        : ""
    );

    return {
      errMsg,
      greet,
      greetInput,
      etherBalance,
      connectError,
      displayGreeterAddress,
      setGreeting,
    };
  },
});
</script>

<template>
  <div class="text-center">
    <p>Connect to your own Greeter contract</p>
    <p>{{ connectError }}</p>

    <p>ETH: {{ etherBalance }}</p>
  </div>

  <div class="flex justify-center">
    <div class="p-12 sm:w-8/12 md:w-1/2 lg:w-5/12">
      <label
        for="ContractAddress"
        class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
      >Contract Address</label>
      <div class="flex justify-between">
        <input
          id="ContractAddress"
          type="ContractAddress"
          name="ContractAddress"
          placeholder="0x..."
          autocomplete="ContractAddress"
          class="w-full p-3 mt-2 mr-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          required
        />
        <button class="btn mt-2">Connect</button>
      </div>
    </div>
  </div>

  <div
    class="p-10"
    v-if="errMsg"
  >
    <p>Contract Error Message</p>
    <p class="text-red-600"> {{ errMsg }} </p>
  </div>

  <div class="grid place-items-center">
    <div class="w-full border shadow p-8 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
      <div class="text-center p-2">
        {{ displayGreeterAddress }}
        <p>Greeting: {{ greet }}</p>
      </div>

      <div class="flex justify-between gap-3">
        <span class="w-full">
          <!-- Greeting -->
          <label
            for="Greeting"
            class="block text-xs font-semibold text-gray-600 uppercase"
          >Greeting</label>
          <input
            id="Greeting"
            name="Greeting"
            placeholder="Hello World"
            @keyup.enter="setGreeting(greetInput)"
            v-model="greetInput"
            type="text"
            class="block w-full p-3 mt-2 text-gray-700 bg-gray-100 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            required
          >
        </span>
      </div>
      <button
        @click="setGreeting(greetInput)"
        class="btn w-full my-4"
      >setGreeting</button>
    </div>
  </div>
</template>