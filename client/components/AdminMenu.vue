<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <NuxtLink class="navbar-brand" to="/">
          <h2 class="main-header">
            {{ siteName }} - free pictures only
          </h2>
        </NuxtLink>
        <div class="navbar-navigation">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data: () => ({
    siteName: process.env.appName || ''
  }),
  methods: {
    logout () {
      this.$cookies.remove('auth')
      this.$router.push('/admin/login')
    }
  }
}
</script>

<style scoped>
  .main-header {
    display: inline;
    font-size: 1.25rem;
    margin-bottom: 0;
  }

  .navbar-nav {
    flex-direction: row;
  }

  .nav-link {
    padding-right: 10px;
    padding-left: 10px;
  }
</style>
