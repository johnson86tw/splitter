<script lang="ts">
import { defineComponent } from 'vue'
import LayoutFooter from './components/LayoutFooter.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import Notification from './components/Notification.vue'
import Loader from './components/Loader.vue'

import useConfig from './config'

export default defineComponent({
  name: 'App',
  components: { LayoutHeader, LayoutFooter, Notification, Loader },
  setup() {
    const { isSupportedNetwork, unmatchedNetwork, supportedChainName } =
      useConfig()

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
  <notification />
</template>
