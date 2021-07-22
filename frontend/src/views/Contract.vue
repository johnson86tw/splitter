<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import useMetaMask from "../composables/metamask";
import useGreeterContract from "../composables/greeter";
import { Greeter } from "@splitter/contracts/typechain/Greeter";

export default defineComponent({
  name: "Contract",
  setup() {
    const { etherBalance, connectError, getBalance } = useMetaMask();
    const { connectContractAt } = useGreeterContract();

    const greetingInput = ref("");
    const greeter = ref<Greeter>();
    const greeting = ref<string>();
    const errMsg = ref("");
    const txPending = ref(false);

    const addressAt = ref("");
    const connect = async () => {
      errMsg.value = "";

      try {
        const _greeter = connectContractAt(addressAt.value);
        greeter.value = await _greeter?.deployed();
        txPending.value = true;
        greeting.value = await greeter.value?.greet();
      } catch (e) {
        errMsg.value = e.message;
      } finally {
        txPending.value = false;
      }
    };

    async function getGreeting() {
      errMsg.value = "";
      try {
        greeting.value = await greeter.value?.greet();
      } catch (e) {
        errMsg.value = e.message;
      }
    }

    async function setGreeting(greet: string) {
      errMsg.value = "";
      try {
        txPending.value = true;
        const tx = await greeter.value?.setGreeting(greet);
        // @todo add tx pending state
        await tx?.wait();
        await getGreeting();
        await getBalance();
        greetingInput.value = "";
      } catch (e) {
        errMsg.value = e.message;
      } finally {
        txPending.value = false;
      }
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
      addressAt,
      greeter,
      greeting,
      errMsg,
      txPending,
      setGreeting,
      connect,
    };
  },
});
</script>

<template>
  <div class="text-center text-warm-gray-600">
    <p class="text-xl">Connect to your own Greeter contract</p>
    <p>{{ connectError }}</p>

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
          v-model="addressAt"
          id="ContractAddress"
          type="ContractAddress"
          name="ContractAddress"
          placeholder="0x..."
          autocomplete="ContractAddress"
          class="w-full p-3 mt-2 mr-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          required
        />
        <button
          @click="connect"
          class="btn mt-2"
        >Connect</button>
      </div>
    </div>
  </div>

  <div
    v-if="errMsg"
    class="p-4 text-center"
  >
    <p class="text-red-600"> Error: {{ errMsg }} </p>
  </div>

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
        @click="setGreeting(greetingInput)"
        class="btn w-full my-4"
        :disabled="txPending"
      >{{ txPending ? "pending" : "setGreeting" }}</button>
    </div>
  </div>
</template>