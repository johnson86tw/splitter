<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import useMetaMask from "../composables/metamask";
import {
  useGetGreeting,
  useGreeterContract,
  useSetGreeting,
} from "../composables/greeter";
import { Greeter } from "@splitter/contracts/typechain/Greeter";

export default defineComponent({
  name: "Contract",
  setup() {
    const { etherBalance, connectError, getBalance } = useMetaMask();
    const { connectContractAt } = useGreeterContract();
    const { greeting, getGreeting } = useGetGreeting();
    const {
      setGreeting,
      errMsg: setGreetingErr,
      isPending: setGreetingPending,
    } = useSetGreeting();

    const greeter = ref<Greeter>();

    const addressInput = ref("");
    const errMsg = ref("");
    const deployPending = ref(false);

    const connectContractBtn = async () => {
      errMsg.value = "";

      try {
        const _greeter = connectContractAt(addressInput.value);
        greeter.value = await _greeter?.deployed();
        deployPending.value = true;
        getGreeting(greeter.value!);
      } catch (e) {
        errMsg.value = e.message;
      } finally {
        deployPending.value = false;
      }
    };

    const greetingInput = ref("");
    async function setGreetingBtn() {
      await setGreeting(greeter.value!, greetingInput.value);
      greetingInput.value = "";
      getGreeting(greeter.value!);
      getBalance();
    }

    const greeterAddress = computed(() =>
      greeter.value && greeter.value ? greeter.value.address : ""
    );

    const displayGreeterAddress = computed(() =>
      greeter.value
        ? greeterAddress.value?.slice(0, 6) +
          "..." +
          greeterAddress.value?.slice(-4)
        : ""
    );

    return {
      etherBalance,
      connectError,
      greetingInput,
      displayGreeterAddress,
      addressInput,
      greeter,
      greeting,
      errMsg,
      setGreetingErr,
      deployPending,
      setGreetingPending,
      setGreetingBtn,
      connectContractBtn,
    };
  },
});
</script>

<template>
  <div class="text-center text-warm-gray-600">
    <p class="text-red-600">{{ connectError }}</p>
    <p class="text-xl">Connect to your own Greeter contract</p>
    <p>ETH: {{ etherBalance }}</p>
  </div>

  <div class="flex justify-center">
    <div class="p-8 pb-4 sm:w-8/12 md:w-1/2 lg:w-5/12">
      <label
        for="ContractAddress"
        class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
      >Contract Address</label>
      <div class="flex justify-between">
        <input
          v-model="addressInput"
          id="ContractAddress"
          type="ContractAddress"
          name="ContractAddress"
          placeholder="0x..."
          autocomplete="ContractAddress"
          class="w-full p-3 mt-2 mr-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          required
        />
        <button
          @click="connectContractBtn()"
          class="btn mt-2"
        >Connect</button>
      </div>
    </div>
  </div>
  <p class="p-4 text-center text-red-600"> {{ errMsg }} </p>

  <div
    v-if="greeter"
    class="grid place-items-center"
  >
    <div class="w-full border shadow p-8 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
      <div class="text-center p-2">
        {{ displayGreeterAddress }}
        <p>Greeting: {{ greeting }}</p>
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
            v-model="greetingInput"
            type="text"
            class="block w-full p-3 mt-2 text-gray-700 bg-gray-100 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            required
          >
        </span>
      </div>
      <button
        @click="setGreetingBtn()"
        class="btn w-full my-4"
        :disabled="setGreetingPending"
      >{{ setGreetingPending ? "pending" : "setGreeting" }}</button>
    </div>

    <p class="p-4 text-center text-red-600"> {{ setGreetingErr }} </p>
  </div>
</template>