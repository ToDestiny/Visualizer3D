<template>
    <nuxt-child :renderer="renderer"/>
</template>

<script>
export default {
    name: "logos",
    props: ["renderer"]
}
</script>