<template>
    <div class="px-3 py-3 d-flex flex-column justify-content-start">
        <div class="my-3 d-inline">
            Player's Name: 
            <input type="text" class="name-input" placeholder="Player's name" v-model="text_name"/>
        </div>
        <div class="my-3 d-inline">
            Player's Number: 
            <input type="text" class="name-input" placeholder="Player's number" v-model="text_number"/>
        </div>
    </div>
</template>

<script src="./text.js"></script>

<style>
.name-input {
    width: 20em;
}
</style>
