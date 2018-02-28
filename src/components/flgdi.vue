<template>
  <div class="flgd">
    <div class="title">
      <div @click="back">
        <icon type="icon-jiantou" />
      </div>
      <div>
        <span>{{title}}</span>
      </div>
      <div>
        <icon type="icon-gengduo2" />
      </div>
    </div>
    <div ref="bgImage" class="bg-image" :style="bgStyle"></div>
    <div ref="back" class="background"></div>
    <div>
      <scroll @scroll="scroll" listenScroll click :probe-type="3" >
        <div v-if="songs.length!==0" class="info">
          <div>
            <div>
              <img :src="t.logo" :alt="t.dissname" />
            </div>
            <div>
              <div>
                <span v-html="t.dissname"></span>
              </div>
              <div>
                <img :alt="t.nickname" :src="t.headurl" />
                <span>{{t.nickname}}</span>
              </div>
              <div>
                <span>简介:{{t.desc}}</span>
              </div>
            </div>
          </div>
          <div>
             <div><icon type="icon-love"/></div>
             <div><icon type="icon-pinglun"/></div>
             <div><icon type="icon-fenxiang"/><span>分享</span></div>
          </div>
        </div>
        <div>
          <songs :songs="songs" border/>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import icon from './icon';
import scroll from './scroll';
import songs from './songs';
import _ from 'lodash';
export default {
  components: {
    icon,
    scroll,
    songs,
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      title: '歌单',
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
            backgroundImage: `url(${this.t.logo})`,
          };
    },
    songs() {
      if (!this.t) {
        return [];
      }
      return this.t.songlist || [];
    },
    t() {
      return this.flgdMap[this.id];
    },
    ...mapGetters(['flgdMap']),
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    init() {
      if (!this.flgdMap[this.id]) {
        this.getFlgdMapAsync({
          id: this.id,
        });
      }
    },
    scroll(pos) {
      let backDom = this.$refs.back;
      let minY = -0.6 * window.innerWidth + 12 * 3;
      if (pos.y - minY < 12 * 3) {
        this.title = this.t.dissname;
      } else {
        this.title = '歌单';
      }
      let y = Math.max(minY, pos.y);
      backDom.style.transform = `translate3d(0,${0.6 * window.innerWidth +
        y}px,0)`;
    },
    ...mapActions(['getFlgdMapAsync']),
  },
  watch: {},
};
</script>

<style lang="less" scoped>
@import '../assets/style/var.less';
.flgd {
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
    > div:nth-child(2) {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: 180px;
      > span {
        font-size: 1.4rem;
        font-weight: 520;
      }
    }
    i {
      font-size: 1.8rem;
    }
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 60%;
    transform-origin: top;
    background-size: cover;
    filter: blur(25px);
  }
  .background {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: @background-color;
    transform: translate3d(0, 60vw, 0);
  }
  > div:last-child {
    position: absolute;
    top: 3rem;
    width: 100%;
    bottom: 0;
    overflow: hidden;
    .info {
      height: calc(~'60vw - 3rem');
      display: flex;
      padding: 1.2rem 0;
      margin: 0 1.2rem;
      flex-direction: column;
      > div:first-child {
        display: flex;
        > div:first-child {
          margin-right: 1rem;
          min-height: 120px;
          min-width: 120px;
          max-height: 120px;
          max-width: 120px;
          > img {
            height: 100%;
            width: 100%;
          }
        }
        > div:last-child {
          display: flex;
          flex-direction: column;
          margin: 0.8rem 0;

          > div:first-child {
            > span {
              color: white;
              font-weight: 520;
              font-size: 1.3rem;
            }
          }
          > div:nth-child(2) {
            display: flex;
            align-items: center;
            margin: 0.8rem 0;
            > img {
              width: 30px;
              height: 30px;
              border-radius: 60%;
            }
            > span {
              padding-left: 0.5rem;
              font-size: 1rem;
              color: white;
            }
          }
          > div:last-child {
            margin-top: 0.8rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            max-width: 160px; // display: flex;
            // justify-content: space-between;
            > span {
              // color: #c0c0c0;
            }
          }
        }
      }
      > div:last-child {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        > div {
          display: flex;
          align-items: center;
          i {
            font-size: 2rem;
            color: white;
          }
          > span {
            margin-left: 0.2rem;
            color: white;
            transform: translateY(0.2rem);
          }
        }
      }
    }
  }
}
</style>
