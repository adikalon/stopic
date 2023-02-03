<template>
  <div class="error-block">
    <h2 class="status">
      {{ error.statusCode }}
    </h2>
    <h1 class="message">
      {{ error.message }}
    </h1>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  head () {
    return {
      title: `${this.error.message} - ${process.env.appName}`
    }
  }
}
</script>

<style scoped>
  .error-block {
    margin-top: 30px;
    text-align: center;
  }

  .status {
    font-size: 130px;
  }

  .message {
    font-size: 30px;
  }
</style>
