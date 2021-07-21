<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import LayoutHeader from "./components/LayoutHeader.vue";
import useMetaMask from "./composables/metamask";
import useGreeterContract from "./composables/greeter";
import NETWORK from "./constants";

export default defineComponent({
  name: "App",
  components: { LayoutHeader },
  setup() {
    const { etherBalance, changedChainId, connectError } = useMetaMask();
    const { setGreeting, greet, errMsg } = useGreeterContract();

    const greetInput = ref("");

    return {
      errMsg,
      greet,
      greetInput,
      changedChainName: computed(() => NETWORK(changedChainId.value)?.name),
      etherBalance,
      connectError,
      setGreeting,
    };
  },
});
</script>

<template>
  <layout-header />
  <router-view></router-view>
</template>