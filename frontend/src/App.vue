<template>
  <layout-header />
  <p class="text-center">hello vue3</p>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import LayoutHeader from "./components/LayoutHeader.vue";
import useWallet from "./store/wallet";

export default defineComponent({
  name: "App",
  components: { LayoutHeader },
  setup() {
    const { connectWallet, provider } = useWallet();

    onMounted(async () => {
      await connectWallet();
    });
  },
});
</script>