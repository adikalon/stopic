<template>
  <div class="card mb-3 detail-block">
    <div class="card-body">
      <h5 class="card-title">
        This is header
      </h5>
      <h6 class="card-subtitle text-muted">
        This is content
      </h6>
    </div>
    <img src="http://images.localhost/4.jpg" width="800px" height="354px" class="img-image" alt="">
    <div class="card-body">
      <ul class="card-properties">
        <li><b>Width: </b> 1036px</li>
        <li><b>Height: </b> 840px</li>
        <li><b>Size: </b> 136kb</li>
        <li><b>Mime: </b> jpeg</li>
        <li><b>Views: </b> 136</li>
        <li><b>Downloads: </b> 15</li>
      </ul>
      <div class="d-grid">
        <button class="btn btn-lg btn-primary" type="button">
          Download for free after watching ads
        </button>
      </div>
      <div class="tags-content">
        <span v-for="item in 20" :key="item" class="badge bg-info tag-button">Info</span>
      </div>
      <h5 class="card-title similar-header">
        Similar images
      </h5>
      <div class="similar-block">
        <div v-for="item in 30" :key="item" class="card border-primary similar-item">
          <img src="http://images.localhost/5.jpg" class="similar-image" alt="">
          <span class="similar-size">1366 x 830</span>
        </div>
      </div>
    </div>
    <div class="card-footer text-muted date-block">
      Posted at: 20.12.2022 23:39:04
    </div>
  </div>
</template>

<style scoped>
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
</style>
