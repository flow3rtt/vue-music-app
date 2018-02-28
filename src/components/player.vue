<template>
  <div class="player">
    <div v-show="!play.fullScreen" class="mini-player">
      <div v-if="playSong===null">
        <span>QQ音乐 听我想听的歌</span>
      </div>
      <div v-else>
        <div @click="taggleScreen">
          <div>
            <img :class="{active:ing}" :src="imgUrl" :alt="playSong.songname" />
          </div>
          <div>
            <span>{{playSong.songname}}</span>
            <p v-html="lyricTxt"></p>
          </div>
        </div>
      </div>
      <div>
        <icon @click="toggleIng" :type="!ing?'icon-icon-12':'icon-icon-5'" />
        <icon type="icon-icon-11" />
      </div>
    </div>
    <div v-if="playSong!==null" v-show="play.fullScreen" class="normal-player">
      <div class="background">
        <img :src="imgUrl" />
      </div>
      <div class="title">
        <div @click="taggleScreen">
          <icon type="icon-jiantouyou" />
        </div>
        <div>
          <span>{{playSong.songname}}</span>
        </div>
        <div>
          <icon type="icon-gengduo2" />
        </div>
      </div>
      <div class="singer-info">
        <span>{{`-- ${formatSinger(playSong.singer)} --`}}</span>
      </div>
      <div ref="middle" class="middle">
        <div class="left">
          <div class="rotate-img">
            <img :class="{active:ing}" :src="imgUrl" :alt="playSong.songname">
          </div>
          <div class="line-lyric">
            <p v-html="lyricTxt"></p>
          </div>
        </div>
        <div class="right">
          <scroll ref="lyricScroll">
            <ul class="lyric-ul">
              <li v-for="(txt,idx) of lyricLines" :key="idx">
                <p v-html="txt" :class="{active:idx===lyricLine}"></p>
                <p v-if="trans" :class="{active:idx===lyricLine}">{{tranLyric.lines[idx].txt==='//'?'':tranLyric.lines[idx].txt}}</p>
              </li>
            </ul>
          </scroll>
          <div class="trans-wrapper" v-if="!!playSong.lyric.tran">
            <icon @click="toggleTrans" :class="{active:trans}" type="icon-weibiaoti556" />
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="dots">
          <div :class="{active:index===0}"></div>
          <div :class="{active:index===1}"></div>
        </div>
        <div class="process">
          <div>
            <span>{{formatTime(time)}}</span>
          </div>
          <div @click="processClick" ref="process">
            <div :style="{
              width:`${bfb*100}%`
            }"></div>
            <div @touchstart="progressTouchstart" @touchmove="progressTouchmove" @touchend="progressTouchend" :style="{
              left:`calc(${bfb*100}% - 0.5rem)`
            }"></div>
          </div>
          <div>
            <span>{{formatTime(playSong.interval)}}</span>
          </div>
        </div>
        <div class="control">
          <div>
            <icon @click="changeMode" :type="modeIcon" />
            <icon @click="prev" type="icon-icon-4" />
            <icon @click="toggleIng" :type="!ing?'icon-icon-12':'icon-icon-5'" />
            <icon @click="next" type="icon-icon-2" />
            <icon type="icon-icon-11" />
          </div>
          <div>
            <icon type="icon-love" />
            <icon type="icon-xiazai" />
            <icon type="icon-fenxiang" />
            <icon type="icon-pinglun" />
          </div>
        </div>
      </div>
    </div>
    <audio id="music-audio" @timeupdate="timeUpdate" @ended="ended" ref="audio" :src="songUrl?songUrl:silent" />
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import icon from "./icon.vue";
import { base64 } from "vux";
import scroll from "./scroll";
import Lyric from "lyric-parser";
import { formatSinger } from "../utils";
import AlloyFinger from "alloyfinger";

