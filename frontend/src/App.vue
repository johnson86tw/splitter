<script setup lang="ts">
import { markRaw } from 'vue'
import LayoutFooter from './components/LayoutFooter.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import Loader from './components/Loader.vue'

import { ethers } from 'ethers'
import {
  BrowserWalletConnector,
  VueDappProvider,
  useVueDapp,
} from '@vue-dapp/core'
import { VueDappModal } from '@vue-dapp/modal'
import '@vue-dapp/modal/dist/style.css'
import { notify } from '@kyvg/vue3-notification'
import { useDappStore } from './stores/dappStore'

const dappStore = useDappStore()

try {
  dappStore.init()
} catch (err: any) {
  console.error(err)
}

const { addConnectors, onWalletUpdated } = useVueDapp()

addConnectors([new BrowserWalletConnector()])

onWalletUpdated(({ provider }) => {
  const ethersProvider = new ethers.providers.Web3Provider(provider)
  dappStore.provider = markRaw(ethersProvider)
  dappStore.signer = markRaw(ethersProvider.getSigner())

  notify({
    text: 'Wallet Updated',
    type: 'warn',
  })
})
</script>

<template>
  <VueDappProvider>
    <layout-header />
    <div v-if="dappStore.isSupportedNetwork && !dappStore.unmatchedNetwork">
      <router-view></router-view>
    </div>
    <div v-else class="text-center text-xl text-red-500 p-4">
      <p>
        You are connected to the wrong chain. Please switch to
        {{ dappStore.supportedChainName }}.
      </p>
    </div>
    <layout-footer />

    <loader />
    <notifications
      position="bottom right"
      :width="300"
      animation-name="fade-down"
    />

    <VueDappModal v-model="dappStore.isConnectModalOpen" />
  </VueDappProvider>
</template>

<style>
.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 0.5s;
}
.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
