<template>
    <div class="config-panel" :class="[active ? '' : 'd-none']">
    <div class="mt-3 mb-3 d-flex flex-row justify-content-start flex-wrap" v-if="colors">
        <div class="block" v-for="(color, index) in colors" :key="index">
            <button class="color-btn" type="radio" :id="'color_' + index" :value="index" @click="setActive(index)"/>
            <label :for="'color_' + index" class="color-container inline-block">
                <div class="color-box" :style="{ backgroundColor: color }"/>
                <div>{{ "Template Color " + index }}</div>
            </label>
        </div>
    </div>
    </div>
</template>

<script src="./template_colors_list.js"></script>

<style>
.color-container:hover {
    cursor: pointer;
}
.color-box {
    width: 10em;
    height: 2em;
}
.color-btn {
    display: none;
}
</style>
