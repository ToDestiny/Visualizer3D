<template>
    <div class="px-2 py-2 d-flex flex-row justify-content-start flex-wrap" id="dz" @drop="onDrop" @dragover="onDragHandler">
        <div class="d-flex flex-column align-items-center">
            <font-awesome-icon style="font-size: 4em;" icon="plus-square" @click="clickOnTmpFile"/>
            <p>Drag your logos here</p>
            <input @change="newTmpFile" type="file" ref="tmpFile" style="display: none;" /> 
        </div>
        <div class="inline-block" v-for="(img_info, k) in logos" :key="k">
            <div class="logo_container">
                <img class="logo_thumb" :src="img_info.data" alt="Logo Preview" :ref="'img_' + k"/>
                <button class="delete-button" @click.prevent.stop="deleteImage(img_info)">
                    <font-awesome-icon icon="window-close"/>
                </button>
            </div>
            <select :value="img_info.position" @change="moveLogo(img_info, $event.target.value)">
                <option v-for="(pos, index) in positions" :key="index" :value="pos.index">
                    {{ pos.name }}
                </option>
            </select>
        </div>
        <input @change="newTmpFile" type="file" ref="tmpFile" style="display: none;" />
    </div>
</template>

<script src="./index.js"></script>

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
