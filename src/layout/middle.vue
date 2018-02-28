<template>
  <div class="middle">
    <transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave" v-on:after-leave="afterLeave" :css="false">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <v-loading/>
  </div>
</template>

<script>
import vLoading from '../components/loading'
export default {
  components:{vLoading},
  data() {
    return {
      prevRouteIndex: -1,
    };
  },
  watch: {
    routeIndex(newVal, val = -1) {
      this.prevRouteIndex = val;
    },
  },
  computed: {
    routeIndex() {
      return this.$route.meta.index;
    },
    translateXObj() {
      if (this.prevRouteIndex === -1 || this.routeIndex > 2) {
        return {
          enter: 0,
          leave: 0,
        };
      }
      if (this.prevRouteIndex < this.routeIndex) {
        return {
          enter: 100,
          leave: -100,
        };
      } else {
        return {
          enter: -100,
          leave: 100,
        };
      }
    },
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0;
      Velocity.hook(el, 'translateX', `${this.translateXObj.enter}%`);
    },
    enter(el, done) {
      Velocity(
        el,
        {
          opacity: 1,
          translateX: `${0}%`,
        },
        {
          duration: 200,
          complete: done,
        }
      );
    },
    leave(el, done) {
      Velocity(
        el,
        {
          opacity: 0,
          translateX: `${this.translateXObj.leave}%`,
        },
        {
          duration: 200,
          complete: done,
        }
      );
    },
    afterLeave() {
      setTimeout(() => {
        //解决子元素 position:fixed 失效的问题
        let dom = document.querySelector('.middle');
        dom.children[0].style = {};
      }, 20);
    },
  },
};
</script>

<style lang="less" scoped>
.middle {
  flex: 1;
  position: relative;
  overflow: hidden;
}
</style>
