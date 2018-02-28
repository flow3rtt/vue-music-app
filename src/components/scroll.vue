<template>
  <div ref="rootDom" class="scroll">
    <div>
      <slot/>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
export default {
  props: {
    click: {
      type: Boolean,
      default: false,
    },
    probeType: {
      type: Number,
      default: 1,
    },
    listenScroll: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    setTimeout(() => {
      this.init();
      this.state = true;
    }, 20);
  },
  beforeDestroy() {
    this.state = false;
  },
  methods: {
    init() {
      let dom = this.$refs.rootDom;
      if (!dom) {
        return;
      }
      this.scroll = new BScroll(dom, {
        click: this.click,
        probeType: this.probeType,
      });
      if (!!this.listenScroll) {
        this.scroll.on('scroll', pos => {
          if (this.state) {
            //解决组件销毁后还派发scroll事件
            this.$emit('scroll', pos);
          }
        });
      }
    },
    scrollToElement(el, ...rest) {
      this.scroll && this.scroll.scrollToElement(el, ...rest);
    },
    scrollTo(x, y, ...rest) {
      this.scroll && this.scroll.scrollTo(x, y, ...rest);
    },
    refresh(){
      this.scroll && this.scroll.refresh();
    }
  },
};
</script>

<style lang="less" scoped>
.scroll {
  max-height: 100%;
  min-height: 100%;
}
</style>
