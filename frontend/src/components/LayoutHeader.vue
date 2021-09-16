<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import useConfig from '../config'
import Address from './Address.vue'
import { useBoard, useEthers, displayEther, displayChainName } from 'vue-dapp'

const navigation: { name: string; href: string }[] = []

export default defineComponent({
  components: { Address },
  name: 'LayoutHeader',
  setup() {
    const { open: openBoard } = useBoard()
    const { address, balance, chainId, isActivated } = useEthers()
    const {
      isSupportedNetwork,
      unmatchedNetwork,
      appChainId,
      supportedChainIds,
      changeAppChainId,
      supportedChainNames,
    } = useConfig()

    const dropdown = ref(false)
    const dropdownHandler = () => {
      dropdown.value = !dropdown.value
    }

    const chainName = computed(() => {
      return appChainId.value ? displayChainName(appChainId.value) : ''
    })

    return {
      openBoard,
      address,
      chainId,
      appChainId,
      displayBalance: computed(() => displayEther(balance.value)),
      isSupportedNetwork,
      unmatchedNetwork,
      chainName,
      supportedChainNames,
      isActivated,
      navigation,
      dropdown,
      supportedChainIds,
      dropdownHandler,
      changeAppChainId,
    }
  },
})
</script>

<template>
  <header class="w-full px-4">
    <div class="flex justify-between p-4 px-3">
      <nav class="w-full">
        <div class="flex items-center justify-between">
          <div class="flex space-x-4 items-center">
            <div class="">
              <router-link to="/">
                <img
                  class="h-10 min-w-10"
                  src="../assets/logo.png"
                  alt="logo"
                />
              </router-link>
            </div>
            <router-link
              v-for="link in navigation"
              :key="link.name"
              :to="link.href"
              active-class="font-bold"
              exact
              class="font-medium text-gray-500 hover:text-gray-900"
            >
              {{ link.name }}
            </router-link>
          </div>

          <div class="flex items-center space-x-4">
            <div class="relative inline-block text-left">
              <div>
                <button
                  @click="dropdownHandler"
                  v-click-outside="() => (dropdown = false)"
                  type="button"
                  class="
                    inline-flex
                    justify-center
                    w-full
                    capitalize
                    rounded-md
                    border border-gray-300
                    shadow-sm
                    px-4
                    py-2
                    bg-white
                    text-sm
                    font-medium
                    text-gray-700
                    hover:bg-gray-50
                    focus:outline-none
                  "
                  aria-expanded="true"
                  aria-haspopup="true"
                >
                  {{ chainName }}
                  <svg
                    class="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div
                v-if="dropdown"
                class="
                  origin-top-right
                  absolute
                  right-0
                  mt-2
                  w-30
                  rounded-md
                  shadow-lg
                  bg-white
                  ring-1 ring-black ring-opacity-5
                  focus:outline-none
                "
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1"
              >
                <div
                  class="py-1"
                  role="none"
                >
                  <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                  <div
                    v-for="(chainName, i) in supportedChainNames"
                    :key="i"
                    @click="changeAppChainId(supportedChainIds[i])"
                    href="#"
                    class="
                      text-gray-700
                      capitalize
                      block
                      px-4
                      py-2
                      text-sm
                      hover:bg-gray-100
                      cursor-pointer
                    "
                    role="menuitem"
                    tabindex="-1"
                    id="menu-item-0"
                  >
                    {{ chainName }}
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="!isSupportedNetwork"
              class="flex items-center"
            >
              <div class="text-gray-500">unsupported network</div>
            </div>

            <div
              v-else-if="unmatchedNetwork"
              class="flex items-center"
            >
              <div class="text-gray-500">unmatched network</div>
            </div>

            <div
              v-else-if="isActivated"
              class="flex items-center"
            >
              <!-- Account -->
              <div class="sm:hidden py-2 px-3 rounded-2xl inline-block bg-gray-100">
                <Address :address="address" />
              </div>

              <div class="
                  hidden
                  sm:flex
                  py-1
                  px-2
                  flex
                  items-center
                  rounded-3xl
                  border border-solid
                ">
                <div class="px-1 mr-1">{{ displayBalance }} ETH</div>
                <div class="py-2 px-3 rounded-2xl inline-block bg-gray-100">
                  <Address :address="address" />
                </div>
              </div>
            </div>

            <button
              v-else
              @click="openBoard"
              class="btn-gray"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
