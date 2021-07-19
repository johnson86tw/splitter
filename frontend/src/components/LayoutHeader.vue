<template>
  <header class="bg-white">
    <nav
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      aria-label="Top"
    >
      <div class="w-full py-6 flex items-center justify-between border-b border-gray-300 lg:border-none">
        <div class="flex items-center">
          <a href="/">
            <img
              class="h-10 w-auto"
              src="../assets/logo.png"
              alt="logo"
            />
          </a>
        </div>
        <div class="ml-10 space-x-4 flex">
          <div class="uppercase"> {{chain }} </div>
          <div v-if="userAddress">{{ userAddress }}</div>
          <div
            v-else-if="!isSupportedNetwork"
            class="flex items-center"
          >
            <ExclamationIcon class="h-5 w-5 text-yellow-500 mr-2" />
            <div class="text-gray-500">Unsupported network</div>
          </div>
          <button
            v-else
            @click="connectWallet"
            class="btn"
          >Connect Wallet</button>
        </div>
      </div>
      <div class="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { ExclamationIcon } from "heroicons-vue3/solid";
import useWallet from "../store/wallet";
import NETWORK from "../constants";

export default defineComponent({
  name: "LayoutHeader",
  components: { ExclamationIcon },
  setup() {
    const { userAddress, connectWallet, chainId } = useWallet();

    const isSupportedNetwork = ref(true);

    return {
      userAddress,
      isSupportedNetwork,
      chain: computed(() => NETWORK(chainId.value)?.name), // note: must use computed
      connectWallet,
    };
  },
});
</script>
