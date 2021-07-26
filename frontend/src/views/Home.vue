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
  <p class="text-center text-red-600">{{ connectError }}</p>

</template>