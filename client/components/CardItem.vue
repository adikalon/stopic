<template>
  <div class="card border-primary img-block">
    <img src="http://images.localhost/3.jpg" class="img-image" alt="">
    <span class="img-size">1366 x 830</span>
  </div>
</template>

<style scoped>
  .img-block {
    position: relative;
    overflow: hidden;
    width: 320px;
    height: 320px;
    background-color: #868e96;
    cursor: pointer;
  }

  .img-image {
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .img-size {
    position: absolute;
    right: 0;
    bottom: 0;
    color: #fff;
    background-color: rgba(39, 36, 36, 0.8);
    padding: 10px;
  }
</style>
