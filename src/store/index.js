import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import data from "./modules/data";
import loading from "./modules/loading";
import play from "./modules/play";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    data,
    loading,
    play
  },
  plugins: [
    createPersistedState({
      paths: ["data"],
      storage: window.sessionStorage,
      key: "vue-qq-music"
    })
  ]
});
export default store;
