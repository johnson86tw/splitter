<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import LayoutHeader from "./components/LayoutHeader.vue";
import useWallet from "./store/wallet";
import useContract from "./store/contract";
import NETWORK from "./constants";

export default defineComponent({
  name: "App",
  components: { LayoutHeader },
  setup() {
    const { etherBalance, changedChainId, connectError } = useWallet();
    const { greet, getGreeting, setGreeting, initContract } = useContract();

    const greetInput = ref("");

    return {
      greet,
      greetInput,
      setGreeting,
      changedChainName: computed(() => NETWORK(changedChainId.value)?.name),
      etherBalance,
      connectError,
    };
  },
});
</script>

<template>
  <layout-header />
  <div class="text-center">
    <p
      class="text-red-600"
      v-if="changedChainName"
    > Warning: chain is changed into {{ changedChainName }}</p>
    <p v-if="connectError">{{ connectError }}</p>

    <p>ETH: {{ etherBalance }}</p>
    <p>{{ greet }}</p>

  </div>

  <div class="flex p-12">
    <input
      v-model="greetInput"
      type="text"
      class="input w-12"
    >
    <button
      @click="setGreeting(greetInput)"
      class="btn"
    >setGreeting</button>
  </div>

</template>