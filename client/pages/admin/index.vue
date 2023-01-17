<template>
  <div class="card mb-3 images-block">
    <div class="card-body">
      <h5 class="card-title">
        Upload image
      </h5>

      <div class="input-row">
        <div>
          <div class="form-group">
            <label class="form-label mt-4">Image</label>
            <input class="form-control" type="file">
          </div>
        </div>
        <div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" checked="">
            <label class="form-check-label">Active</label>
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Title</label>
            <input type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Header</label>
            <input type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">URL</label>
            <input type="text" class="form-control">
          </div>
        </div>
      </div>

      <div class="input-desc-row">
        <div class="two-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Description</label>
            <textarea class="form-control" rows="2" />
          </div>
        </div>
        <div class="two-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Content</label>
            <textarea class="form-control" rows="2" />
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Name (big)</label>
            <input type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Alt (big)</label>
            <input type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Title (big)</label>
            <input type="text" class="form-control">
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Name (small)</label>
            <input type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Alt (small)</label>
            <input type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Title (small)</label>
            <input type="text" class="form-control">
          </div>
        </div>
      </div>

      <div class="input-row">
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Name (tiny)</label>
            <input type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Alt (tiny)</label>
            <input type="text" class="form-control">
          </div>
        </div>
        <div class="three-field-item">
          <div class="form-group">
            <label class="form-label mt-4">Title (tiny)</label>
            <input type="text" class="form-control">
          </div>
        </div>
      </div>

      <div>
        <div class="desc-item">
          <div class="form-group">
            <label class="form-label mt-4">Tags</label>
            <textarea class="form-control" rows="1" />
          </div>
        </div>
      </div>

      <div class="publish-button">
        <div class="d-grid gap-2">
          <button class="btn btn-lg btn-primary" type="button">
            Publish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  head: {
    title: `Admin - ${process.env.appName}`
  }
}
</script>

<style scoped>
  .images-block {
    width: fit-content;
    min-width: 90%;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 30px !important;
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
</style>
