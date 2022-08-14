import {
  createApp,
  markRaw,
} from 'vue';
import {
  createPinia,
} from 'pinia';
import firebase from 'firebase/compat/app';
import App from './App.vue';
import {
  router,
} from './router';
import {
  firebaseConfig,
} from '@/api/firebase';
import 'firebaseui/dist/firebaseui.css';
import '@fontsource/nunito-sans'; // Defaults to weight 400.

const pinia = createPinia();
pinia.use(({
  store,
}) => {
  // to make router available inside pinia
  // eslint-disable-next-line no-param-reassign
  store.router = markRaw(router);
});

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app');

firebase.initializeApp(firebaseConfig);
