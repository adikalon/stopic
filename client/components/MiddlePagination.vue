<template>
  <div>
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: !first }">
        <NuxtLink v-if="first" class="page-link" :to="first">
          &laquo;
        </NuxtLink>
        <span v-else class="page-link span-page">&laquo;</span>
      </li>
      <li class="page-item" :class="{ disabled: !prev }">
        <NuxtLink v-if="prev" class="page-link" :to="prev">
          &#8249;
        </NuxtLink>
        <span v-else class="page-link span-page">&#8249;</span>
      </li>
      <li class="page-item active">
        <span class="page-link span-page">{{ page }}</span>
      </li>
      <li class="page-item" :class="{ disabled: !next }">
        <NuxtLink v-if="next" class="page-link" :to="next">
          &#8250;
        </NuxtLink>
        <span v-else class="page-link span-page">&#8250;</span>
      </li>
      <li class="page-item" :class="{ disabled: !last }">
        <NuxtLink v-if="last" class="page-link" :to="last">
          &raquo;
        </NuxtLink>
        <span v-else class="page-link span-page">&raquo;</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    pages: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      page: 1,
      first: null,
      prev: null,
      next: null,
      last: null
    }
  },
  watch: {
    '$route.query.page' () {
      this.render()
    }
  },
  mounted () {
    this.render()
  },
  methods: {
    render () {
      this.page = this.$route.query?.page ? +this.$route.query.page : 1
      const query = new URLSearchParams(this.$route.query)

      if (this.page > 1) {
        if (query.has('page')) {
          query.delete('page', 1)
        }

        this.first = `/?${query.toString()}`
        query.set('page', this.page - 1)
        this.prev = `/?${query.toString()}`
      } else {
        this.first = null
        this.prev = null
      }

      if (this.page < this.pages) {
        query.set('page', this.page + 1)
        this.next = `/?${query.toString()}`
        query.set('page', this.pages)
        this.last = `/?${query.toString()}`
      } else {
        this.next = null
        this.last = null
      }
    }
  }
}
</script>

<style scoped>
  .span-page {
    cursor: default;
  }

  .page-link {
    color: #ffffff;
    background-color: #373a3c;
    border: 1px solid #232323;
  }

  .disabled > * {
    color: #7b7b7b;
    background-color: #2b2d2f;
  }

  .active > * {
    color: #373a3c;
    background-color: #f8f9fa;
  }
</style>
