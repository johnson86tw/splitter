<template>
  <layout-header />
  <p class="text-center">ETH: {{ balance }}</p>
  <p class="text-center">{{ greet }}</p>

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

<script lang="ts">
import { utils } from "ethers";
import { defineComponent, onMounted, ref } from "vue";
import LayoutHeader from "./components/LayoutHeader.vue";
import useWallet from "./store/wallet";
import useContract from "./store/contract";

export default defineComponent({
  name: "App",
  components: { LayoutHeader },
  setup() {
    const { connectWallet, signer } = useWallet();
    const { greet, getGreeting, setGreeting, initContract } = useContract();

    const greetInput = ref("");
    const balance = ref("");

    onMounted(async () => {
      // await connectWallet();
      if (signer.value) {
        const balanceBN = await signer.value?.getBalance();
        balance.value = utils.formatEther(balanceBN);
        // initContract(signer.value);
      }
      // await getGreeting();
    });

    return {
      greet,
      balance,
      greetInput,
      setGreeting,
    };
  },
});
</script>