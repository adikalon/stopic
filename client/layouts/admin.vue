<template>
  <div>
    <admin-menu />

    <main>
      <nuxt />
    </main>
  </div>
</template>

<script>
import AdminMenu from '@/components/AdminMenu'

export default {
  components: { AdminMenu }
}
</script>
