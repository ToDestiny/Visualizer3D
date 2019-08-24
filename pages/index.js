
import ImageLoad from '../components/image_load.vue'
import TemplateSelect from '../components/template_select.vue'
import TemplateColorsList from '../components/template_colors_list.vue'
import SelectColor from '../components/select_color.vue'
import GeneralConfig from "../components/general_config.vue"
import Renderer from '../components/renderer/renderer.js'
import { mapState } from 'vuex';

export default {
    name: 'App',
    components: {
        ImageLoad,
        TemplateSelect,
        TemplateColorsList,
        SelectColor,
        GeneralConfig
    },
    data () {
        return {
            renderer: null,
        }
    },
    methods: {
        log(obj) {
            console.log(JSON.stringify(obj))
        }
    },
    computed: {
        active_panel: {
            get() { return this.$store.state.active_panel },
            set(value) {
                this.$store.commit('select_panel', value)
            }
        }
    },
    mounted () {
        this.renderer = new Renderer(this.$refs.rendererContainer)
        this.$store.dispatch('initialize', { renderer: this.renderer, model_url: 't-shirt/t-shirt.json' })
  },
}