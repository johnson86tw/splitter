<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import LayoutFooter from "./components/LayoutFooter.vue";
import LayoutHeader from "./components/LayoutHeader.vue";
import useMetaMask from "./composables/metamask";
import useConfig from "./config";
import NETWORK from "./constants";
import useNotify from "./composables/notify";

export default defineComponent({
  name: "App",
  components: { LayoutHeader, LayoutFooter },
  setup() {
    const { isSupportedNetwork } = useMetaMask();
    const { supportedChainIds } = useConfig();
    const { isNotifying, msg } = useNotify();

    const supportedChainName = computed(() => {
      let names: string[] = [];
      supportedChainIds.forEach((id) => {
        names.push(NETWORK(id)?.name!);
      });
      return names.join(", ");
    });

    return { isSupportedNetwork, supportedChainName, isNotifying, msg };
  },
});
</script>

<template>
  <layout-header />
  <div v-if="isSupportedNetwork">
    <router-view></router-view>
  </div>
  <div
    v-else
    class="text-center text-xl text-red-500 p-4"
  >
    <p>You are connected to the wrong chain. Please switch to {{ supportedChainName }}.</p>
  </div>
  <layout-footer />

  <notification
    v-if="isNotifying"
    :message="msg"
  />
</template>