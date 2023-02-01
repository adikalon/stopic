<template>
  <div>
    <div class="items">
      <card-item v-for="picture in pictures" :key="picture.id" :picture="picture" class="item" />
    </div>

    <div v-if="pages > 1" class="pagination">
      <middle-pagination :pages="pages" />
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

    const params = {}

    if (context.route.query.page) {
      params.page = context.route.query.page
    }

    if (context.route.query.tag) {
      params.tags = context.route.query.tag
    }

    if (context.route.query.search) {
      params.search = context.route.query.search
    }

    if (context.route.query.minWidth) {
      params.fromWidth = context.route.query.minWidth
    }

    if (context.route.query.minHeight) {
      params.fromHeight = context.route.query.minHeight
    }

    if (context.route.query.maxWidth) {
      params.toWidth = context.route.query.maxWidth
    }

    if (context.route.query.maxHeight) {
      params.toHeight = context.route.query.maxHeight
    }

    const pic = await context.app.$axios.get(`${host}/api/picture`, { params })

    return {
      pictures: pic.data,
      pages: Math.ceil(+pic.headers['pagination-total'] / +pic.headers['pagination-limit'])
    }
  },
  watchQuery: [
    'page', 'tag', 'search', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'
  ]
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
    margin-top: 5px;
  }
</style>
