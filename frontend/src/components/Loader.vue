<script lang="ts">
import { defineComponent, ref } from "vue";

const isLoading = ref(false);

export function useLoader() {
  return {
    isLoading,
  };
}

export default defineComponent({
  setup() {
    const { isLoading } = useLoader();
    return { isLoading };
  },
});
</script>
<template>
  <teleport to="body">
    <div
      v-if="isLoading"
      class="fixed fixed left-0 bottom-0 w-full h-full bg-gray-500 bg-opacity-80 flex items-center justify-center w-full h-full"
    >
      <div class="flex justify-center items-center space-x-1 text-sm text-gray-300">

        <svg
          fill='none'
          class="w-12 h-12 animate-spin"
          viewBox="0 0 32 32"
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            clip-rule='evenodd'
            d='M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z'
            fill='currentColor'
            fill-rule='evenodd'
          />
        </svg>

        <div class="text-gray-300 text-xl">Loading ...</div>
      </div>
    </div>
  </teleport>
</template>