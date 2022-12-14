<template>
  <div>
    <main-menu />

    <main>
      <nuxt />
    </main>
  </div>
</template>

<script>
import MainMenu from '@/components/MainMenu'

export default {
  components: { MainMenu }
}
</script>
