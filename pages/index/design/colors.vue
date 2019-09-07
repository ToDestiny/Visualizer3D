<template>
    <nuxt-child :renderer="renderer"/>
</template>

<script>
export default {
    name: "colors",
    props: ["renderer"]
}
</script>