<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import useClipboard from "vue-clipboard3";

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
  setup({ address, short }) {
    const { toClipboard } = useClipboard();

    const isCopied = ref(false);

    const copy = async () => {
      try {
        await toClipboard(address);
        isCopied.value = true;
        setTimeout(() => {
          isCopied.value = false;
        }, 1500);
      } catch (e) {
        console.error(e);
      }
    };

    const displayAddress = computed(() => {
      if (short) {
        return address.slice(0, 6) + "..." + address.slice(-4);
      }
      return address;
    });

    return {
      displayAddress,
      isCopied,
      copy,
    };
  },
});
</script>

<template>

  <span class="cursor-pointer hover:text-blue-400">
    {{ displayAddress }}
  </span>
  <div class="relative inline-block">
    <Copy
      @click="copy"
      class="w-4 mx-1 inline-block"
    >
    </Copy>

    <div
      v-if="isCopied"
      class="absolute bottom-7 -left-3 mx-2 w-16"
    >
      <div class="bg-blue-200 text-gray-600 text-sm rounded py-1 px-3">
        copied
        <svg
          class="absolute text-blue-200 h-2 left-0 ml-3 top-full"
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