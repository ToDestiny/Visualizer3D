<template>
    <nuxt-child :renderer="renderer"/>
</template>

<script>
export default {
    name: "design",
    props: ["renderer"]
}
</script>