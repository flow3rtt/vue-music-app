import _ from "lodash";
import Vue from "vue";
import fetch from "@/fetch";

const SET_MUSICU = "SET_MUSICU";
const SET_SINGERS = "SET_SINGERS";
const SET_RANK = "SET_RANK";
const SET_FLGD = "SET_FLGD";
const SET_SINGER_MAP = "SET_SINGER_MAP";
const SET_RANK_MAP = "SET_RANK_MAP";
const SET_FlGD_MAP = "SET_FlGD_MAP";

const data = {
  state: {
    musicu: {},
    singers: [],
    rank: [],
    flgd: [],
    singerMap: {},
    rankMap: {},
    flgdMap:{}
  },
  getters: {
    musicu(state) {
      return state.musicu;
    },
    singers(state) {
      return state.singers;
    },
    rank(state) {
      return state.rank;
    },
    flgd(state) {
      return state.flgd;
    },
    singerMap(state) {
      return state.singerMap;
    },
    rankMap(state) {
      return state.rankMap;
    },
    flgdMap(state){
      return state.flgdMap;
    }
  },
  mutations: {
    [SET_MUSICU]({ musicu }, payload) {
      _.forEach(payload, ({ key, value }) => {
        Vue.set(musicu, key, value);
      });
    },
    [SET_SINGERS](state, payload) {
      state.singers = payload;
    },
    [SET_RANK](state, payload) {
      state.rank = payload;
    },
    [SET_FLGD](state, payload) {
      state.flgd = payload;
    },
    [SET_SINGER_MAP]({ singerMap }, { type, mid, data }) {
      Vue.set(singerMap, mid, _.assign({},singerMap[mid],{
        [type]: data
      }));
    },
    [SET_RANK_MAP]({ rankMap }, { id, data }) {
      Vue.set(rankMap, id, data);
    },
    [SET_FlGD_MAP]({ flgdMap }, { id, data }) {
      Vue.set(flgdMap, id, data);
    }
  },
  actions: {
    getMusicuAsync({ commit }) {
      return new Promise(async resolve => {
        const response = await fetch.get("/musicu");
        if (response.code === 0) {
          const payload = [];
          const swipe = response.focus.data.content;
          const wntjgd = response.recomPlaylist.data.v_hot;
          const xgsf = response.new_song.data.song_list;
          payload.push({
            key: "swipe",
            value: swipe
          });
          payload.push({
            key: "wntjgd",
            value: wntjgd
          });
          payload.push({
            key: "xgsf",
            value: xgsf
          });
          commit(SET_MUSICU, payload);
          resolve();
        }
      });
    },
    getSingersAsync({ commit }) {
      return new Promise(async resolve => {
        const response = await fetch.get("/singers");
        if (response.code === 0) {
          const payload = [];
          const t = {};
          const list = response.data.list;
          _.forEach(list, item => {
            if (!t[item.Findex]) {
              t[item.Findex] = {
                title: item.Findex,
                items: []
              };
            } else {
              t[item.Findex].items.push(item);
            }
          });
          _.forEach(t, item => {
            if (!_.isEmpty(item.items)) {
              payload.push(item);
            }
          });
          payload.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
          payload.unshift({
            title: "热",
            items: _.slice(list, 0, 10)
          });

          commit(SET_SINGERS, payload);
          resolve();
        }
      });
    },
    getRankAsync({ commit }) {
      return new Promise(async resolve => {
        const response = await fetch.get("/rank");
        const payload = response;
        commit(SET_RANK, payload);
        resolve();
      });
    },
    getFlgdAsync({ commit }) {
      return new Promise(async resolve => {
        const response = await fetch.get("/flgd");
        if (response.code === 0) {
          const payload = response.data.list;
          commit(SET_FLGD, payload);
          resolve();
        }
      });
    },
    getSingerMapAsync({ commit }, { mid, type }) {
      return new Promise(async resolve => {
        const response = await fetch.get(`singer${type}`, {
          params: {
            mid
          }
        });
        if (response.code === 0) {
          const data = response.data;
          commit(SET_SINGER_MAP, {
            type,
            mid,
            data
          });
          resolve();
        }
      });
    },
    getRankMapAsync({ commit }, { id, type, date, ...rest }) {
      return new Promise(async resolve => {
        let index = date.indexOf("_");
        if (type === "top" && index !== -1) {
          date = date.substring(0, index + 1) + "0" + date[index + 1];
        }
        const response = await fetch.get(`ranki`, {
          params: {
            id,
            type,
            date
          }
        });
        if (response.code === 0) {
          const data = _.assign({}, rest, response);
          commit(SET_RANK_MAP, {
            id,
            data
          });
          resolve();
        }
      });
    },
    getFlgdMapAsync({ commit }, { id }) {
      return new Promise(async resolve => {
        const response = await fetch.get(`flgdi`, {
          params: {
            id,
          }
        });
        if (response.code === 0) {
          const data = response.cdlist[0];
          commit(SET_FlGD_MAP, {
            id,
            data
          });
          resolve();
        }
      });
    }
  }
};

export default data;
