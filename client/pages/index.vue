<template>
  <div>
    <div class="items">
      <card-item v-for="picture in pictures" :key="picture.id" :picture="picture" class="item" />
    </div>

    <div class="pagination">
      <middle-pagination />
    </div>
  </div>
</template>

<script>
import MiddlePagination from '@/components/MiddlePagination'
import CardItem from '@/components/CardItem'

export default {
  name: 'IndexPage',
  components: { MiddlePagination, CardItem },

  async asyncData (context) {
    let host = 'http://server:3000'

    if (process.client) {
      host = process.env.apiUrl
    }

    const pic = await context.app.$axios.get(`${host}/api/picture`)

    return {
      pictures: pic.data,
      pagLimit: pic.headers['pagination-limit'],
      pagTotal: pic.headers['pagination-total']
    }
  }
}
</script>

<style scoped>
  .items {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .item {
    margin: 10px !important;
  }

  .pagination {
    display: flex;
    justify-content: center;
  }
</style>
