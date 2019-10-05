<template>
    <div class="px-3 py-3 d-flex flex-column justify-content-start">
        <div class="my-3 d-inline">
            Player's Name: 
            <input type="text" class="name-input" placeholder="Player's name" v-model="name_text"/>
            <div class="my-1 d-flex flex-row justify-content-start align-content-center" v-for="(color_column, col_index) in color_table" :key="col_index">
            <div class="mx-1" v-for="(color, row_index) in color_column" :key="row_index">
                <input class="hidden-radio color-radio" type="radio" :id="'color_' + col_index + '_' + row_index + '_name'"
                    :value="color" v-model="name_color">
                <label class="color-label" :for="'color_' + col_index + '_' + row_index + '_name'" >
                    <div class="color-box" :style="{ 'background-color': color }"/>
                </label>
            </div>
        </div>
        </div>
        <div class="my-3 d-inline">
            Player's Number: 
            <input type="text" class="name-input" placeholder="Player's number" v-model="number_text"/>
            <div class="my-1 d-flex flex-row justify-content-start align-content-center" v-for="(color_column, col_index) in color_table" :key="col_index">
            <div class="mx-1" v-for="(color, row_index) in color_column" :key="row_index">
                <input class="hidden-radio color-radio" type="radio" :id="'color_' + col_index + '_' + row_index + '_number'"
                    :value="color" v-model="number_color">
                <label class="color-label" :for="'color_' + col_index + '_' + row_index + '_number'" >
                    <div class="color-box" :style="{ 'background-color': color }"/>
                </label>
            </div>
            </div>
        </div>
    </div>
</template>

<script src="./text.js"></script>

<style>
.name-input {
    width: 20em;
}
</style>
