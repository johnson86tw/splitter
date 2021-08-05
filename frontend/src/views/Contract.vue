<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "Contract",
  setup() {
    const route = useRoute();
    const contractAddr = route.params.address;

    return { contractAddr: computed(() => contractAddr) };
  },
});
</script>

<template>

  <div class="w-full max-w-screen-xl mx-auto px-6">
    <div class="flex justify-center p-2 px-3">
      <div class="w-full max-w-md">
        <div class="p-5">
          <p class="text-lg text-center font-bold">Contract Address</p>
          <p class="text-center text-gray-500">{{ contractAddr }}</p>
        </div>
        <button class="btn w-full">Send Ether</button>
      </div>
    </div>
  </div>

  <div class="w-full max-w-screen-xl mx-auto px-6">
    <div class="flex justify-center p-4 px-3">
      <div class="flex w-full max-w-md">
        <div class="w-1/2 rounded shadow p-5 mr-2">
          <p class="text-lg font-bold">Total Received</p>
          <p class="text-xl text-gray-500">3000.0234 ETH</p>
        </div>
        <div class="w-1/2 rounded shadow p-5 ml-2">
          <p class="text-lg font-bold">State</p>
          <p class="text-xl text-gray-500">Finalized</p>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="w-full max-w-screen-xl mx-auto px-6">
    <div class="flex justify-center p-2 px-3">
      <div class="flex w-full max-w-md">
        <div class="w-full rounded shadow p-5">
          <span class="text-lg font-bold mr-2">Owner</span>
          <span>0xe7f1...512</span>
        </div>
      </div>
    </div>
  </div> -->

  <div class="w-full max-w-screen-xl mx-auto px-6">
    <div class="flex justify-center p-2 px-3">
      <div class="w-full max-w-md">
        <div class="bg-white shadow rounded-lg px-3 py-2 mb-4">
          <div class="py-3">
            <div class="flex justify-start items-center px-2 py-2 my-2">
              <div class="text-lg font-bold px-2">Owner</div>
              <div class="text-lg flex-grow text-gray-500">0xe7f1...512</div>
              <!-- only owner -->
              <button class="text-sm text-gray-500 tracking-wide px-4 py-1 rounded inline-block bg-blue-100 text-gray-600 text-xl cursor-pointer hover:bg-blue-200 focus:outline-none disabled:cursor-default disabled:opacity-70 disabled:bg-blue-100">
                Setting
              </button>
            </div>

            <div class="flex justify-start items-center px-2 py-2 my-2">
              <div class="text-lg flex-grow font-bold px-2">Payees</div>
              <div class="text-lg text-gray-500 tracking-wide">Total: 4</div>
            </div>

            <div class="flex justify-start rounded-md px-2 py-2 my-2">
              <span class="bg-blue-400 h-2 w-2 m-2 rounded-full"></span>
              <div class="flex-grow font-medium px-2">0xe7f1...512</div>
              <div class="text-sm text-gray-500 tracking-wide mr-6">30%</div>
              <div class="text-sm text-gray-500 tracking-wide">0.2455 ETH</div>
            </div>
          </div>
          <!-- only payees -->
          <button class="btn w-full">Withdraw</button>
        </div>
      </div>
    </div>
  </div>
</template>