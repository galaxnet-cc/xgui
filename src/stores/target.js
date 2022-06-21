import { defineStore } from "pinia";

export const useTargetStore = defineStore({
  id: "target",
  state: () => ({
    targetIp: "127.0.0.1",
    targetPort: 8080,
  }),
  getters: {
    targetIp: (state) => state.targetIp,
    targetPort: (state) => state.targetPort,
  },
  actions: {
    setTargetIp(ip) {
      this.targetIp = ip;
    },
    setTargetPort(port) {
      this.targetPort = port;
    },
  },
});
