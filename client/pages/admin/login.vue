<template>
  <div class="card mb-3 login-block">
    <div class="card-body">
      <h5 class="card-title">
        Enter access key
      </h5>
      <div class="form-group has-danger key-field">
        <input type="text" placeholder="Access key" class="form-control is-invalid">
        <div class="invalid-feedback">
          Sorry, that username's taken. Try another?
        </div>
      </div>
      <div class="d-grid gap-2 key-button">
        <button class="btn btn-lg btn-primary" type="button">
          Login
        </button>
      </div>
    </div>
  </div>
</template>

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
