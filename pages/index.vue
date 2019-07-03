<template>
  <section class="container">
    <div>
      <h1 class="title">
        Test BLK
      </h1>
      <div id="images" ref="images">
        <div class="pl-lg-4 dz-container">
            <div class="mt-3 mb-3 d-flex flex-row justify-content-start" id="dz" @drop="onDrop" @dragover="onDragHandler">
                <font-awesome-icon style="font-size: 4em;" icon="plus-square" @click="clickOnTmpFile"/>
                <p v-if="image_count == 0">Drag your logos here</p>
                <div class="image_up" v-for="(img_info, uuid) in images" :key="uuid">
                    <img :src="img_info.data" alt="** Preview **" :ref="'img_' + uuid" height="65" width="65"/><br />
                    <div>
                      {{ img_info.file.name.substring(0, 13) }}
                    </div>
                    <select v-model.number="img_info.new_position" @change="moveLogo(uuid)">
                      <option v-for="(pos, index) in fixed_positions" v-bind:value="index">
                        {{ pos.name }}
                      </option>
                    </select>
                    <button @click.prevent.stop="deleteImage(uuid)">
                      <font-awesome-icon icon="window-close"/>
                    </button>
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
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusSquare, faWindowClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Renderer from '../renderer/renderer.js'

library.add(faPlusSquare)
library.add(faWindowClose)

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default {
  name: "App",
  components: {
    FontAwesomeIcon
  },
  data () {
    return {
      zoom_in: 1,
      zoom_out: 1,
      renderer: null,

      img_file: null,
      images: {},
      image_count: 0,
      fixed_positions: []
    }
  },
  methods: {
    onDrop (ev) {
        ev.preventDefault()
        this.addFiles(ev.dataTransfer.files)
    },
    onDragHandler (ev) {
        //console.log('drag', ev)
        ev.preventDefault()
    },
    newTmpFile (ev) {
        //console.log(ev)
        //console.log(this.$refs.tmpFile.files)
        this.addFiles(this.$refs.tmpFile.files)
    },
    clickOnTmpFile () {
        this.$refs.tmpFile.click()
    },
    addFiles (files) {
        const images = this.images

        let i = 0;
        for (let fl of files) {
            const uuid = uuidv4()

            var reader = new FileReader();
            reader.onload = (e) => {
                this.images[uuid] = {
                  file: fl,
                  data: e.target.result,
                  position: 0,
                  new_position: 0
                }
                this.renderer.addFixedLogo(
                  this.images[uuid].data,
                  uuid,
                  this.images[uuid].position
                )
                this.image_count = Object.keys(this.images).length
            };
            reader.readAsDataURL(fl);
        }
        this.$refs.tmpFile.value = ""
    },
    moveLogo (uuid) {
      this.images[uuid].position = this.images[uuid].new_position
      this.renderer.addFixedLogo(this.images[uuid].data,
        uuid,
        this.images[uuid].position)
    },

    startUpload() {

    },

    deleteImage(uuid) {
      console.log('delete ', uuid)
      // here call your function to delete in threejs
      // here
      // uuid is uuid lol
      // data of the image is : this.imagesList[uuid] (base64 encoded URL)
      this.renderer.removeLogo(uuid)
      delete this.images[uuid]
      this.image_count = Object.keys(this.images).length
    }
  },
  mounted () {
    if (!this.renderer)
      this.renderer = new Renderer(this.$refs.rendererContainer)
    else
      console.log("keeping renderer")
    // TO UPDATE EVERYTIME MODEL CHANGES
    this.fixed_positions = this.renderer.getFixedPositions()
    console.log(this.fixed_positions)
  },
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
