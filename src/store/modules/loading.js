import _ from "lodash";
import Vue from "vue";
const SET_LOADING = "SET_LOADING";
const loading = {
  state: {
    loading: false
  },
  mutations: {
    [SET_LOADING](state, bool) {
      state.loading = bool;
    }
  },
  getters: {
    loading(state) {
      return state.loading;
    }
  }
};

export default loading;
