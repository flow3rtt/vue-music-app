<template>
  <div class="route-wrapper">
    <transition name="slide">
        <router-view></router-view>
    </transition>
  </div>
</template>

<style lang="less" scoped>
  .route-wrapper {
    >div {
      position: fixed;
      width: 100%;
      top: 0;
      bottom: calc(~'5rem');
      z-index: 1;
    }
    .slide-enter-active {
      transition: all 0.3s ease;
    }
    .slide-leave-active {
      transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
    }
    .slide-enter,
    .slide-leave-to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

</style>
