<template>
  <div class="singers">
    <div class="title">
      <div @click="back">
        <icon type="icon-jiantou" />
      </div>
      <div>
        <span>歌手</span>
      </div>
      <div>
        <icon type="icon-icon-8" />
      </div>
    </div>

    <div v-show="index!==0" class="fixed-index">
      <ul>
        <li v-for="(t,idx) of indexs" :key="idx" @click="indexClick(idx)">
          <span :class="{active:idx===index}">{{t}}</span>
        </li>
      </ul>
    </div>
    <div class="content">
      <div v-show="index!==0" class="fixed-title">
        <span>{{fixedTitle}}</span>
      </div>
      <scroll ref="scroll" click :probe-type="3" @scroll="scroll" listenScroll>
        <div v-for="(group,idx) of singers" :key="idx">
          <div>
            <span>{{group.title}}</span>
          </div>
          <div>
            <div v-for="singer of group.items" :key="singer.mid">
              <div>
                <img :alt="singer.Fsinger_name" v-lazy="`https://y.gtimg.cn/music/photo_new/T001R150x150M000${singer.Fsinger_mid}.jpg?max_age=2592000`"
                />
              </div>
              <div @click="selectSinger(singer)">
                <div>
                  <span>{{singer.Fsinger_name}}</span>
                </div>
                <div>
                  <icon type="icon-jiantouyou" />
                </div>
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
  import {
    mapActions,
    mapGetters
  } from 'vuex';
  import _ from 'lodash';
  import icon from './icon';
  import scroll from './scroll';
  import route from './route';
  export default {
    components: {
      icon,
      scroll,
      route
    },
    created() {
      this.domHeight = [];
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        index: 0,
      };
    },
    computed: {
      indexs() {
        return _.map(this.singers, t => t.title);
      },
      fixedTitle() {
        return this.indexs[this.index];
      },
      ...mapGetters(['singers']),
    },
    methods: {
      init() {
        if (_.isEmpty(this.singers)) {
          this.getSingersAsync().then(() => {
            setTimeout(() => {
              this.calcDomHeight();
            }, 20);
          });
        } else {
          this.calcDomHeight();
        }
      },
      back() {
       this.$router.push('/musicHall')
      },
      scroll(pos) {
        let y = -pos.y;
        if (_.isEmpty(this.domHeight)) {
          return;
        }
        for (let index = 0; index < this.domHeight.length - 1; index++) {
          const h = this.domHeight[index];
          const nh = this.domHeight[index + 1];
          if (y >= h && y < nh) {
            if (this.index !== index) {
              this.index = index;
            }
          }
        }
      },
      calcDomHeight() {
        let dom = this.$refs.scroll.$el.children[0];
        let h = 0;
        this.domHeight.push(h);
        _.forEach(dom.children, child => {
          let th = child.clientHeight;
          h += th;
          this.domHeight.push(h);
        });
      },
      indexClick(idx) {
        let dom = this.$refs.scroll.$el.children[0].children[idx];
        this.$refs.scroll.scrollToElement(dom, 300);
      },
      selectSinger(singer){
        this.$router.push({
          path:`${this.$route.path}/${singer.Fsinger_mid}`,
        })
      },
      ...mapActions(['getSingersAsync']),
    },
  };

</script>


<style lang="less" scoped>
  @import '../assets/style/var.less';
  .singers {
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
    .fixed-title {
      z-index: 1;
      position: absolute;
      top: 0;
      height: 2rem;
      display: flex;
      padding: 1rem;
      align-items: center;
      left: 0;
      right: 0;
      background-color: #f0f0f0;
      >span {
        color: #bcbcbc;
      }
    }
    .fixed-index {
      z-index: 1;
      position: fixed;
      top: 0;
      bottom: 0;
      display: flex;
      padding: 1rem;
      align-items: center;
      right: 0;
      width: 1.2rem;
      justify-content: center;
      >ul {
        background-color: #f0f0f0;
        padding: 1rem 0.2rem;
        text-align: center;
        border-radius: 0.8rem;
        >li {
          padding: 0.2rem 0;
          >span {
            font-size: 1rem;
            color: #bcbcbc;
            &.active {
              font-size: 1.1rem;
              color: @theme-color;
            }
          }
        }
      }
    }
    .content {
      overflow: hidden;
      height: calc(~'100% - 3rem');
      position: relative;
      >div {
        >div {
          >div {
            display: flex;
            flex-direction: column;
            >div:first-child {
              height: 2rem;
              display: flex;
              padding: 1rem;
              align-items: center;
              background-color: #f0f0f0;
              >span {
                color: #bcbcbc;
              }
            }
            >div:last-child {
              padding: 1rem 0.8rem;
              >div {
                display: flex;
                padding: 0.8rem 0;
                >div:first-child {
                  padding-right: 0.6rem;
                  >img {
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                  }
                }
                >div:last-child {
                  flex: 1;
                  display: flex;
                  align-items: center;
                  padding-left: 0.8rem;
                  justify-content: space-between;
                  border-bottom: 1px solid #ededed;
                  span {
                    font-size: 1.2rem;
                    font-weight: 520;
                  }
                  i {
                    color: #bcbcbc;
                    font-size: 1.4rem;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

</style>
