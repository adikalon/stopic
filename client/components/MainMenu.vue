<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <NuxtLink class="navbar-brand" to="/">
          <h2 class="main-header">
            {{ siteName }} - free pictures only
          </h2>
        </NuxtLink>
        <div class="navbar-navigation">
          <form class="d-flex" @submit.prevent="filter">
            <input v-model="search" class="form-control me-sm-2 search-field" type="text" placeholder="What are we looking for?">
            <input v-if="advSearch" v-model="minWidth" class="form-control me-sm-2 search-field addition-search" type="text" placeholder="Min Width">
            <input v-if="advSearch" v-model="minHeight" class="form-control me-sm-2 search-field addition-search" type="text" placeholder="Min Height">
            <input v-if="advSearch" v-model="maxWidth" class="form-control me-sm-2 search-field addition-search" type="text" placeholder="Max Width">
            <input v-if="advSearch" v-model="maxHeight" class="form-control me-sm-2 search-field addition-search" type="text" placeholder="Max Height">
            <div class="btn-group navbar-buttons" role="group" aria-label="Basic example">
              <button type="button" class="btn btn-secondary" @click="toggleAdvSerach">
                <svg
                  v-if="advSearch"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-caret-right"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-caret-left"
                  viewBox="0 0 16 16"
                >
                  <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
                </svg>
              </button>
              <button type="submit" class="btn btn-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </button>
              <button type="button" class="btn btn-secondary" @click="showTags">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z" />
                  <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </nav>
    <div v-if="tagsModal" class="tags-modal" data-tags="close" @click="closeTags">
      <div class="tags-content card border-primary mb-3">
        <button type="button" class="btn-close tags-close" data-tags="close" />
        <NuxtLink
          v-for="tag in tags"
          :key="tag.id"
          data-tags="close"
          class="badge bg-info tag-button tag-link"
          :to="`/?tag=${tag.id}`"
        >
          {{ tag.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    siteName: process.env.appName || '',
    advSearch: false,
    tagsModal: false,
    tags: [],
    search: '',
    minWidth: null,
    minHeight: null,
    maxWidth: null,
    maxHeight: null
  }),
  async fetch () {
    let host = 'http://server:3000'

    if (process.client) {
      host = process.env.apiUrl
    }

    this.tags = await fetch(`${host}/api/tag/popular`).then(res => res.json())
  },
  methods: {
    toggleAdvSerach () {
      this.advSearch = !this.advSearch

      if (!this.advSearch) {
        this.minWidth = null
        this.minHeight = null
        this.maxWidth = null
        this.maxHeight = null
      }
    },
    showTags () {
      this.tagsModal = true
    },
    closeTags (e) {
      if (e.target.dataset.tags === 'close') {
        this.tagsModal = false
      }
    },
    filter () {
      const query = new URLSearchParams()

      if (this.search) {
        query.append('search', this.search)
      }

      if (this.minWidth) {
        query.append('minWidth', this.minWidth)
      }

      if (this.minHeight) {
        query.append('minHeight', this.minHeight)
      }

      if (this.maxWidth) {
        query.append('maxWidth', this.maxWidth)
      }

      if (this.maxHeight) {
        query.append('maxHeight', this.maxHeight)
      }

      this.$router.push(`/?${query.toString()}`)
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

  .navbar-navigation {
    width: 100%;
  }

  .addition-search {
    width: 150px;
  }

  .tags-modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
  }

  .tags-content {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin: 5% auto;
    padding: 35px 15px 15px 15px;
    width: 80%;
  }

  .tag-button {
    cursor: pointer;
    display: block;
    margin: 2px;
  }

  .tag-button:hover {
    background-color: #158b9d !important;
  }

  .tags-close {
    position: absolute;
    right: 0;
    top: 0;
    color: #4d4d4d;
  }

  .tags-close:hover {
    color: #35252F;
  }

  @media (max-width: 1300px) {
    .d-flex {
      display: inherit !important;
    }

    .container-fluid {
      display: block;
    }

    .search-field {
      margin-bottom: 5px;
    }

    .addition-search {
      width: 100%;
    }

    .navbar-buttons {
      display: flex;
    }
  }

  .tag-link {
    text-decoration: none;
  }

  .tag-link:hover {
    color: #fff;
    background-color: #158B9D !important;
  }
</style>
