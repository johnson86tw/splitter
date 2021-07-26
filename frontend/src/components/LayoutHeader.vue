<script lang="ts">
import { computed, defineComponent } from "vue";
import useMetaMask from "../composables/metamask";
import NETWORK from "../constants";

const navigation: { name: string; href: string }[] = [];

export default defineComponent({
  name: "LayoutHeader",
  setup() {
    const {
      chainId,
      userAddress,
      isSupportedNetwork,
      hasSetupWallet,
      etherBalance,
      connectWallet,
      isConnected,
    } = useMetaMask();

    const displayUserAddress = computed(() => {
      return (
        userAddress.value.slice(0, 6) + "..." + userAddress.value.slice(-4)
      );
    });

    return {
      displayBalance: computed(() => Number(etherBalance.value).toFixed(3)),
      displayUserAddress,
      isSupportedNetwork,
      chainName: computed(() => NETWORK(chainId.value)?.name), // note: must use computed
      hasSetupWallet,
      navigation,
      connectWallet,
      isConnected,
    };
  },
});
</script>

<template>
  <header class="bg-white">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-4 flex items-center justify-between border-b border-solid">
        <div class="flex space-x-4 items-center">
          <div class="">
            <router-link to="/">
              <img
                class="h-10 min-w-10"
                src="../assets/logo.png"
                alt="logo"
              />
            </router-link>
          </div>
          <router-link
            v-for="link in navigation"
            :key="link.name"
            :to="link.href"
            active-class="font-bold"
            exact
            class="font-medium text-gray-500 hover:text-gray-900"
          >
            {{ link.name }}
          </router-link>

        </div>

        <div class="flex space-x-4">
          <div
            v-if="!isSupportedNetwork"
            class="flex items-center"
          >
            <div class="text-gray-500"> <span class="capitalize">{{ chainName }}</span> is unsupported network</div>
          </div>
          <div
            v-else-if="isConnected() && hasSetupWallet"
            class="flex items-center"
          >
            <!-- Account -->
            <div class="capitalize mr-4 py-2 px-4 rounded-2xl inline-block bg-light-blue-100 text-gray-600">{{ chainName }}</div>
            <div class="py-1 px-2 flex items-center rounded-2xl border border-solid">
              <div class="px-1 mr-1"> {{ displayBalance }} ETH </div>
              <div class="py-2 px-3 rounded-2xl inline-block bg-gray-100">{{ displayUserAddress }}</div>
            </div>
          </div>
          <button
            v-else
            @click="connectWallet"
            class="ml-2 p-2 sm:text-xl sm:px-6 sm:py-3 rounded inline-block bg-blue-100 text-gray-600 cursor-pointer hover:bg-blue-200 focus:outline-none"
          >Connect Wallet</button>
        </div>
      </div>
      <div class="py-4 flex flex-wrap justify-center space-x-6">
      </div>
    </nav>
  </header>
</template>

