<template>
<div class="container mx-auto">
  <form>
    <div class="mb-6">
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">目标机器IP</label>
      <input
	v-model="targetIp"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required />
    </div>
    <div class="mb-6">
      <label
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">目标机器端口</label>
      <input
	v-model="targetPort"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
        />
    </div>
    <button
      type="button"
      @click="onSubmit"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
      保存机器配置
    </button>
  </form>
</div>
</template>

<!-- use this to make emacs highlight setup code block -->
<!-- known vue-mode issue... https://github.com/AdamNiederer/vue-mode/issues/117 -->
<script setup="setup" lang="ts">
import { ref } from "vue";
import { useTargetStore} from "@/stores/target";
import { updateApiEndpoint } from "@/api/glx";


let targetIp = ref("")
let targetPort = ref(0)

// default value.
targetIp.value = "127.0.0.1"
targetPort.value = 8080

const targetStore = useTargetStore();

const onSubmit = () => {
  targetStore.setTargetIp(targetIp);
  targetStore.setTargetPort(targetPort);

  // update the Api endpoint.
  updateApiEndpoint()
}
</script>

<script lang="ts">
export default {
  name: "TargetConfig",
  props: {},
  data() {
    return {};
  },
};
</script>
