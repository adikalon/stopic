<template>
  <div class="card bg-dark mb-3 images-block">
    <form class="card-body" @submit.prevent="publish">
      <h5 class="card-title">
        Upload image
      </h5>

      <div v-if="src" class="image-block">
        <img class="uploaded-image" :src="src">
      </div>

      <div class="input-row">
        <div>
          <div class="form-group">
            <label class="form-label mt-4">Image</label>
            <input ref="image" class="form-control" type="file" accept="image/jpeg,image/png" @change="imageUpload($event)">
          </div>
        </div>
        <div>
          <div class="form-check form-switch">
            <input v-model="active" class="form-check-input" type="checkbox" :checked="active">
            <label class="form-check-label">Active</label>
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Title</label> - <span>{{ title.length }}</span>
            <input v-model="title" type="text" class="form-control" @input="changeTitle">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Header</label> - <span>{{ header.length }}</span>
            <input v-model="header" type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">URL</label> - <span>{{ url.length }}</span>
            <input v-model="url" type="text" class="form-control">
          </div>
        </div>
      </div>

      <div class="input-desc-row">
        <div class="two-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Description</label> - <span>{{ description.length }}</span>
            <textarea v-model="description" class="form-control" rows="2" @input="content = description" />
          </div>
        </div>
        <div class="two-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Content</label> - <span>{{ content.length }}</span>
            <textarea v-model="content" class="form-control" rows="2" />
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Name (big)</label> - <span>{{ nameBig.length }}</span>
            <input v-model="nameBig" type="text" class="form-control" @input="picturesNamed">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Alt (big)</label> - <span>{{ altBig.length }}</span>
            <input v-model="altBig" type="text" class="form-control" @input="altSmall = altTiny = altBig">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Title (big)</label> - <span>{{ titleBig.length }}</span>
            <input v-model="titleBig" type="text" class="form-control" @input="titleSmall = titleTiny = titleBig">
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Name (small)</label> - <span>{{ nameSmall.length }}</span>
            <input v-model="nameSmall" type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Alt (small)</label> - <span>{{ altSmall.length }}</span>
            <input v-model="altSmall" type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Title (small)</label> - <span>{{ titleSmall.length }}</span>
            <input v-model="titleSmall" type="text" class="form-control">
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Name (tiny)</label> - <span>{{ nameTiny.length }}</span>
            <input v-model="nameTiny" type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Alt (tiny)</label> - <span>{{ altTiny.length }}</span>
            <input v-model="altTiny" type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Title (tiny)</label> - <span>{{ titleTiny.length }}</span>
            <input v-model="titleTiny" type="text" class="form-control">
          </div>
        </div>
      </div>

      <div>
        <div class="desc-item">
          <div class="form-group">
            <label class="form-label mt-4">Tags</label>
            <textarea v-model="tags" class="form-control" rows="1" />
          </div>
        </div>
      </div>

      <div class="publish-button">
        <div v-if="error" class="alert alert-dismissible alert-danger">
          <button type="button" class="btn-close" data-bs-dismiss="alert" @click="error = ''" />
          <h4 class="alert-heading">
            Error!
          </h4>
          <p class="mb-0">
            {{ error }}
          </p>
        </div>
        <div v-if="success" class="alert alert-dismissible alert-success">
          <button type="button" class="btn-close" data-bs-dismiss="alert" @click="success = ''" />
          <h4 class="alert-heading">
            Success!
          </h4>
          <p class="mb-0">
            {{ success }}
          </p>
        </div>
        <div class="d-grid gap-2">
          <button class="btn btn-lg btn-success" type="submit" :disabled="preload">
            <span v-if="preload" class="spinner-border spinner-border-sm" />
            Publish
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'auth',
  data () {
    return {
      preload: false,
      error: '',
      success: '',
      image: '',
      src: '',
      active: true,
      title: '',
      header: '',
      url: '',
      description: '',
      content: '',
      nameBig: '',
      altBig: '',
      titleBig: '',
      nameSmall: '',
      altSmall: '',
      titleSmall: '',
      nameTiny: '',
      altTiny: '',
      titleTiny: '',
      tags: ''
    }
  },
  head: {
    title: `Admin - ${process.env.appName}`
  },
  methods: {
    changeTitle () {
      this.header = this.title
      this.url = this.title.toLowerCase().replace(/[^\d\w-]/g, '-')
        .replace(/-{2,}/g, '-').replace(/^-/g, '').replace(/-$/g, '')
      this.description = this.title
      this.content = this.title
      this.nameBig = this.url
      this.altBig = this.title
      this.titleBig = this.title
      this.nameSmall = `${this.url}-small`
      this.altSmall = this.title
      this.titleSmall = this.title
      this.nameTiny = `${this.url}-tiny`
      this.altTiny = this.title
      this.titleTiny = this.title
    },

    picturesNamed () {
      this.nameSmall = `${this.nameBig}-small`
      this.nameTiny = `${this.nameBig}-tiny`
    },

    imageUpload (event) {
      this.image = event.target.files[0]
      const reader = new FileReader()
      reader.onload = e => (this.src = e.target.result)
      reader.readAsDataURL(this.image)
    },

    publish () {
      if (this.preload) {
        return
      }

      this.preload = true
      const auth = this.$cookies.get('auth')
      const formData = new FormData()

      formData.append('image', this.image)
      formData.append('active', this.active)
      formData.append('title', this.title)
      formData.append('header', this.header)
      formData.append('url', this.url)
      formData.append('description', this.description)
      formData.append('content', this.content)
      formData.append('bigName', this.nameBig)
      formData.append('bigAlt', this.altBig)
      formData.append('bigTitle', this.titleBig)
      formData.append('smallName', this.nameSmall)
      formData.append('smallAlt', this.altSmall)
      formData.append('smallTitle', this.titleSmall)
      formData.append('tinyName', this.nameTiny)
      formData.append('tinyAlt', this.altTiny)
      formData.append('tinyTitle', this.titleTiny)

      this.tags.split(',').forEach((t) => {
        const tag = t.trim().toLowerCase()

        if (tag) {
          formData.append('tags[]', tag)
        }
      })

      this.$axios.post(`${process.env.apiUrl}/api/picture`, formData, {
        headers: {
          Authorization: auth,
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        this.error = ''
        this.success = `Link: ${res.headers.location}`
        this.$refs.image.value = null
        this.image = ''
        this.src = ''
        this.active = true
        this.title = ''
        this.header = ''
        this.url = ''
        this.description = ''
        this.content = ''
        this.nameBig = ''
        this.altBig = ''
        this.titleBig = ''
        this.nameSmall = ''
        this.altSmall = ''
        this.titleSmall = ''
        this.nameTiny = ''
        this.altTiny = ''
        this.titleTiny = ''
        this.tags = ''
      }).catch((err) => {
        this.error = err.response.data
      }).finally(() => {
        this.preload = false
      })
    }
  }
}
</script>

<style scoped>
  .image-block {
    display: flex;
    justify-content: center;
  }

  .uploaded-image {
    max-width: 100%;
  }

  .images-block {
    width: fit-content;
    min-width: 90%;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px !important;
  }

  .input-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
  }

  .input-desc-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .desc-item {
    width: 100%;
  }

  .publish-button {
    margin-top: 30px;
  }

  .three-field-item {
    width: 33%;
    min-width: 150px;
  }

  .two-field-item {
    width: 49.7%;
    min-width: 150px;
  }

  .form-check-input:checked {
    background-color: #3fb618;
    border-color: #39a216;
  }
</style>
