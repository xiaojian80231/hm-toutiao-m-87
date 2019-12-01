<template>
  <div class="container">
    <van-skeleton title avatar :row="3" />
    <van-skeleton title avatar :row="3" />
    <van-skeleton title avatar :row="3" />
  </div>
</template>

<script>
export default {
  name: 'video-index'
}
</script>

<style lang="less" scoped>
.van-skeleton{
  margin-top: 10px;
}
</style>
