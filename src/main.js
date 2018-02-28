import Vue from 'vue';
import VueSwiper from 'vue-awesome-swiper';
import VueLazyload from 'vue-lazyload';
import router from './router';
import store from './store';
import Layout from './layout';
import 'swiper/dist/css/swiper.min.css';

Vue.use(VueSwiper);
Vue.use(VueLazyload);

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(Layout),
});
