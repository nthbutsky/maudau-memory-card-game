<template>
  <div>
    <h1>
      GAME
    </h1>
    <h2 v-if="user">
      Signed In User: {{ user.displayName }}
    </h2>
    <br>
    <div v-if="signedInStatus">
      <button @click="onLogout">
        Sign Out
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  storeToRefs,
} from 'pinia';
import useFirebase from '@/api/firebase';
import {
  useUserStore,
} from '@/store/user';
import {
  router, ERouteName,
} from '@/router';

const {
  user,
  signedInStatus,
} = storeToRefs(useUserStore());

const {
  uiSignOut,
} = useFirebase();

function onLogout() {
  uiSignOut();
  router.push({
    name: ERouteName.LOGIN,
  });
}
</script>
