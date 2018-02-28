<template>
  <div class="rank">
    <div class="title">
      <div @click="back">
        <icon type="icon-jiantou" />
      </div>
      <div>
        <transition  name="title-fade">
          <span v-show="!!title">{{title}}</span>
        </transition>
      </div>
      <div>
        <icon type="icon-gengduo2" />
      </div>
    </div>
    <div ref="bgImage" class="bg-image" :style="bgStyle">
      <div class="filter"></div>
      <div v-if="!!info.name" ref="info" class="info">
        <div>
          <span>{{info.name}}</span>
        </div>
        <div>
          <span>{{`${info.time}更新`}}</span>
        </div>
      </div>
    </div>
    <div ref="back" class="background"></div>
    <div class="content">
      <scroll click :probe-type="3" @scroll="scroll" listenScroll>
        <songs index :songs="songs" />
      </scroll>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import icon from "./icon";
import scroll from "./scroll";
import songs from "./songs";
import _ from "lodash";
export default {
  components: {
    icon,
    scroll,
    songs
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      title: ""
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    bgStyle() {
      return _.isEmpty(this.songs)
        ? {}
        : {
            backgroundImage: `url(${this.info.url})`
          };
    },
    info() {
      if (_.isEmpty(this.songs)) {
        return {
          name: "",
          time: "",
          url: ""
        };
      } else {
        return {
          name: this.rankMap[this.id].ListName,
          time: this.rankMap[this.id].update_time,
          url: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
            _.first(this.songs).albummid
          }.jpg?max_age=2592000`
        };
      }
    },
    songs() {
      if (!this.rankMap[this.id]) {
        return [];
      }
      return _.map(this.rankMap[this.id].songlist, ({ data }) => data) || [];
    },
    ...mapGetters(["rankMap"])
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    init() {
      // if(!this.rankMap[this.id]){
      //   this.$router.replace('/musicHall/rank')
      // }
    },
    scroll(pos) {
      let backDom = this.$refs.back;
      let bgImageDom = this.$refs.bgImage;
      let infoDom = this.$refs.info;
      let minY = -0.7 * window.innerWidth + 12 * 3;
      let y = Math.max(minY, pos.y);
      if (pos.y < -66) {
        this.title = this.info.name;
      } else {
        this.title = "";
      }
      if (pos.y <= minY) {
        bgImageDom.style.height = "3rem";
        bgImageDom.style.paddingTop = "0";
        bgImageDom.style.zIndex = 3;
        infoDom.style.display = "none";
      } else {
        bgImageDom.style.height = "0";
        bgImageDom.style.paddingTop = "70%";
        bgImageDom.style.zIndex = "";
        infoDom.style.display = "";
        bgImageDom.style.filter = ``;
      }
      backDom.style.transform = `translate3d(0,${0.7 * window.innerWidth +
        y}px,0)`;
    },
    ...mapActions(["getRankMapAsync"])
  },
  watch: {}
};
</script>

<style lang="less" scoped>
@import "../assets/style/var.less";
.rank {
  background-color: @background-color;
  position: relative;
  overflow: hidden;

  .title {
    z-index: 4;
    height: 3rem;
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    padding: 0 1rem;
    justify-content: space-between;
    align-items: center;
    color: @font-color;
    .title-fade-enter-active {
      transition: opacity 0.5s;
    }
    .title-fade-enter {
      opacity: 0;
    }
    span {
      font-size: 1.4rem;
      font-weight: 520;
    }
    i {
      font-size: 1.8rem;
    }
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
    .info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      > div:first-child {
        > span {
          font-size: 1.4rem;
          font-weight: 520;
          color: white;
        }
      }
      > div:last-child {
        padding: 0.8rem 0;
        > span {
          font-size: 1rem;
          color: white;
        }
      }
    }
  }
  .background {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: @background-color;
    transform: translate3d(0, 70vw, 0);
  }
  .content {
    position: fixed;
    top: calc(~"70vw");
    width: 100%;
    bottom: 5rem;
    z-index: 2;
    #rank-scroll-wrapper {
      height: calc(~"100% - 44px");
    }
  }
}
</style>
