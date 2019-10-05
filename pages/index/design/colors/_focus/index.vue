<template>
    <div class="px-3 py-3 d-flex flex-row">
    <div class="d-flex flex-column justify-content-center">
        <div class="my-1 d-flex flex-row justify-content-start align-content-center" v-for="(color_column, col_index) in color_table" :key="col_index">
            <div class="mx-1" v-for="(color, row_index) in color_column" :key="row_index">
                <input class="hidden-radio color-radio" type="radio" :id="'color_' + col_index + '_' + row_index"
                    :value="color" v-model="color_selection">
                <label class="color-label" :for="'color_' + col_index + '_' + row_index" >
                    <div class="color-box" :style="{ 'background-color': color }"/>
                </label>
            </div>
        </div>
    </div>
    </div>
</template>

<script src="./index.js"></script>

<style>
</style>
