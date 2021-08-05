import { ref } from "vue";

// @todo: use state object to wrap all of these property
// @todo: notify list
const isNotifying = ref(false);
const msg = ref("");

export default function useNotify() {
  const notify = (message: string, duration: number = 3000) => {
    if (isNotifying.value) return;
    msg.value = message;
    isNotifying.value = true;

    setTimeout(() => {
      isNotifying.value = false;
    }, duration);
  };

  return {
    isNotifying,
    msg,
    notify,
  };
}
