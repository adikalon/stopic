<template>
  <div>
    <main-menu />

    <div class="cards">
      <card-item v-for="item in 30" :key="item" class="card" />
    </div>

    <div class="pagination">
      <middle-pagination />
    </div>
  </div>
</template>

<script>
import MiddlePagination from '@/components/MiddlePagination'
import CardItem from '@/components/CardItem'
import MainMenu from '@/components/MainMenu'

export default {
  name: 'IndexPage',
  components: { MainMenu, MiddlePagination, CardItem }
}
</script>

<style scoped>
  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .card {
    margin: 10px !important;
  }

  .pagination {
    display: flex;
    justify-content: center;
  }
</style>
