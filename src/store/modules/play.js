import _ from "lodash";
import fetch from "@/fetch";
import Vue from "vue";
const SET_ING = "SET_ING";
const SET_MODE = "SET_MODE";
const SELECT_SONG = "SELECT_SONG";
const TOGGLE_SCREEN = "TOGGLE_SCREEN";

const play = {
  state: {
    fullScreen: false,
    list: [],
    index: -1,
    mode: 0,
    ing: false
  },
  mutations: {
    [SET_ING](state, bool) {
      state.ing = bool;
    },
    [SET_MODE](state, mode) {
      state.mode = mode;
    },
    [TOGGLE_SCREEN](state) {
      state.fullScreen = !state.fullScreen;
    },
    [SELECT_SONG](state, { list, index }) {
      Vue.set(state, "list", list);
      Vue.set(state, "index", index);
    }
  },
  getters: {
    play(state) {
      return state;
    },
    playSong(state) {
      if (state.index < -1 || state.list.length === 0) {
        return null;
      } else {
        return state.list[state.index];
      }
    }
  },
  actions: {
    getSonginfoAsync({ commit }, mid) {
      return new Promise(async resolve => {
        const response = await fetch.get("/songinfo", {
          params: {
            mid
          }
        });
        const payload = response;
        resolve(payload);
      });
    },
    async selectSong({ state, commit, dispatch, getters }, { list, index }) {
      if (index < -1 || list.length === 0) {
        return;
      }
      let ing = state.ing;
      let playSong = list[index];
      if (getters.playSong !== null) {
        if (playSong.songmid === getters.playSong.songmid) {
          return;
        }
      }
      if (!playSong.songmid) {
        return;
      }
      if (!playSong.lyric) {
        let response = await dispatch("getSonginfoAsync", playSong.songmid);
        playSong.url = response.url;
        playSong.lyric = response.lyric;
      }
      if (list.length === 1 && index === 0) {
        let t, ti;
        let fi = _.findIndex(state.list,item=> item.songmid === playSong.songmid);
        if (fi !== -1) {
          t = state.list;
          ti = fi;
        } else {
          state.list.push(playSong);
          t = state.list;
          ti = state.list.length - 1;
        }
        commit(SELECT_SONG, {
          list: t,
          index: ti
        });
      } else {
        commit(SELECT_SONG, {
          list: list,
          index
        });
      }
      setTimeout(() => {
        commit(SET_ING, true);
        if (!ing) {
          commit(TOGGLE_SCREEN);
        }
      }, 20);
    }
  }
};

export default play;
