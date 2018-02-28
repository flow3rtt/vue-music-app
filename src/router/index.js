import Vue from 'vue';
import Router from 'vue-router';
import My from '../components/my.vue';
import MusicHall from '../components/music-hall.vue';
import Find from '../components/find.vue';
import Singers from '../components/singers.vue';
import Singer from '../components/singer.vue';
import Rank from '../components/rank.vue';
import Ranki from '../components/ranki.vue';
import Flgd from '../components/flgd.vue';
import Flgdi from '../components/flgdi.vue';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/musicHall',
    },
    {
      path: '/my',
      name: '我的',
      component: My,
      meta: {
        index: 0,
      },
    },
    {
      path: '/musicHall',
      name: '音乐馆',
      component: MusicHall,
      meta: {
        index: 1,
      },
      children:[{
        path:'singers',
        name:'歌手',
        component:Singers,
        children:[{
          path:':mid',
          name:'歌手详情',
          component:Singer
        }]
      },{
        path:'rank',
        name:'排行',
        component:Rank,
        children:[{
          path:':id',
          name:'排行详情',
          component:Ranki
        }]
      },{
        path:'flgd',
        name:'分类歌单',
        component:Flgd,
        children:[{
          path:':id',
          name:'歌单详情',
          component:Flgdi
        }]
      }]
    },
    {
      path: '/find',
      name: '发现',
      component: Find,
      meta: {
        index: 2,
      },
    },
  ],
});
