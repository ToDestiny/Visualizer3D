<template>
    <div class="config-panel">
    <div class="mt-3 mb-3 d-flex flex-row justify-content-start flex-wrap" id="dz" @drop="onDrop" @dragover="onDragHandler">
        <font-awesome-icon style="font-size: 4em;" icon="plus-square" @click="clickOnTmpFile"/>
        <p v-if="logos_count == 0">Drag your logos here</p>
        <div class="inline-block" v-for="(img_info, k) in logos" :key="k">
            <div class="logo_container">
                <img class="logo_thumb" :src="img_info.data" alt="Logo Preview" :ref="'img_' + k"/>
                <button class="delete-button" @click.prevent.stop="deleteImage(img_info)">
                    <font-awesome-icon icon="window-close"/>
                </button>
            </div>
            <div>
                {{ img_info.file.name.substring(0, 13) }}
            </div>
            <select :value="img_info.position" @change="moveLogo(img_info, $event.target.value)">
                <option v-for="(pos, index) in positions" :key="index" :value="index">
                    {{ pos.name }}
                </option>
            </select>
        </div>
        <input @change="newTmpFile" type="file" ref="tmpFile" style="display: none;" />
    </div>
    </div>
</template>

<script src="./logos.js"></script>

<style>
.logo_container {
    position: relative;
    max-width: 150px;
    height: 70px;
}
.logo_thumb {
    max-width:100%;
    max-height:100%;
    margin: 0;
}
.delete-button {
    border-style: solid;
    line-height: 1em;
    padding: 0;
    margin: 0;
}
.logo_container .delete-button {
    position: absolute;
    top: 0%;
    right: 0%;
}
.delete-button * {
    margin: 0;  
    font-size: 1em;
}
</style>
