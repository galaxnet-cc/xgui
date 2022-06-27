import { defineStore } from "pinia";
import { useLocalStorage } from '@vueuse/core'

export const useTargetStore = defineStore({
  id: "targetConfig",
  state: () => ({
    targetIp: window.localStorage.getItem('targetIp') || '127.0.0.1',
    targetPort: window.localStorage.getItem('targetPort') || '8080',
  }),
  actions: {
    updateTarget(ip, port) {
      this.targetIp = ip
      this.targetPort = port

      window.localStorage.setItem('targetIp', ip)
      window.localStorage.setItem('targetPort', port)
    }
  }
});
