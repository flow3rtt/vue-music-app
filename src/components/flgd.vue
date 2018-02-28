<template>
  <div class="flgd">
    <div class="title">
      <div @click="back">
        <icon type="icon-jiantou" />
      </div>
      <div>
        <span>分类歌单</span>
      </div>
      <div>
        <span>投稿</span>
      </div>
    </div>
    <div class="content">
      <scroll click="">
        <div class="jxgd">
          <div>
            <span>精选歌单</span>
          </div>
          <div v-if="jxgd.length!==0">
            <div v-for="(group,idx) of jxgd" :key="idx">
              <div @click="selectFlgd(item)" v-for="item of group" :key="item.dissid">
                <div>
                  <img :alt="item.dissname" v-lazy="item.imgurl" />
                  <div>
                    <div>
                      <icon type="icon-erji" />
                      <span>{{_formatNubmer(item.listennum)}}</span>
                    </div>
                    <div>
                      <icon type="icon-icon-12" />
                    </div>
                  </div>
                </div>
                <span>{{item.dissname}}</span>
                <span>{{item.creator.name}}</span>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <route/>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import icon from './icon.vue';
import scroll from './scroll.vue';
import route from './route'
import _ from 'lodash';
export default {
  components: {
    icon,
    scroll,
    route
  },
  mounted() {
    this.init();
  },
  computed: {
    jxgd() {
      if (_.isEmpty(this.flgd)) {
        return [];
      }
      return _.chunk(this.flgd, 2);
    },
    ...mapGetters(['flgd']),
  },
  methods: {
    init() {
      if (_.isEmpty(this.flgd)) {
        this.getFlgdAsync().then(() => {});
      } else {
      }
    },
    _formatNubmer(num) {
      return `${(num / 10000) | 0}万`;
    },
    back() {
      this.$router.push('/musicHall');
    },
    selectFlgd(item) {
      this.$router.push({
        path: `${this.$route.path}/${item['dissid']}`,
      });
    },
    ...mapActions(['getFlgdAsync']),
  },
};
</script>


<style lang="less" scoped>
@import '../assets/style/var.less';
.flgd {
  background-color: @background-color;
  .title {
    z-index: 2;
    height: 3rem;
    background-color: @theme-color;
    display: flex;
    padding: 0 1rem;
    justify-content: space-between;
    align-items: center;
    color: @font-color;
    i {
      font-size: 1.8rem;
    }
    span {
      font-size: 1.2rem;
    }
  }
  .content {
    height: calc(~'100% - 3rem');
    overflow: hidden;
    background-color: #f4f4f4;
    .jxgd {
      > div:first-child {
        width: 100%;
        padding: 1rem; // text-align: center;
        > span {
          font-size: 1.25rem;
          font-weight: 520;
        }
      }
      > div:last-child {
        > div {
          display: flex;
          margin-bottom: 1rem;
          > div {
            flex: 1;
            background-color: @background-color;
            padding-bottom: 0.6rem;
            display: flex;
            flex-direction: column;
            > div {
              margin-bottom: 0.4rem;
              position: relative;
              > img {
                min-height: 49vw;
                min-width: 49vw;
              }
              > div {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0.4rem;
                display: flex;
                padding: 0 0.6rem;
                justify-content: space-between;
                align-items: center;
                > div:first-child {
                  font-size: 1rem;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  > span {
                    padding-left: 0.2rem;
                    transform: translateY(0.2rem);
                    color: @font-color;
                  }
                  > i {
                    color: black;
                  }
                }
                > div:last-child {
                  > i {
                    font-size: 2rem;
                    color: @font-color;
                  }
                }
              }
            }
            > span {
              font-size: 1rem;
            }
            > span:nth-child(2) {
              // line-height: 2rem;
              height: 2rem;
            }
            > span:last-child {
              padding-top: 0.4rem;
              color: #b3b3b3;
            }
          }
          > div:nth-child(2) {
            margin: 0 0.2rem;
          }
        }
      }
    }
  }
}
</style>
