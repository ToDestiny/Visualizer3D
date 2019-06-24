<template>
  <section class="container">
    <div>
      <h1 class="title">
        Test BLK
      </h1>
      <div ref="rendererContainer">
      </div>
      <span>{{ isDragging ? 'Dragging': 'Not dragging' }}</span>
    </div>
  </section>
</template>

<script>
import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader'
// import ARender from '../render/file.js'

export default {
  data () {
    return {
      renderer: null,
      scene: null,
      camera: null,
      isDragging: false,
      previousMousePosition: null,
    }
  },
  methods: {
    renderFrame () {
      requestAnimationFrame(this.renderFrame)
      this.model.rotation.y += 0.01
      this.renderer.render(this.scene, this.camera)
    },
    draggingModeOn () {
      this.isDragging = true
    },
    draggingModeOff () {
      this.isDragging = false
    },
    mouseMove (e) {
      function toRadians(angle) {
	      return angle * (Math.PI / 180.0);
      }
      let deltaMove
      if (this.previousMousePosition) {
        deltaMove =  {
          x: e.offsetX - this.previousMousePosition.x,
          y: e.offsetY - this.previousMousePosition.y
        }
      } else
        deltaMove = {x: 0.0, y: 0.0}
      if (this.isDragging) {
        const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            toRadians(deltaMove.y),
            toRadians(deltaMove.x),
            0,
            'XYZ'
          )
        )
        this.model.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.model.quaternion)
        this.previousMousePosition = {
          x: e.offsetX,
          y: e.offsetY,
        }
        this.renderer.render(this.scene, this.camera)
      } else
        this.previousMousePosition = null
    },
    initThree (model) {
      const width = 600 // window.innerWidth
      const height = 400 // window.innerHeight
      const viewAngle = 75
      const nearClipping = 0.1
      const farClipping = 9999
      const camera = new THREE.PerspectiveCamera(viewAngle, width/height, nearClipping, farClipping)
      camera.position.z = 3
      camera.lookAt(new THREE.Vector3(0, 0, 0))
      const renderer = new THREE.WebGLRenderer({antialias: true})
      renderer.setClearColor(0xFFFFFF)
      const scene = new THREE.Scene()
      scene.add(model)
      const lightIntensity = 0.5 // increase if too dark
      const light = new THREE.PointLight(0xFFFFFF, lightIntensity, 100, 0)
      light.position.x = 1
      light.position.y = 1
      light.position.z = 3
      scene.add(light)
      const ambientLight = new THREE.AmbientLight(0x888888)
      scene.add(ambientLight)
      renderer.setSize(width, height)
      this.$refs.rendererContainer.appendChild(renderer.domElement)
      renderer.domElement.onmousedown = this.draggingModeOn
      renderer.domElement.onmouseup = this.draggingModeOff
      renderer.domElement.onmousemove = this.mouseMove
      this.renderer = renderer
      this.scene = scene
      this.camera = camera
      this.model = model
      renderer.render(scene, camera)
      this.drawTextureTest(this.model)
      // this.renderFrame()
    },
    drawTextureTest (object) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 64
      canvas.height = 64
      ctx.fillStyle = '#00ff00'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = '#ff00ff'
      ctx.strokeRect(0, 0, canvas.width / 3, canvas.height / 3)
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.map = texture;
          child.material.needsUpdate = true;
        }
      });
    }
  },
  mounted () {
    const loader = new GLTFLoader()
    console.log('Loading scene')
    loader.load('/t-shirt2/scene.gltf',
      (gltf) => {
        console.log('Scene loaded')
        const model = gltf.scene
        const factor = 0.05
        model.scale.x = factor
        model.scale.y = factor
        model.scale.z = factor
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.position.y = -25
          }
        });
        this.initThree(gltf.scene)
      },
      (xhr) => {},
      (error) => {
        console.error('Error while loading scene file', error)
      }
    )
  }
}
</script>
