<template>
  <div v-if="loading" class="loading">
    <div class="filter"></div>
    <spinner :show="loading" type="android" size="3rem"/>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Spinner } from "vux";
export default {
  components: {
    Spinner
  },
  computed: {
    ...mapGetters(["loading"])
  }
};
</script>
<style lang="less" scoped>
@import '../assets/style/index.less';
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.2);
  }
  .vux-spinner{
    z-index: 12;
    stroke:@theme-color;
  }
}
</style>
