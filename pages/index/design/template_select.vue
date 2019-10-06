<template>
    <div class="px-2 py-2 d-flex flex-row justify-content-start flex-wrap" v-if="templates">
        <div class="templ-container mx-0" v-for="(templ_info, index) in templates" :key="index">
            <input class="hidden-radio template-radio" type="radio" :id="templ_info.name" :value="index" v-model="template_selection">
            <label class="templ-thumb-container" :for="templ_info.name">
                <img class="templ-thumb mx-0" :src="templ_info.thumb_url" alt="Template Preview" :ref="templ_info.name">
                <div class="templ-name mx-0">{{ templ_info.name.substring(0, 13) }}</div>
            </label>
        </div>
    </div>
</template>

<script src="./template_select.js"></script>

<style>
.templ-container:hover {
    cursor: pointer;
}
.templ-container {
    display: flex;
    flex-direction: column;
    align-content: center;
    text-align: center;
    flex-basis: 33.333%;
}
.templ-thumb {
    width: 100px;
    padding: 5px 16px;
    box-sizing: content-box;
    margin: 0;
}
.templ-thumb-container {
    border-radius: 15px;
}
.template-radio:checked + .templ-thumb-container {
    background: rgba(0, 0, 0, 0.2)
}
.templ-name {
    font-family: Dosis;
    font-weight: bold;
    font-size: 1.2em;
}
</style>
