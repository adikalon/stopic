<template>
  <NuxtLink :to="`/${picture.url}-${picture.id}`">
    <div class="card border-primary img-block">
      <img
        :src="`${host}/api/picture/${picture.id}/preview/${picture.previewName}.webp`"
        class="img-image"
        :alt="picture.previewAlt"
        :title="picture.previewTitle"
      >
      <span class="img-size">{{ picture.width }} x {{ picture.height }}</span>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    picture: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      host: process.env.apiUrl
    }
  }
}
</script>

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
