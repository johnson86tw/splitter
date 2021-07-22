<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { ExclamationIcon } from "heroicons-vue3/solid";
import useMetaMask from "../composables/metamask";
import NETWORK from "../constants";

const navigation = [
  { name: "Contract", href: "/" },
  { name: "Deploy", href: "/deploy" },
];

export default defineComponent({
  name: "LayoutHeader",
  components: { ExclamationIcon },
  setup() {
    const {
      userAddress,
      connectWallet,
      chainId,
      isConnected,
      isSupportedNetwork,
      hasSetupWallet,
    } = useMetaMask();

    const displayUserAddress = computed(() => {
      return (
        userAddress.value.slice(0, 6) + "..." + userAddress.value.slice(-4)
      );
    });

    return {
      displayUserAddress,
      isSupportedNetwork,
      chainName: computed(() => NETWORK(chainId.value)?.name), // note: must use computed
      connectWallet,
      isConnected,
      hasSetupWallet,
      navigation,
    };
  },
});
</script>

<template>
  <header class="bg-white">
    <nav
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      aria-label="Top"
    >
      <div class="w-full py-4 flex items-center justify-between border-b border-gray-300">
        <div class="flex items-center">
          <div class="mr-10">
            <router-link to="/">
              <img
                class="h-10 min-w-10"
                src="../assets/logo.png"
                alt="logo"
              />
            </router-link>
          </div>
          <div>
            <router-link
              v-for="link in navigation"
              :key="link.name"
              :to="link.href"
              active-class="font-bold"
              exact
              class="mr-5 font-medium text-gray-500 hover:text-gray-900"
            >
              {{ link.name }}
            </router-link>
          </div>
        </div>

        <div class="ml-10 space-x-4 flex">
          <div
            v-if="!isSupportedNetwork"
            class="flex items-center"
          >
            <ExclamationIcon class="h-5 w-5 text-yellow-500 mr-2" />
            <div class="text-gray-500"> <span class="uppercase">{{ chainName }}</span> is unsupported network</div>
          </div>
          <div
            v-else-if="isConnected() && hasSetupWallet"
            class="flex items-center"
          >
            <div class="uppercase mr-4 py-3 px-4 rounded inline-block bg-light-blue-100 text-gray-600">{{ chainName }}</div>
            <div class="py-3 px-4 rounded inline-block bg-gray-100 text-gray-600">{{ displayUserAddress }}</div>
          </div>
          <button
            v-else
            @click="connectWallet"
            class="btn"
          >Connect Wallet</button>
        </div>
      </div>
      <div class="py-4 flex flex-wrap justify-center space-x-6">
      </div>
    </nav>
  </header>
</template>

