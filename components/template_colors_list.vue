<template>
    <div class="config-panel" :class="[active ? '' : 'd-none']">
    <div class="mt-3 mb-3 d-flex flex-row justify-content-start flex-wrap" v-if="colors">
        <div class="block-inline" v-for="(color, index) in colors" :key="index">
            <button class="color-btn" type="radio" :id="'color_focus_' + index" :value="index" @click="setActive(index)"/>
            <label :for="'color_focus_' + index" class="color-container inline-block">
                <div v-bind:style="{ 'background-color': color }" class="color-box"/>
                <div>{{ "Template Color " + index }}</div>
            </label>
        </div>
    </div>
    </div>
</template>

<script src="./template_colors_list.js"></script>

<style>
</style>
