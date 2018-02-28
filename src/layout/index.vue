<template>
  <div id="app">
    <top/>
    <middle/>
    <bottom/>
  </div>
</template>

<script>
import top from './top';
import middle from './middle';
import bottom from './bottom';
export default {
  components: {
    top,
    middle,
    bottom,
  },
};
</script>

<style lang="less">
@import '../assets/style/normalize.min.css';
@import '../assets/style/minireset.min.css';
@import url(//at.alicdn.com/t/font_551223_3tkmnc7nk974aemi.css);
@import '../assets/style/index.less';
#app {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .swiper-pagination-bullet-active {
    background-color: @theme-color !important;
  }
  .vux-tab{
    z-index: 2;
  }
}
</style>
