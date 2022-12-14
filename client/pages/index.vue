<template>
  <div>
    <div class="items">
      <card-item v-for="item in 30" :key="item" class="item" />
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
  components: { MiddlePagination, CardItem }
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
