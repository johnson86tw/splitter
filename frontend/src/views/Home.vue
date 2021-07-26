<script lang="ts">
import { defineComponent, ref } from "vue";
import useMetaMask from "../composables/metamask";

export default defineComponent({
  name: "Home",
  setup() {
    const { etherBalance, connectError } = useMetaMask();

    return {
      etherBalance,
      connectError,
    };
  },
});
</script>

<template>
  <div class="text-center text-gray-600">
    <p class="text-red-600">{{ connectError }}</p>
    <p>ETH: {{ etherBalance }}</p>
  </div>
</template>