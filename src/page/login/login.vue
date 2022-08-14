<template>
  <div>
    <div id="firebaseui-auth-container" />
    <div id="loader">
      Loading...
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted,
} from 'vue';
import useFirebase from '@/api/firebase';

const {
  ui,
  uiConfig,
} = useFirebase();

onMounted(() => {
  ui.start('#firebaseui-auth-container', uiConfig);
});
</script>
