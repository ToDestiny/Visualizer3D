<template>
    <div class="px-3 py-3 d-flex flex-row">
    <div class="d-flex flex-column justify-content-start">
        <div class="my-1 d-flex flex-row justify-content-start" v-for="(color_column, col_index) in color_table" :key="col_index">
            <div class="mx-1" v-for="(color, row_index) in color_column" :key="row_index">
                <input class="hidden-radio color-radio" type="radio" :id="'color_' + col_index + '_' + row_index"
                    :value="color" v-model="color_selection">
                <label :for="'color_' + col_index + '_' + row_index" class="px-1 py-2">
                    <div class="color-box" :style="{ 'background-color': color }"/>
                </label>
            </div>
        </div>
    </div>
    <div class="d-block">
        <input type="text" class="color-picker my-3 align-self-start" v-model="custom_color"/>
        <div class="my-2 mx-1">
            <input class="hidden-radio color-radio" type="radio" id="custom_color_btn" :value="custom_color" v-model="color_selection">
            <label for="custom_color_btn" class="px-1 py-2">
                <div class="color-box" :style="{ 'background-color': custom_color }"/>
            </label>
        </div>
    </div>
    </div>
</template>

<script src="./index.js"></script>

<style>
.color-radio:checked + label {
    background: rgba(0, 0, 0, 0.2)
}
.color-box {
    width: 60px;
    height: 30px;
}
.color-picker {
    width: 8em;
}
</style>
