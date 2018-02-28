<template>
  <div class="music-hall">
    <scroll click>
      <div class="swiper">
        <swiper :options="swiperOption">
          <swiper-slide v-for="item of swipe" :key="item.id">
            <a href="javascript:void(0)">
              <img :alt="item.cover" :src="item.pic_info.url" />
            </a>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="link-wrapper">
        <div @click="_enter('/singers')">
          <icon type="icon-geshou" />
          <span>歌手</span>
        </div>
        <div @click="_enter('/rank')">
          <icon type="icon-paihang" />
          <span>排行</span>
        </div>
        <div @click="_enter('/flgd')">
          <icon type="icon-leimupinleifenleileibie2" />
          <span>分类歌单</span>
        </div>
        <div>
          <icon type="icon-shouyinji" />
          <span>电台</span>
        </div>
        <div>
          <icon type="icon-shipin" />
          <span>视频</span>
        </div>
      </div>
      <div class="gxdt-wrapper">
        <div>
          <img src="http://y.gtimg.cn/music/common/upload/t_musichall_pic/1448974831271027900.jpg" alt="个性电台">
          <div>
            <icon type="icon-icon-12" />
            <span>个性电台</span>
          </div>
        </div>
        <div>
          <div>
            <div @click="_enter('/flgd/'+xgtjOne.id)">
              <span>歌单推荐</span>
              <span>{{xgtjOne.title}}</span>
            </div>
            <div>
              <img :alt="xgtjOne.title" :src="xgtjOne.url" />
            </div>
          </div>
          <div>
            <div>
              <span>新歌首发</span>
              <span>{{xgsfOne.title}}</span>
            </div>
            <div>
              <img :alt="xgsfOne.title" :src="xgsfOne.url" />
            </div>
          </div>
        </div>
      </div>
      <div class="wntjgd-wrapper">
        <div class="title-wrapper">
          <span>为你推荐歌单</span>
          <icon @click="_enter('/flgd')" type="icon-jiantouyou" />
        </div>
        <div class="content-wrapper">
          <div v-for="(group,idx) of wntjgd" :key="idx">
            <div @click="_enter('/flgd/'+item.content_id)" v-for="item of group" :key="item.di">
              <div>
                <img :alt="item.username" v-lazy="item.cover" />
                <div>
                  <div>
                    <icon type="icon-erji" />
                    <span>{{_formatNubmer(item.listen_num)}}</span>
                  </div>
                  <div>
                    <icon type="icon-icon-12" />
                  </div>
                </div>
              </div>
              <span>{{item.title}}</span>
            </div>
          </div>
        </div>
        <div>
          <div @click="_wntjgd">
            <icon type="icon-shuaxin" />
            <span>换一批</span>
          </div>
        </div>
      </div>
      <div class="xgsf-wrapper">
        <div class="title-wrapper">
          <span>新歌首发</span>
          <icon type="icon-jiantouyou" />
        </div>
        <div class="content-wrapper">
          <songs img :songs="xgsf" />
        </div>
        <div>
          <div @click="_xgsf">
            <icon type="icon-shuaxin" />
            <span>换一批</span>
          </div>
        </div>
      </div>
    </scroll>
    <route/>
  </div>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex';
  import {
    formatSinger,
  } from '@/utils';

  import icon from './icon';
  import scroll from './scroll';
  import route from './route';
  import songs from './songs.vue';
  import _ from 'lodash';
  export default {
    components: {
      icon,
      scroll,
      songs,
      route
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        swiperOption: {
          speed: 400,
          loop: true,
          autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
          },
        },
        wntjgd: [],
        xgsf: [],
      };
    },
    computed: {
      swipe() {
        return this.musicu['swipe'] || [];
      },

      xgtjOne() {
        let t = _.head(this.musicu['wntjgd']);
        if (!t) {
          return {
            title: '',
            url: '',
            id:''
          };
        } else {
          let url = t.cover;
          let title = t.title.slice(t.title.indexOf('：') + 1);
          return {
            url,
            title,
            id:t.content_id
          };
        }
      },
      xgsfOne() {
        let t = _.head(this.musicu['xgsf']);
        if (!t) {
          return {
            title: '',
            url: '',
          };
        } else {
          let url = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${t.album.mid}.jpg?max_age=2592000`;
          let title = `${t.name} - ${formatSinger(t.singer)}`;
          return {
            url,
            title,
          };
        }
      },
      ...mapGetters(['musicu']),
    },
    methods: {
      init() {
        if (_.isEmpty(this.musicu)) {
          this.getMusicuAsync().then(() => {
            this._wntjgd();
            this._xgsf();
          });
        } else {
          this._wntjgd();
          this._xgsf();
        }
      },
      _wntjgd: _.debounce(function (params) {
        let t = this.musicu['wntjgd'];
        this.wntjgd = _.chunk(_.sampleSize(t, 6), 3) || [];
      }, 300),
      _xgsf: _.debounce(function (params) {
        let t = this.musicu['xgsf'];
        let tt = _.sampleSize(this.musicu['xgsf'], _.random(40, 60)) || [];
        _.forEach(tt,song=>{
           song['albumname']=song.album.name;
           song['albummid']=song.album.mid;
           song['songname']=song.name;
           song['songmid']=song.mid;
           song['songid']=song.id;
           song['vid']=song.mv.vid;
        })
        this.xgsf = tt;
      }),
      _formatNubmer(num) {
        return `${(num / 10000) | 0}万`;
      },
      _enter(path){
        this.$router.push(`${this.$route.path}${path}`)
      },
      ...mapActions(['getMusicuAsync','selectSong']),
    },
  };

</script>

<style lang="less" scoped>
  @import '../assets/style/var.less';
  .music-hall {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .link-wrapper {
      height: 6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0.4rem;
      box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.04);
      z-index: 1;
      position: relative;
      >div {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        >i {
          color: @theme-color;
          font-size: 2.2rem;
        }
        >span {
          padding-top: 0.8rem;
          font-size: 1rem;
          font-weight: bold;
        }
      }
    }
    .gxdt-wrapper {
      display: flex;
      margin: 1rem 0.6rem;
      >div:first-child {
        position: relative;
        height: 120px;
        width: 120px;
        >img {
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
        >div {
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          color: @font-color;
          >i {
            font-size: 3rem;
          }
          >span {
            position: absolute;
            bottom: 1rem;
            font-size: 1.4rem;
          }
        }
      }
      >div:last-child {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-left: 1rem;
        >div {
          flex: 1;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          >div:first-child {
            display: flex;
            flex-direction: column;
            margin-left: 0.4rem;
            >span:first-child {
              font-weight: 600;
              font-size: 1.4rem;
              padding-bottom: 0.4rem;
            }
            >span:last-child {
              font-size: 1rem;
              color: #c1c1c1;
            }
          }
          >div:last-child {
            >img {
              height: calc(~'60px - 0.5rem');
            }
          }
        }
        >div:first-child {
          margin-bottom: 0.4rem;
        }
        >div:last-child {
          margin-top: 0.4rem;
        }
      }
    }
    .wntjgd-wrapper {
      .title-wrapper {
        height: 3rem;
        line-height: 3rem;
        position: relative;
        text-align: center;
        >span {
          font-size: 1.4rem;
          font-weight: 520;
          letter-spacing: 2px;
        }
        i {
          color: #d7d7d7;
          font-size: 1.6rem;
          position: absolute;
          right: 1rem;
        }
      }
      .content-wrapper {
        >div {
          display: flex;
          margin-bottom: 1rem;
          >div {
            flex: 1;
            >div {
              margin-bottom: 0.4rem;
              position: relative;
              >div {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0.4rem;
                display: flex;
                padding: 0 0.6rem;
                justify-content: space-between;
                align-items: center;
                >div:first-child {
                  font-size: 1rem;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  >span {
                    padding-left: 0.2rem;
                    transform: translateY(0.2rem);
                    color: @font-color;
                  }
                  >i {
                    color: black;
                  }
                }
                >div:last-child {
                  >i {
                    font-size: 2rem;
                    color: @font-color;
                  }
                }
              }
            }
            >span {
              font-size: 1rem;
            }
          }
          >div:nth-child(2) {
            margin: 0 0.2rem;
          }
        }
      }
      >div:last-child {
        height: 3rem;
        width: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem 0;
        >div {
          padding: 0.6rem 1rem;
          box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.04);
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 2rem;
          >span {
            padding-left: 0.4rem;
          }
        }
      }
    }
    .xgsf-wrapper {
      .title-wrapper {
        height: 3rem;
        line-height: 3rem;
        position: relative;
        text-align: center;
        >span {
          font-size: 1.4rem;
          font-weight: 520;
          letter-spacing: 2px;
        }
        i {
          color: #d7d7d7;
          font-size: 1.6rem;
          position: absolute;
          right: 1rem;
        }
      }
      >div:last-child {
        height: 3rem;
        width: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem 0;
        >div {
          padding: 0.6rem 1rem;
          box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.04);
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 2rem;
          >span {
            padding-left: 0.4rem;
          }
        }
      }
    }
  }

</style>
