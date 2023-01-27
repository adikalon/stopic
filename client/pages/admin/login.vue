<template>
  <div class="card mb-3 login-block">
    <div class="card-body">
      <h5 class="card-title">
        Enter access key
      </h5>
      <div class="form-group has-danger key-field">
        <input v-model="key" type="text" placeholder="Access key" class="form-control" :class="{ 'is-invalid': error }">
        <div class="invalid-feedback">
          {{ error }}
        </div>
      </div>
      <div class="d-grid gap-2 key-button">
        <button class="btn btn-lg btn-primary" type="button" @click="login">
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      error: '',
      key: ''
    }
  },
  head: {
    title: `Login - ${process.env.appName}`
  },
  methods: {
    login () {
      const auth = `Bearer ${this.key}`

      this.$axios.post(`${process.env.apiUrl}/api/visitor/auth`, null, {
        headers: {
          Authorization: auth
        }
      }).then(() => {
        this.$cookies.set('auth', auth)
        this.$router.push('/admin')
      }).catch((err) => {
        this.error = err.response.data
      })
    }
  }
}
</script>

<style scoped>
  .login-block {
    max-width: 450px;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 0 !important;
  }

  .key-field {
    margin-top: 15px;
  }

  .key-button {
    margin-top: 15px;
  }
</style>
