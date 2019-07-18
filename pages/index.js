
import ImageLoadComponent from './interface/image_load_component.vue'
import TemplateSelectComponent from './interface/template_select_component.vue'
import Renderer from '../renderer/renderer.js'

export default {
  name: "App",
  components: {
    ImageLoadComponent,
    TemplateSelectComponent
  },
  data () {
    return {
      renderer: null,
    }
  },
  methods: {},
  mounted () {
    if (!this.renderer)
      this.renderer = new Renderer(this.$refs.rendererContainer, "t-shirt/t-shirt.json")
    else
      console.log("keeping renderer")
  },
}