export default {
  components: {
    icon,
    scroll
  },
  mounted() {
    this.touch = {};
    document.body.addEventListener("click", this.audioInit);
  },
  data() {
    return {
      index: 0,
      trans: false,
      lyricLine: -1,
      lyric: null,
      time: 0
    };
  },
  computed: {
    songUrl() {
      return !!this.playSong ? this.playSong.url : "";
    },
    silent() {
      return `http://t.cn/R8fED9W`;
    },
    imgUrl() {
      return !!this.playSong
        ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
            this.playSong.albummid
          }.jpg?max_age=2592000`
        : "";
    },
    ing() {
      return this.play.ing;
    },
    lyricLines() {
      if (this.lyric === null) {
        return null;
      }
      return _.map(this.lyric.lines, ({ txt }) => txt);
    },
    lyricTxt() {
      if (this.lyricLine === -1 || this.lyric === null) {
        return "";
      }
      if (
        !!this.tranLyric &&
        this.trans &&
        this.tranLyric.lines[this.lyricLine].txt.trim() !== "//"
      ) {
        return this.tranLyric.lines[this.lyricLine].txt;
      } else {
        return this.lyric.lines[this.lyricLine].txt;
      }
    },

    modeIcon() {
      if (this.play.mode === 0) {
        return "icon-icon-7";
      } else if (this.play.mode === 1) {
        return "icon-icon-6";
      } else {
        return "icon-icon-9";
      }
    },
    screen() {
      return this.play.fullScreen;
    },
    bfb() {
      if (this.playSong === null) {
        return 0;
      }
      return this.time / this.playSong.interval;
    },
    ...mapGetters(["play", "playSong", "loading"])
  },
  methods: {
    audioInit() {
      //这里使用 $refs.audio无效
      document.querySelector("#music-audio").play();
      document.body.removeEventListener("click", this.audioInit);
    },
    processClick(e) {
      let { pageX } = e;
      let left = this.$refs.process.getBoundingClientRect().left;
      let w = this.$refs.process.clientWidth;
      let bfb = (pageX - left) / w;
      let time = this.playSong.interval * bfb;
      this.$refs.audio.currentTime = time;
      this.lyric.seek(time * 1000);
      this.time = time;
    },
    progressTouchstart(e) {
      this.touch.init = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.process.children[0].clientWidth;
    },
    progressTouchmove(e) {
      if (!this.touch.init) return;
      let deltaX = e.touches[0].pageX - this.touch.startX;
      let offsetWidth = Math.min(
        this.$refs.process.clientWidth - 6,
        Math.max(0, this.touch.left + deltaX)
      );
      let bfb = offsetWidth / this.$refs.process.clientWidth;
      let time = this.playSong.interval * bfb;
      this.time = time;
    },
    progressTouchend() {
      this.touch.init = false;
      this.$refs.audio.currentTime = this.time;
      this.lyric.seek(this.time * 1000);
    },
    formatTime(time) {
      let m = (time / 60) | 0;
      let s = (time % 60) | 0;
      if (s.toString().length === 1) {
        s = "0" + s;
      }
      return `${m}:${s}`;
    },
    timeUpdate() {
      if (this.touch.init) {
        return;
      }
      this.time = this.$refs.audio.currentTime;
    },
    toggleIng() {
      if (!this.playSong) {
        return;
      }
      this.$store.commit("SET_ING", !this.ing);
    },
    haddleLyric({ lineNum }) {
      this.lyricLine = lineNum;
      this.$refs.lyricScroll.scrollToElement(
        document.querySelector(".lyric-ul").children[
          lineNum > 6 ? lineNum - 5 : lineNum
        ],
        300
      );
    },
    taggleScreen() {
      this.$store.commit("TOGGLE_SCREEN");
    },
    changeMode() {
      let mode = this.play.mode;
      ++mode;
      if (mode > 2) {
        mode = 0;
      }
      this.$store.commit("SET_MODE", mode);
    },
    formatSinger,
    prev() {
      if (this.loading) {
        return;
      }
      if (_.size(this.play.list) === 1) {
        this.loop();
        return;
      }
      let index = this.play.index - 1;
      if (index < 0) {
        index = _.size(this.play.list) - 1;
      }
      if (this.play.mode === 2) {
        let t = -1;
        do {
          t = _.random(0, _.size(this.play.list) - 1);
        } while (t === this.play.index);
        index = t;
      }
      this.selectSong({
        list: this.play.list,
        index
      });
    },
    next() {
      if (this.loading) {
        return;
      }
      if (_.size(this.play.list) === 1) {
        this.loop();
        return;
      }
      let index = this.play.index + 1;
      if (index > _.size(this.play.list) - 1) {
        index = 0;
      }
      if (this.play.mode === 2) {
        let t = -1;
        do {
          t = _.random(0, _.size(this.play.list) - 1);
        } while (t === this.play.index);
        index = t;
      }
      this.selectSong({
        list: this.play.list,
        index
      });
    },
    loop() {
      this.$refs.audio.pause();
      this.$store.commit("SET_ING", false);
      this.lyric.seek(0);
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      this.$refs.lyricScroll.scrollToElement(
        document.querySelector(".lyric-ul").children[0],
        300
      );
      this.$store.commit("SET_ING", true);
    },
    ended() {
      if (this.play.mode === 1) {
        this.loop();
        return;
      } else {
        this.next();
      }
    },
    swipe({ direction }) {
      if (direction === "Left" && this.index === 0) {
        this.index = 1;
        return;
      }
      if (direction === "Right" && this.index === 1) {
        this.index = 0;
        return;
      }
    },
    toggleTrans() {
      this.trans = !this.trans;
    },
    ...mapActions(["selectSong"])
  },
  watch: {
    songUrl(val) {
      if (!!this.lyric) {
        this.lyric.stop();
        this.lyricLine = -1;
      }
      this.lyric = new Lyric(
        base64.decode(this.playSong.lyric.main),
        this.haddleLyric
      );
      if (!!this.playSong.lyric.tran) {
        this.tranLyric = new Lyric(base64.decode(this.playSong.lyric.tran));
      } else {
        this.trans = false;
      }
      this.$nextTick(() => {
        if (this.ing) {
          this.lyric.play();
          this.$refs.audio.play();
        }
        if (!this.af) {
          this.af = new AlloyFinger(this.$refs.middle, {
            swipe: this.swipe
          });
        }
      });
    },
    ing(val) {
      if (!this.songUrl) {
        return;
      }
      this.lyric.togglePlay();
      if (val) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    },
    index(val) {
      let leftDom = this.$refs.middle.children[0];
      let rightDom = this.$refs.middle.children[1];
      if (val === 0) {
        rightDom.style.transform = "translate3d(0%,0,0)";
        leftDom.style.opacity = 1;
      } else {
        rightDom.style.transform = "translate3d(-100%,0,0)";
        leftDom.style.opacity = 0;
      }
    },
    screen(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.lyricScroll.refresh();
          this.$refs.lyricScroll.scrollToElement(
            document.querySelector(".lyric-ul").children[
              Math.max(0, this.lyricLine - 5)
            ],
            300
          );
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../assets/style/var.less";
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.player {
  height: 100%;
  width: 100%;
  .mini-player {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1rem;
    justify-content: space-between;
    > div:first-child {
      flex: 1;
      > span:first-child {
        font-weight: 550;
      }
      > div {
        display: flex;
        align-items: center;
        > div:first-child {
          > img {
            border-radius: 50%;
            height: 46px;
            width: 46px;
            animation: rotate 8s linear infinite;
            animation-play-state: paused;
            &.active {
              animation-play-state: running;
            }
          }
          padding-right: 0.6rem;
        }
        > div:last-child {
          display: flex;
          flex-direction: column;
          height: 100%;
          > * {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            max-width: 180px;
          }
          > span {
            padding-bottom: 0.4rem;
            font-size: 1.2rem;
            font-weight: 520;
          }
          > p {
            color: @theme-color;
          }
        }
      }
    }
    > div:last-child {
      display: flex;
      height: 100%;
      align-items: center;
      > i {
        color: @theme-color;
        padding: 1rem;
        font-size: 2rem;
      }
      > i:first-child {
        font-size: 2.6rem;
      }
    }
  }
  .normal-player {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: @background-color;
    display: flex;
    flex-direction: column;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background-color: black;
      > img {
        height: 100%;
        width: 100%;
        filter: blur(30px);
      }
    }
    .title {
      z-index: 4;
      height: 4rem;
      display: flex;
      padding: 0 1rem;
      justify-content: space-between;
      align-items: center;
      color: @font-color;
      > div:first-child {
        transform: rotate(90deg);
      }
      span {
        font-size: 1.6rem;
        font-weight: 520;
      }
      i {
        font-size: 1.8rem;
      }
    }
    .singer-info {
      height: 2rem;
      line-height: 2rem;
      width: 100%;
      text-align: center;
      margin-bottom: 1rem;
      > span {
        font-size: 1.2rem;
        color: @font-color;
      }
    }
    .middle {
      white-space: nowrap;
      overflow: hidden;
      position: relative;
      display: flex;
      flex: 2;
      width: 200vw;
      > div {
        display: inline-block;
        width: 100vw;
      }
      .left {
        transition: opacity 400ms ease-in;
        .rotate-img {
          margin: 0 0.8rem;
          > img {
            height: 100%;
            width: 100%;
            border-radius: 50%;
            border: 0.8rem solid rgba(52, 52, 52, 0.2);
            animation: rotate 10s linear infinite;
            animation-play-state: paused;
            &.active {
              animation-play-state: running;
            }
          }
        }
        .line-lyric {
          height: 2rem;
          justify-content: center;
          display: flex;
          line-height: 2rem;
          margin-bottom: 0.6rem;
          > p {
            width: 80%;
            color: @theme-color;
            font-size: 1.2rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            text-align: center;
          }
        }
      }
      .right {
        transition: transform 300ms ease-in;
        position: relative;
        .trans-wrapper {
          position: absolute;
          bottom: 0;
          right: 1rem;
          i {
            font-size: 2rem;
            color: #c0c0c0;
            &.active {
              color: @theme-color;
            }
          }
        }
        .lyric-ul {
          width: 100%;
          display: flex;
          flex-direction: column;
          > li {
            display: flex;
            padding: 0.4rem;
            flex-direction: column;
            > p:first-child {
              padding-bottom: 0.4rem;
              &.active {
                font-size: 1.2rem;
              }
            }
            > p {
              margin: 0 auto;
              width: 88%;
              text-align: center;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              color: #c0c0c0;
              &.active {
                color: @theme-color;
              }
            }
          }
        }
      }
    }
    .bottom {
      display: flex;
      flex-direction: column;
      flex: 0.9;
      .process {
        display: flex;
        height: 3rem;
        align-items: center;
        > div:first-child,
        > div:last-child {
          padding: 0 0.6rem;
          > span {
            color: #c0c0c0;
          }
        }
        > div:nth-child(2) {
          flex: 1;
          position: relative;
          height: 0.2rem;
          background-color: rgba(52, 52, 52, 0.2);
          border-radius: 0.1rem;
          > div {
            background-color: @theme-color;
            position: absolute;
          }
          > div:first-child {
            top: 0;
            bottom: 0;
          }
          > div:last-child {
            height: 1rem;
            width: 1rem;
            top: -0.325rem;
            border-radius: 50%;
          }
        }
      }
      .dots {
        display: flex;
        justify-content: center;
        margin: 0.6rem 0;
        > div {
          height: 6px;
          width: 6px;
          border-radius: 50%;
          background-color: #c0c0c0;
          margin: 0 0.3rem;
          &.active {
            background-color: white;
            width: 12px;
            border-radius: 4px;
          }
        }
      }
      .control {
        display: flex;
        flex-direction: column;
        > div {
          display: flex;
          justify-content: space-around;
          margin-top: 1rem;
          align-items: center;
        }
        i {
          color: #c0c0c0;
          font-size: 2.2rem;
        }
        > div:first-child {
          i {
            color: @theme-color;
          }
          i:first-child {
            font-size: 2.6rem;
          }
          i:nth-child(3) {
            font-size: 3.8rem;
          }
          i:nth-child(2),
          i:nth-child(4) {
            font-size: 2.8rem;
          }
          i:last-child,
          i:first-child {
            color: #c0c0c0;
          }
        }
      }
    }
  }
}
</style>
