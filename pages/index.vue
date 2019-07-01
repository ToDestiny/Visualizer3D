<template>
  <section class="container">
    <div>
      <h1 class="title">
        Test BLK
      </h1>
      <div id="controllers" ref="controllers">
        <input v-model.number="zoom_in" type="number"/> <button @click="zoomIn">Zoom IN</button><br />
        <input v-model.number="zoom_out" type="number"/><button @click="zoomOut">zoom OUT</button>
        <button @click="toggleDragMode">Toggle Drag Mode</button>
      </div>
      <div id="images" ref="images">
        <div class="pl-lg-4 dz-container">
            <div class="mt-3 mb-3 d-flex flex-row justify-content-around" id="dz" @drop="onDrop" @dragover="onDragHandler" @click="clickOnTmpFile">
                <p v-if="images.length == 0">Click in this box for select images OR drop your files</p>
                <div class="image_up" v-for="(img, ky) in imagesList" :key="ky">
                    <img :src="img.data" alt="** Preview **" :ref="'img_' + ky" height="128" width="128"/><br />
                    {{ ky.substring(0, 13) }}
                    <button @click.prevent.stop="deleteImage(ky)">delete</button>
                </div>
            </div>
            <input @change="newTmpFile" type="file" ref="tmpFile" style="display: none;" />

        </div>
        <hr class="my-4" />
      </div>
      <div ref="rendererContainer">
      </div>
    </div>
  </section>
</template>

<script>
import Renderer from '../renderer/renderer.js'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default {
  data () {
    return {
      zoom_in: 1,
      zoom_out: 1,
      renderer: null,

      img_file: null,
      images: [],
      imagesData: [],
      filesCount: 0,
      imagesList: {},
    }
  },
  methods: {
    zoomIn() {
      console.log(this.renderer)
      //this.renderer.zoomIn(this.zoom_in)
    },
    zoomOut() {
      console.log(this.renderer)
      //this.renderer.zoomOut(this.zoom_out)
    },
    toggleDragMode() {
      this.renderer.toggleMouseMode()
    },

    onDrop (ev) {
        ev.preventDefault()
        this.addFiles(ev.dataTransfer.files)
    },
    onDragHandler (ev) {
        console.log('drag', ev)
        ev.preventDefault()
    },
    newTmpFile (ev) {
        console.log(ev)
        console.log(this.$refs.tmpFile.files)
        this.addFiles(this.$refs.tmpFile.files)
    },
    clickOnTmpFile () {
        this.$refs.tmpFile.click()
    },
    addFiles (files) {
        const images = this.images
        let count = this.filesCount

        const self = this

        let i = 0;
        for (let fl of files) {
            const uuid = uuidv4()
            fl.i = i
            fl.count = count

            var reader = new FileReader();
            reader.onload = (e) => {
                this.imagesData[fl.count] = e.target.result
                this.renderer.addLogo(e.target.result)
                this.images.push(fl)
                this.imagesList[uuid] = { file: fl, data: e.target.result }
            };
            reader.readAsDataURL(fl);

            i++
            count++
        }

        console.log(this.imagesList)

        this.filesCount = count
    },

    startUpload() {

    },

    deleteImage(uuid) {
      console.log('delete ', uuid)
      // here call your function to delete in threejs
      // here
      // uuid is uuid lol
      // data of the image is : this.imagesList[uuid] (base64 encoded URL)
      const imagesList = { ...this.imagesList }
      delete imagesList[uuid]
      this.imagesList = imagesList
    }
  },
  mounted () {
    this.renderer = new Renderer(this.$refs.rendererContainer)
    console.log(uuidv4())
  }
}
</script>

<style>
#dz {
    background-color: rgb(219, 219, 219);
    border-radius: 20px 20px 20px 20px;
    padding-bottom: 25px;
    padding-top: 25px;
    height: 100%px;
}
.image_up {
    height: 128px;
    width: 128px;
}
</style>
