<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const param1 = ref("");

    const deploy = () => {
      console.log("click deploy", param1.value);
      param1.value = "";
    };
    return {
      deploy,
      param1,
    };
  },
});
</script>


<template>
  <div class="text-center">
    <p>deploy your own contract</p>
  </div>

  <div class="grid place-items-center">
    <div class="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">

      <div class="flex justify-between gap-3">
        <span class="w-full">
          <label
            for="Greeting"
            class="block text-xs font-semibold text-gray-600 uppercase"
          >Greeting</label>
          <input
            v-model="param1"
            id="Greeting"
            type="text"
            name="Greeting"
            placeholder="Hello World"
            class="block w-full p-3 mt-2 text-gray-700 bg-gray-100 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            required
          />
        </span>
        <!-- <span class="w-1/2">
          <label
            for="param_2"
            class="block text-xs font-semibold text-gray-600 uppercase"
          >param_2</label>
          <input
            id="param_2"
            type="text"
            name="param_2"
            placeholder="Doe"
            class="block w-full p-3 mt-2 text-gray-700 bg-gray-100 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            required
          />
        </span> -->
      </div>
      <!-- <label
          for="email"
          class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
        >E-mail</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="john.doe@company.com"
          autocomplete="email"
          class="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          required
        />
        <label
          for="password"
          class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
        >Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="********"
          autocomplete="new-password"
          class="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          required
        />
        <label
          for="password-confirm"
          class="block mt-2 text-xs font-semibold text-gray-600 uppercase"
        >Confirm password</label>
        <input
          id="password-confirm"
          type="password"
          name="password-confirm"
          placeholder="********"
          autocomplete="new-password"
          class="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          required
        /> -->
      <button
        @click="deploy"
        class="btn w-full my-4"
      >
        Deploy
      </button>

    </div>
  </div>
</template>