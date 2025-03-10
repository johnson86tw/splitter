<script lang="ts">
import { isAddress } from '@ethersproject/address'
import { computed, defineComponent, ref } from 'vue'
import useClipboard from 'vue-clipboard3'
import { shortenAddress } from 'vue-dapp'

export default defineComponent({
  props: {
    address: {
      type: String,
      required: true,
    },
    short: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { toClipboard } = useClipboard()

    const isCopied = ref(false)

    const copy = async () => {
      try {
        await toClipboard(props.address)
        isCopied.value = true
        setTimeout(() => {
          isCopied.value = false
        }, 1500)
      } catch (e) {
        console.error(e)
      }
    }

    const displayAddress = computed(() => {
      let address: string = props.address
      if (!isAddress(address)) address = ''
      if (props.short) {
        return shortenAddress(address)
      }
      return address
    })

    return {
      displayAddress,
      isCopied,
      copy,
    }
  },
})
</script>

<template>
  <span class="cursor-pointer hover:text-blue-400">
    {{ displayAddress }}
  </span>
  <div class="relative inline-block">
    <Copy
      @click="copy"
      class="w-4 mx-1 inline-block"
    > </Copy>

    <div
      v-if="isCopied"
      class="absolute bottom-7 -left-3 mx-2 w-16"
    >
      <div class="bg-black text-white text-sm rounded py-1 text-center">
        copied
        <svg
          class="absolute text-black h-2 left-0 ml-3 top-full"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
          xml:space="preserve"
        >
          <polygon
            class="fill-current"
            points="0,0 127.5,127.5 255,0"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
