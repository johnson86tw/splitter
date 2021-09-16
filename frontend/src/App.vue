<script lang="ts">
import { defineComponent } from 'vue'
import LayoutFooter from './components/LayoutFooter.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import Loader from './components/Loader.vue'

import useConfig from './config'
import { useWallet } from 'vue-dapp'
import { notify } from '@kyvg/vue3-notification'

export default defineComponent({
  name: 'App',
  components: { LayoutHeader, LayoutFooter, Loader },
  setup() {
    const { isSupportedNetwork, unmatchedNetwork, supportedChainName } =
      useConfig()
    const { onAccountsChanged, onChainChanged } = useWallet()

    onAccountsChanged(() => {
      notify({
        text: 'Account Changed',
        type: 'warn',
      })
    })

    onChainChanged(() => {
      notify({
        text: 'Chain Changed',
        type: 'warn',
      })
    })

    return { isSupportedNetwork, unmatchedNetwork, supportedChainName }
  },
})
</script>

<template>
  <layout-header />
  <div v-if="isSupportedNetwork && !unmatchedNetwork">
    <router-view></router-view>
  </div>
  <div
    v-else
    class="text-center text-xl text-red-500 p-4"
  >
    <p>
      You are connected to the wrong chain. Please switch to
      {{ supportedChainName }}.
    </p>
  </div>
  <layout-footer />
  <vdapp-board />
  <loader />
  <notifications
    position="bottom right"
    :width="300"
    animation-name="fade-down"
  />
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