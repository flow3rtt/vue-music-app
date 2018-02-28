<template>
  <div class="rank">
    <div class="title">
      <div @click="back">
        <icon type="icon-jiantou" />
      </div>
      <div>
        <span>排行</span>
      </div>
    </div>
    <div class="content">
      <scroll click>
        <div class="qqyydfb">
          <div>
            <span>QQ音乐巅峰榜</span>
          </div>
          <div v-if="qqyydfb!==0">
            <div @click="selectItem('top',item)" v-if="item.topID!==201" v-for="(item,idx) of qqyydfb" :key="idx">
              <div>
                <img :alt="item.ListName" v-lazy="item.pic" />
              </div>
              <div>
                <div>
                  <div v-if="i<3" v-for="(song,i) of item.songlist" :key="song.songid">
                    <span>{{` ${i+1} ${song.songname} - `}}</span>
                    <span>{{`${song.singername}`}}</span>
                  </div>
                </div>
                <div>
                  <icon type="icon-jiantouyou" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="qqb">
          <div>
            <span>全球榜</span>
          </div>
          <div v-if="qqb!==0">
            <div v-for="(group,idx) of qqb" :key="idx">
              <div @click="selectItem('global',item)" v-for="item of group" :key="item.topID">
                <div>
                  <img :alt="item.ListName" v-lazy="item.pic" />
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
                <span>{{item.ListName}}</span>
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
import { mapActions, mapGetters } from "vuex";
import icon from "./icon";
import scroll from "./scroll";
import _ from "lodash";
import route from "./route";

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
    qqyydfb() {
      if (_.isEmpty(this.rank)) {
        return [];
      }
      return this.rank[0].List || [];
    },
    qqb() {
      if (_.isEmpty(this.rank)) {
        return [];
      }
      return _.chunk(this.rank[1].List, 3) || [];
    },
    ...mapGetters(["rank", "rankMap"])
  },
  methods: {
    init() {
      if (_.isEmpty(this.rank)) {
        this.getRankAsync().then(() => {});
      } else {
      }
    },
    _formatNubmer(num) {
      return `${(num / 10000) | 0}万`;
    },
    selectItem(type, item) {
      item['id'] = item.topID;
      item['date'] = item.update_key;
      item['type'] =type;
      if (!this.rankMap[item['id']]) {
        this.getRankMapAsync(
          item
        ).then(() => {});
      }
      this.$router.push({
        path: `${this.$route.path}/${item['id']}`,
      });
    },
    back() {
      this.$router.push("/musicHall");
    },
    ...mapActions(["getRankAsync","getRankMapAsync"])
  }
};
</script>


<style lang="less" scoped>
@import "../assets/style/var.less";
.rank {
  background-color: @background-color;
  position: relative;
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
    height: calc(~"100% - 3rem");
    overflow: hidden;
    background-color: #f4f4f4;
    .qqyydfb {
      > div:first-child {
        width: 100%;
        padding: 1rem 0;
        text-align: center;
        > span {
          font-size: 1.25rem;
          font-weight: 520;
        }
      }
      > div:last-child {
        display: flex;
        flex-direction: column;
        > div {
          display: flex;
          padding: 0.5rem 1rem;
          > div:first-child {
            > img {
              height: 80px;
              width: 80px;
            }
          }
          > div:last-child {
            flex: 1;
            display: flex;
            align-items: center;
            background-color: @background-color;
            padding: 0 1rem;
            justify-content: space-between;
            > div:first-child {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              > div {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 220px;
                > span {
                  font-size: 1rem;
                }
                > span:first-child {
                  font-weight: 600;
                }
                > span:last-child {
                  color: #b3b3b3;
                }
              }
            }
            i {
              color: #b3b3b3;
            }
          }
        }
      }
    }
    .qqb {
      > div:first-child {
        width: 100%;
        padding: 1rem 0;
        text-align: center;
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
            > div {
              margin-bottom: 0.4rem;
              position: relative;
              > img {
                min-height: 33vw;
                min-width: 33vw;
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
