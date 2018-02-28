<template>
  <div class="top">
    <div class="link">
      <div>
        <icon type="icon-gengduo"></icon>
      </div>
      <div>
        <router-link to="/my">我的</router-link>
        <router-link to="/musicHall">音乐馆</router-link>
        <router-link to="/find">发现</router-link>
      </div>
      <div>
          <icon type="icon-jia"></icon>
      </div>
    </div>
    <div class="search">
      <div>
        <icon type="icon-icon-8" />
        <span>搜索</span>
      </div>
    </div>
  </div>
</template>

<script>
import icon from '../components/icon';
export default {
  components: {
    icon,
  },
};
</script>

<style lang="less" scoped>
@import '../assets/style/var.less';
.top {
  height: 6rem;
  background-color: @theme-color;
  display: flex;
  flex-direction: column;
  .link {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.4rem;
    padding: 0 0.6rem;
    i {
      font-size: 1.6rem;
      color: @font-color;
    }
    > div:nth-child(2) {
      > a {
        text-decoration: none;
        color: @font-color;
        &.router-link-active {
          color: white;
        }
      }
      > a:nth-child(2) {
        padding: 0 1rem;
      }
    }
  }
  .search {
    margin: 0.6rem;
    color: @font-color;
    > div:first-child {
      padding: 0.2rem;
      background-color: #2caf70;
      border-radius: 0.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        padding: 0 0.2rem;
        transform: translate3d(0, 1px, 0);
      }
    }
  }
}
</style>
