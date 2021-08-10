<script lang="ts">
import { defineComponent, onUnmounted, watch, ref } from "vue";

export const useModal = () => {
  const modalOpen = ref(false);
  const open = () => {
    modalOpen.value = true;
  };
  const close = () => {
    modalOpen.value = false;
  };
  return { modalOpen, open, close };
};

export default defineComponent({
  emits: ["modalClose"],
  props: {
    modalOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const closeModal = () => {
      emit("modalClose");
    };

    watch(
      () => props.modalOpen,
      (value) => {
        if (value) {
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("overflow-hidden");
        }
      }
    );

    onUnmounted(() => {
      document.body.classList.remove("overflow-hidden");
    });

    return {
      closeModal,
    };
  },
});
</script>

<template>
  <teleport to="body">
    <div v-if="modalOpen">
      <div class="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-500 bg-opacity-70">
        <div class="bg-white rounded-lg w-1/2">
          <div class="flex flex-col items-start p-4">
            <div class="flex items-center w-full">
              <svg
                @click="closeModal"
                class="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer hover:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
              </svg>
            </div>
            <slot />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>