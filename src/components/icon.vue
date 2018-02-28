<template>
  <i @click="handleClick($event)" :class="className"></i>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  methods:{
    handleClick(e){
      this.$emit('click')
    }
  },
  computed: {
    className() {
      return `iconfont ${this.type}`;
    },
  },
};
</script>
