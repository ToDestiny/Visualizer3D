<template>
    <div class="mt-3 mb-3 d-flex flex-row justify-content-start flex-wrap">
        <div class="inline-block" v-for="(thumb_info, index) in templates" :key="index">
            <input class="hidden-radio" type="radio" :id="thumb_info.name" :value="thumb_info" v-model="selection">
            <label :for="thumb_info.name" class="templ-container">
                <img class="templ-thumb" :src="thumb_info.url" alt="Template Preview" :ref="thumb_info.name">
                <div>{{ thumb_info.name.substring(0, 13) }}</div>
            </label>
        </div>
        <div>
            {{ selection.name }}
        </div>
    </div>
</template>

<script src="./template_select_component.js"></script>

<style>
.templ-container:hover {
    cursor: pointer;
}
.templ-thumb {
    max-width: 150px;
    height: 70px;
    margin: 5px;
}
.hidden-radio {
    display: none;
}
.hidden-radio:checked + label {
    background: rgba(0, 0, 0, 0.2)
}
</style>
