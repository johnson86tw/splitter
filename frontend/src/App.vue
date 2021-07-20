<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from "vue";
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
  <div class="text-center">
    <p
      class="text-red-600"
      v-if="changedChainName"
    > Warning: chain is changed into {{ changedChainName }}</p>
    <p v-if="connectError">{{ connectError }}</p>

    <p>ETH: {{ etherBalance }}</p>
    <p>Greet: {{ greet }}</p>

  </div>

  <div class="flex p-12">
    <input
      @keyup.enter="setGreeting(greetInput)"
      v-model="greetInput"
      type="text"
      class="input w-12"
    >
    <button
      @click="setGreeting(greetInput)"
      class="btn"
    >setGreeting</button>
  </div>

  <div
    class="p-10"
    v-if="errMsg"
  >
    <p>Contract Error Message</p>
    <p class="text-red-600"> {{ errMsg }} </p>
  </div>

</template>