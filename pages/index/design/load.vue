<template>
    <b-input-group>
        <b-form-input type="text" placeholder="Json model config" v-model="curr_string"></b-form-input>
        <b-input-group-append>
            <b-button variant="outline-secondary" @click="load_config()">Button</b-button>
        </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
    name: 'save',
    components: {},
    props: ['renderer'],
    data() {
        return {
            curr_string: ""
        }
    },
    methods: {
        load_config() {
            let model = JSON.parse(this.curr_string)
            this.$store.dispatch("load_config", { renderer: this.renderer, model })
        }
    }
}
</script>