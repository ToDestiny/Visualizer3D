<template>
    <div class="px-3 py-3 d-flex flex-row justify-content-start flex-wrap" v-if="templates">
        <div class="inline-block" v-for="(templ_info, index) in templates" :key="index">
            <input class="hidden-radio template-radio" type="radio" :id="templ_info.name" :value="index" v-model="template_selection">
            <label :for="templ_info.name" class="templ-container">
                <img class="templ-thumb" :src="templ_info.thumb_url" alt="Template Preview" :ref="templ_info.name">
                <div>{{ templ_info.name.substring(0, 13) }}</div>
            </label>
        </div>
    </div>
</template>

<script src="./template_select.js"></script>

<style>
.templ-container:hover {
    cursor: pointer;
}
.templ-thumb {
    max-width: 150px;
    height: 70px;
    margin: 5px;
}
.template-radio:checked + label {
    background: rgba(0, 0, 0, 0.2)
}
</style>
