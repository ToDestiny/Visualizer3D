<template>
    <button @click="dump">Save</button>
</template>

<script>
export default {
    name: 'save',
    components: {},
    props: ['renderer'],
    methods: {
        dump() {
            if (this.$store.state.initialized)
                console.log(JSON.stringify(this.renderer.getConfig()))
        }
    }
}
</script>