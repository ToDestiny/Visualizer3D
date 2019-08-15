<template>
    <div class="config-panel" :class="[active ? '' : 'd-none']">
    <div class="mt-3 mb-3 d-flex flex-row justify-content-start flex-wrap">
        <div class="inline-block" v-for="(color_option, index) in color_table" :key="index">
            <input class="hidden-radio color-radio" type="radio" :id="'color_' + index" :value="color_option" v-model="color_selection">
            <label :for="'color_' + index" class="color-box">
                <div v-bind:style="{ 'background-color': color_option }" class="color-box"/>
            </label>
        </div>
    </div>
    </div>
</template>

<script src="./select_color.js"></script>

<style>
.color-radio:checked + label {
    background: rgba(0, 0, 0, 0.2)
}
</style>
