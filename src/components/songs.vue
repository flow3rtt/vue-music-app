<template>
  <div ref="songs" class="songs">
    <div :data-index="idx"    v-for="(song,idx) of songs" :key="idx">
      <div v-if="img" class="img">
        <img :alt="song.songname" v-lazy="`https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`"
        />
      </div>
      <div v-if="index" class="index">
        <span :class="{
          active:idx<=2
        }">{{idx+1}}</span>
      </div>
      <div :style="borderStyle">
        <div class="info">
          <span>{{song.songname}}</span>
          <span>{{`${formatSinger(song.singer)}·${song.albumname}`}}</span>
        </div>
        <div class="icon">
          <icon v-if="song.vid" type="icon-MV" />
          <icon type="icon-gengduo2" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import _ from "lodash";
import icon from "./icon";
import { formatSinger } from "@/utils";
import { mapActions } from "vuex";
import AlloyFinger from "alloyfinger";

export default {
  components: {
    icon
  },
  props: {
    songs: {
      type: Array,
      required: true
    },
    img: {
      type: Boolean,
      default: false
    },
    index: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      for (let index = 0; index < this.$refs.songs.children.length; index++) {
        const element = this.$refs.songs.children[index];
        new AlloyFinger(element, {
          singleTap: this._selectSong.bind(null, element.dataset.index),
          doubleTap: this._selectAllSong.bind(null, element.dataset.index)
        });
      }
    });
  },
  methods: {
    formatSinger,
    _selectSong(index) {
      let list = [this.songs[index]];
      this.selectSong({
        list,
        index: 0
      });
    },
    _selectAllSong(index) {
      let list = this.songs;
      this.selectSong({
        list,
        index
      });
    },
    ...mapActions(["selectSong"])
  },
  computed: {
    borderStyle() {
      return this.border
        ? {
            borderBottom: `.2px solid #EDEDED`
          }
        : {};
    }
  },
  watch: {
    songs() {
      this.$nextTick(() => {
        for (let index = 0; index < this.$refs.songs.children.length; index++) {
          const element = this.$refs.songs.children[index];
          new AlloyFinger(element, {
            singleTap: this._selectSong.bind(null, element.dataset.index),
            doubleTap: this._selectAllSong.bind(null, element.dataset.index)
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.songs {
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.8rem 1rem;
    .img {
      max-height: 100%;
      margin-right: 1rem;
      > img {
        max-height: 60px;
        width: 60px;
        min-height: 60px;
      }
    }
    .index {
      margin: 0.4rem;
      margin-right: 1.6rem;
      > span {
        color: #c0c0c0;
        font-size: 1.4rem;
        &.active {
          color: red;
        }
      }
    }
    > div:last-child {
      display: flex;
      max-height: 60px;
      min-height: 60px;
      flex: 1;
      align-items: center;
    }
    .info {
      display: flex;
      flex-direction: column;
      margin-right: auto;
      > span {
        max-width: 250px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      > span:first-child {
        font-weight: 400;
        font-size: 1.25rem;
        padding-bottom: 0.8rem;
      }
      > span:last-child {
        font-size: 1rem;
        color: #c0c0c0;
      }
    }
    .icon {
      > i {
        font-size: 1.6rem;
        color: #c0c0c0;
      }
    }
  }
}
</style>
