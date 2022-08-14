import {
  defineStore,
  acceptHMRUpdate,
} from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as any | null,
    signedInStatus: false,
  }),

  actions: {
    setUser(payload: any | null) {
      this.user = payload;
    },
    setSignedInStatus(payload: boolean) {
      this.signedInStatus = payload;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
