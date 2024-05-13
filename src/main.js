import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import store from './store'; // Import the store

createApp(App)
  .use(router) // Use the router
  .use(store) // Use the store
  .mount('#app');