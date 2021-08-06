<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import Address from "../components/Address.vue";
import Modal from "../components/Modal.vue";
import useSplitter from "../composables/splitter";

export default defineComponent({
  components: { Modal, Address },
  name: "Contract",
  setup() {
    const route = useRoute();
    const { state } = useSplitter();

    const contractAddr = route.params.address;
    const settingModal = ref(false);
    const settingHandler = () => {
      settingModal.value = true;
    };

    return {
      state,
      settingModal,
      contractAddr: computed(() => contractAddr),
      settingHandler,
    };
  },
});
</script>

<template>
  <div class="w-full max-w-screen-xl mx-auto px-6">
    <div class="flex justify-center p-2 px-3">
      <div class="w-full max-w-md">
        <div class="p-5">
          <p class="text-lg text-center font-bold">Contract Address</p>
          <p class="text-center text-gray-500">
            <Address
              :address="contractAddr"
              :short="false"
            />
          </p>
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
          <p class="text-xl text-gray-500">{{ state.totalReceived }} ETH</p>
        </div>
        <div class="w-1/2 rounded shadow p-5 ml-2">
          <p class="text-lg font-bold">State</p>
          <p class="text-xl text-gray-500">{{ state.state }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="w-full max-w-screen-xl mx-auto px-6">
    <div class="flex justify-center p-2 px-3">
      <div class="w-full max-w-md">
        <div class="bg-white shadow rounded-lg px-3 py-2 mb-4">
          <div class="py-3">
            <div class="flex justify-start items-center px-2 py-2 my-2">
              <div class="text-lg font-bold px-2">Owner</div>
              <div class="text-lg flex-grow text-gray-500">
                <Address :address="state.owner" />
              </div>
              <!-- only owner -->
              <tune @click="settingHandler" />

              <!-- ======================= Start of Setting Modal ======================= -->
              <modal
                :modalOpen="settingModal"
                @modalClose="settingModal = false"
              >
                <div class="w-full relative overflow-hidden mb-8">
                  <div class="bg-white mx-auto max-w-sm overflow-hidden">
                    <div class="sm:flex sm:items-center">
                      <div class="flex-grow">
                        <h3 class="font-normal text-lg p-1 leading-tight">Payees and Shares</h3>
                        <div class="flex items-center">
                          <input
                            type="text"
                            placeholder="payee's address"
                            class="my-2 mr-2 text-sm bg-grey-light text-grey-darkest rounded h-10 p-3 focus:outline-none"
                          />
                          <input
                            type="number"
                            placeholder="shares"
                            class="my-2 mr-2 w-2/7 text-sm bg-grey-light text-grey-darkest rounded h-10 p-3 focus:outline-none"
                          />
                          <button class="h-10 flex-grow px-3 py-1 rounded inline-block bg-blue-100 text-gray-600 cursor-pointer hover:bg-blue-200 focus:outline-none disabled:cursor-default disabled:opacity-70 disabled:bg-blue-100">
                            Add
                          </button>
                        </div>
                        <div class="w-full">
                          <div class="flex">
                            <div class="flex items-center mr-3">
                              <span class="bg-blue-400 h-1.5 w-1.5 m-2 rounded-full"></span>
                            </div>
                            <div class="w-4/6 flex items-center">
                              <p class="">Kevin Durant</p>
                            </div>
                            <div class="w-1/6 flex items-center">
                              <p class="text-sm text-grey-dark">30%</p>
                            </div>
                            <div class="w-1/6 flex justify-center items-center">
                              <p class="text-sm text-grey-dark">
                                <delete />
                              </p>
                            </div>
                          </div>
                          <div class="flex">
                            <div class="flex items-center mr-3">
                              <span class="bg-blue-400 h-1.5 w-1.5 m-2 rounded-full"></span>
                            </div>
                            <div class="w-4/6 flex items-center">
                              <p class="">Kevin Durant</p>
                            </div>
                            <div class="w-1/6 flex items-center">
                              <p class="text-sm text-grey-dark">30%</p>
                            </div>
                            <div class="w-1/6 flex justify-center items-center">
                              <p class="text-sm text-grey-dark">
                                <delete />
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="sm:flex bg-grey-light sm:items-center py-4">
                      <div class="flex-grow">
                        <button class="btn w-full">Send Transaction</button>
                      </div>
                    </div>
                  </div>
                </div>
              </modal>
              <!-- ======================= End of Setting Modal ======================= -->
            </div>

            <div class="flex justify-start items-center px-2 py-2 my-2">
              <div class="text-lg flex-grow font-bold px-2">Payees</div>
              <div class="text-lg text-gray-500 tracking-wide">Total: {{ state.totalPayees }}</div>
            </div>

            <div
              v-for="payee in state.payees"
              :key="payee.address"
              class="flex justify-start rounded-md px-2 py-2 my-2"
            >
              <span class="bg-blue-400 h-2 w-2 m-2 rounded-full"></span>
              <div class="flex-grow font-medium px-2">
                <Address :address="payee.address" />
              </div>
              <div class="text-sm text-gray-500 tracking-wide mr-6"> {{ payee.share }} %</div>
              <div class="text-sm text-gray-500 tracking-wide">{{ payee.available }} ETH</div>
            </div>
          </div>
          <!-- only payees -->
          <button class="btn w-full">Withdraw</button>
        </div>
      </div>
    </div>
  </div>
</template>