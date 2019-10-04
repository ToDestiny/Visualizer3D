<template>
    <div class="px-3 py-3 d-flex flex-column justify-content-start">
        <div class="my-3 d-inline">
            Player's Name: 
            <input type="text" class="name-input" placeholder="Player's name" v-model="name_text"/>
            <input type="text" class="color-picker my-3 align-self-start" v-model="name_color"/>
        </div>
        <div class="my-3 d-inline">
            Player's Number: 
            <input type="text" class="name-input" placeholder="Player's number" v-model="number_text"/>
            <input type="text" class="color-picker my-3 align-self-start" v-model="number_color"/>
        </div>
    </div>
</template>

<script src="./text.js"></script>

<style>
.name-input {
    width: 20em;
}
</style>
