<template>
        <div class="config-panel" :class="[active ? '' : 'd-none']">
        <textarea v-model="text_name" placeholder="Player's name"/>
        <textarea v-model="text_number" placeholder="Player's number"/>
        </div>
</template>

<script src="./general_config.js"></script>

<style>
</style>
