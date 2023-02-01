<template>
  <div class="card mb-3 detail-block">
    <div class="card-body">
      <h1 class="card-title main-header">
        {{ picture.header }}
      </h1>
      <p class="card-subtitle text-muted content-desc">
        {{ picture.content }}
      </p>
    </div>
    <img
      :src="`${host}/api/picture/${picture.id}/preview/${picture.previewName}.webp`"
      :width="`${picture.previewWidth}px`"
      :height="`${picture.previewHeight}px`"
      class="img-image"
      :alt="picture.previewAlt"
      :title="picture.previewTitle"
    >
    <div class="card-body">
      <ul class="card-properties">
        <li><b>Width: </b> {{ picture.width }}px</li>
        <li><b>Height: </b> {{ picture.height }}px</li>
        <li><b>Size: </b> {{ size(picture.size) }}</li>
        <li><b>Mime: </b> {{ mime(picture.mime) }}</li>
        <li><b>Views: </b> {{ picture.views }}</li>
        <li><b>Downloads: </b> {{ picture.downloads }}</li>
      </ul>
      <div class="d-grid">
        <a class="btn btn-lg btn-primary" :href="picture.link">
          Download for free after watching ads
        </a>
      </div>
      <div class="tags-content">
        <NuxtLink
          v-for="tag in picture.tags"
          :key="tag.id"
          class="badge bg-info tag-button tag-link"
          :to="`/?tag=${tag.id}`"
        >
          {{ tag.name }}
        </NuxtLink>
      </div>
      <div v-if="similar.length">
        <h3 class="card-title similar-header">
          Similar images
        </h3>
        <div class="similar-block">
          <div v-for="sim in similar" :key="sim.id" class="card border-primary similar-item">
            <NuxtLink :to="`/${sim.url}-${sim.id}`">
              <img
                :src="`${host}/api/picture/${sim.id}/preview/${sim.previewName}.webp`"
                :width="`${sim.previewWidth}px`"
                :height="`${sim.previewHeight}px`"
                class="similar-image"
                :alt="sim.previewAlt"
                :title="sim.previewTitle"
              >
              <span class="similar-size">{{ sim.width }} x {{ sim.height }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <time class="card-footer text-muted date-block" pubdate :datetime="picture.created">
      Posted at: {{ new Date(picture.created).toLocaleString() }}
    </time>
  </div>
</template>

<script>
export default {
  async asyncData ({ route, error, app }) {
    const params = route.params?.id.match(/^(?<url>.+)-(?<id>\d+)$/)

    if (!params) {
      return error({ statusCode: 404, message: 'Page not found' })
    }
    let host = 'http://server:3000'

    if (process.client) {
      host = process.env.apiUrl
    }

    try {
      const pic = await app.$axios.get(`${host}/api/picture/${params.groups.id}`)
      const sim = await app.$axios.get(`${host}/api/picture/recommended/${params.groups.id}`)
      return {
        picture: pic.data,
        similar: sim.data
      }
    } catch (err) {
      return error({ statusCode: err.response.status, message: err.response.data })
    }
  },
  data () {
    return {
      host: process.env.apiUrl
    }
  },
  head () {
    return {
      title: `${this.picture.title} - ${process.env.appName}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.picture.description
        }
      ]
    }
  },
  methods: {
    mime (full) {
      return full.replace('image/', '')
    },
    size (bytes) {
      if (!+bytes) {
        return '0 Bytes'
      }

      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
    }
  }
}
</script>

<style scoped>
  .main-header {
    font-size: 1.25rem;
  }

  .content-desc {
    font-size: 1rem;
    font-family: "Cabin Sketch",cursive;
    font-weight: 500;
    line-height: 1.2;
  }

  .detail-block {
    width: fit-content;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 0 !important;
  }

  .date-block {
    text-align: right;
  }

  .img-image {
    width: 100%;
    height: 100%;
  }

  .card-properties {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    justify-content: space-between;
  }

  .card-properties > li {
    display: block;
  }

  .card-properties > li:not(:last-child) {
    padding-right: 5px;
  }

  .tags-content {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    max-width: 768px;
    margin-top: 15px;
  }

  .tag-button {
    cursor: pointer;
    display: block;
    margin: 2px;
  }

  .similar-header {
    margin-top: 30px;
    font-size: 1.25rem;
  }

  .similar-block {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 768px;
  }

  .similar-item {
    position: relative;
    overflow: hidden;
    width: 150px;
    height: 150px;
    background-color: #868e96;
    cursor: pointer;
    margin-top: 5px;
  }

  .similar-image {
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .similar-size {
    position: absolute;
    right: 0;
    bottom: 0;
    color: #fff;
    background-color: rgba(39, 36, 36, 0.8);
    padding: 10px;
  }

  .tag-link {
    text-decoration: none;
  }

  .tag-link:hover {
    color: #fff;
    background-color: #158B9D !important;
  }
</style>
