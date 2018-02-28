<template>
  <div class="singer">
    <div class="title">
      <div @click="back">
        <icon type="icon-jiantou" />
      </div>
      <div>
        <transition name="title-fade">
          <span v-show="!!title">{{title}}</span>
        </transition>
      </div>
      <div>
        <icon type="icon-gengduo2" />
      </div>
    </div>
    <div ref="bgImage" class="bg-image" :style="bgStyle">
      <div class="filter"></div>
      <div ref="info" class="info">
        <div>
          <span>{{singer.name}}</span>
        </div>
        <div>
          <div>
            <span>关注</span>
          </div>
          <div>
            <span>勋章</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="back" class="background"></div>
    <div class="content">
      <tab v-model="tabIndex" ref="tabs">
        <tab-item>歌曲</tab-item>
        <tab-item>专辑</tab-item>
        <tab-item>MV</tab-item>
      </tab>
      <div id="singer-scroll-wrapper">
        <scroll ref="scrollCmp" click :probe-type="3" @scroll="scroll" listenScroll>
          <swiper v-model="tabIndex" :show-dots="false">
            <swiper-item >
              <div v-if="tabIndex===0">
                <songs :songs="songs" />
              </div>
            </swiper-item>
            <swiper-item >
              <div v-if="tabIndex===1">
                <div class="albums">
                    <div v-for="(item,idx) of albums" :key="idx">
                        <div>
                          <img :alt="item.albumName" v-lazy="`https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.albumMID}.jpg?max_age=2592000`"/>
                        </div>
                        <div>
                          <span>{{item.albumName}}</span>
                          <span>{{item.pubTime}}</span>
                        </div>
                    </div>
                </div>
              </div>
            </swiper-item>
            <swiper-item>
              <div v-if="tabIndex===2">
                <div class="mvs">
                    <div v-for="(item,idx) of mvs" :key="idx">
                        <div>
                          <img :alt="item.title" v-lazy="`https://shp.qpic.cn/qqvideo_ori/0/${item.vid}_360_204/0`"/>
                        </div>
                        <div>
                          <span>{{item.title}}</span>
                          <span>{{item.date}}</span>
                        </div>
                    </div>
                </div>
              </div>
            </swiper-item>
          </swiper>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import icon from './icon';
import scroll from './scroll';
import songs from './songs';
import { Tab, TabItem, Swiper, SwiperItem } from 'vux';
import _ from 'lodash';
export default {
  components: {
    icon,
    scroll,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    songs,
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      title: '',
      tabIndex: 0,
      singer: {},
    };
  },
  computed: {
    mid() {
      return this.$route.params.mid;
    },
    type() {
      if (this.tabIndex === 0) {
        return 'song';
      } else if (this.tabIndex === 1) {
        return 'album';
      } else if (this.tabIndex === 2) {
        return 'mv';
      }
    },
    bgStyle() {
      return _.isEmpty(this.singer)
        ? {}
        : {
            backgroundImage: `url(https://y.gtimg.cn/music/photo_new/T001R300x300M000${
              this.singer.mid
            }.jpg?max_age=2592000)`,
          };
    },
    typeData() {
      if (!this.singerMap[this.mid]) {
        return {};
      }
      return this.singerMap[this.mid][this.type] || {};
    },
    songs() {
      if (this.tabIndex !== 0) {
        return [];
      }
      let songs = _.map(this.typeData.list, ({ musicData }) => {
        return musicData;
      });
      return songs;
    },
    albums() {
      if (this.tabIndex !== 1) {
        return [];
      }
      return this.typeData.list || [];
    },
    mvs() {
      if (this.tabIndex !== 2) {
        return [];
      }
      return this.typeData.list || [];
    },
    ...mapGetters(['singerMap']),
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    init() {
      if (!this.singerMap[this.mid] || !this.singerMap[this.mid][this.type]) {
        this.getSingerMapAsync({
          mid: this.mid,
          type: this.type,
        }).then(() => {
          setTimeout(() => {
            this.setHeight();
          }, 100);
        });
      } else {
        if (_.isEmpty(this.singer)) {
          this.singer = {
            mid: this.typeData.singer_mid,
            name: this.typeData.singer_name,
          };
        }
        setTimeout(() => {
          this.setHeight();
        }, 20);
      }
    },
    setHeight() {
      let t = document.querySelector('#singer-scroll-wrapper .vux-swiper');
      let dom = t.children[this.tabIndex].children[0];
      if (!dom) {
        return;
      }
      let h = dom.clientHeight;
      t.style.height = h + 'px';
    },
    scroll(pos) {
      let tabsDom = this.$refs.tabs.$el;
      let backDom = this.$refs.back;
      let bgImageDom = this.$refs.bgImage;
      let infoDom = this.$refs.info;
      let minY = -0.7 * window.innerWidth + 12 * 3;
      let y = Math.max(minY, pos.y);
      if (pos.y < -66) {
        this.title = this.singer.name;
      } else {
        this.title = '';
      }
      if (pos.y <= minY) {
        bgImageDom.style.height = '3rem';
        bgImageDom.style.paddingTop = '0';
        bgImageDom.style.zIndex = 3;
        infoDom.style.display = 'none';
      } else {
        bgImageDom.style.height = '0';
        bgImageDom.style.paddingTop = '70%';
        bgImageDom.style.zIndex = '';
        infoDom.style.display = '';
        bgImageDom.style.filter = ``;
      }
      tabsDom.style.transform = `translate3d(0,${y}px,0)`;
      backDom.style.transform = `translate3d(0,${0.7 * window.innerWidth +
        y}px,0)`;
    },
    ...mapActions(['getSingerMapAsync']),
  },
  watch: {
    type() {
      this.init();
    },
    typeData(newVal) {
      if (!_.isEmpty(newVal) && _.isEmpty(this.singer)) {
        this.singer = {
          mid: newVal.singer_mid,
          name: newVal.singer_name,
        };
      }
    },
    tabIndex() {
      this.$refs.scrollCmp.scrollTo(0, 0, 200);
    },
  },
};
</script>

<style lang="less" scoped>
@import '../assets/style/var.less';
.singer {
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
          font-size: 1.8rem;
          font-weight: 520;
          color: white;
        }
      }
      > div:last-child {
        display: flex;
        padding: 1.2rem 1rem;
        span {
          margin: 0 1rem;
          padding: 0.2rem 1.6rem;
          border: 1px solid white;
          border-radius: 1rem;
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
    top: calc(~'70vw');
    width: 100%;
    bottom: 5rem;
    z-index: 2;
    #singer-scroll-wrapper {
      height: calc(~'100% - 44px');
      .albums {
        > div {
          display: flex;
          padding: 0.8rem;
          > div:first-child {
            padding-right: 0.8rem;
            > img {
              height: 60px;
              width: 60px;
            }
          }
          > div:last-child {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            > span:first-child {
              padding-bottom: 0.8rem;
              font-size: 1.2rem;
              font-weight: 520px;
            }
            > span:last-child {
              color: #c0c0c0;
            }
          }
        }
      }
      .mvs {
        > div {
          display: flex;
          padding: 0.8rem;
          > div:first-child {
            padding-right: 0.8rem;
            > img {
              height: 50px;
              width: 100px;
            }
          }
          > div:last-child {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            > span:first-child {
              padding-bottom: 0.8rem;
              font-size: 1.2rem;
              font-weight: 520px;
            }
            > span:last-child {
              color: #c0c0c0;
            }
          }
        }
      }
    }
  }
}
</style>
