<template>
  <section class="container">
    <div>
      <h1 class="title">
        Test BLK
      </h1>
      <div id="controllers" ref="controllers">
        <input v-model.number="zoom_in" type="number"/> <button @click="zoomIn">Zoom IN</button><br />
        <input v-model.number="zoom_out" type="number"/><button @click="zoomOut">zoom OUT</button>
      </div>
      <div ref="rendererContainer">
      </div>
    </div>
  </section>
</template>

<script>
// import ARender from '../render/file.js'

export default {
  data () {
    return {
      zoom_in: 1,
      zoom_out: 1,
    }
  },
  methods: {
    zoomIn() {
      
    },
    zoomOut() {

    }
  },
  mounted () {
    // ARender.init(this.$refs.rendererContainer)
  }
}
</script>
