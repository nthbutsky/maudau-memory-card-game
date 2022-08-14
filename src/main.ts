import {
  createApp,
  markRaw,
} from 'vue';
import {
  createPinia,
} from 'pinia';
import './style.css';
import firebase from 'firebase/compat/app';
import App from './App.vue';
import {
  router,
} from './router';
import {
  firebaseConfig,
} from '@/api/firebase';
import 'firebaseui/dist/firebaseui.css';

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
