<template>
  <div class="bottom">
    <player/>
  </div>
</template>

<script>
import player from '../components/player'
export default {
  components:{
    player
  }
};
</script>

<style lang="less" scoped>
@import '../assets/style/var.less';
.bottom {
  height: 5rem;
  background-color:white;
  z-index: 10;
}
</style>
