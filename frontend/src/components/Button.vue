<script lang="ts">
import { defineComponent, ref } from "vue";
import { useLoader } from "./Loader.vue";

// default
const fn = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("error message"));
    }, 2000);
  });
};

export default defineComponent({
  props: {
    handlerFn: {
      type: Function,
      default: fn,
    },
    globalLoader: {
      type: Boolean,
      default: false,
    },
    loadingMsg: {
      type: String,
    },
  },
  setup(props) {
    const { isLoading: isGlobalLoading, message } = useLoader();
    const isLoading = ref(false);
    const errMsg = ref("");

    const handler = async () => {
      errMsg.value = "";

      // feature: useLoader
      if (props.loadingMsg && props.globalLoader) {
        message.value = props.loadingMsg;
      }

      props.globalLoader
        ? (isGlobalLoading.value = true)
        : (isLoading.value = true);
      try {
        await props.handlerFn();
      } catch (e) {
        errMsg.value = e.message;
      } finally {
        props.globalLoader
          ? (isGlobalLoading.value = false)
          : (isLoading.value = false);
      }
    };
    return {
      isLoading,
      errMsg,
      handler,
    };
  },
});
</script>


<template>
  <button
    @click="handler"
    type="button"
    :disabled="isLoading ? true : false"
    class="inline-flex w-full justify-center items-center px-6 py-3 
    rounded text-gray-600 text-xl bg-blue-100 hover:bg-blue-200 focus:outline-none 
    transition ease-in-out duration-150 disabled:cursor-default disabled:opacity-70 disabled:bg-blue-200"
  >
    <svg
      v-if="isLoading"
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot />
  </button>
  <p class="text-red-600 text-center">{{ errMsg }}</p>
</template>