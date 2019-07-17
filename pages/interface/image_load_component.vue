<template>
    <div class="mt-3 mb-3 d-flex flex-row justify-content-start" id="dz" @drop="onDrop" @dragover="onDragHandler">
        <font-awesome-icon style="font-size: 4em;" icon="plus-square" @click="clickOnTmpFile"/>
        <p v-if="image_count == 0">Drag your logos here</p>
        <div class="image_up" v-for="(img_info, uuid) in images" :key="uuid">
            <img :src="img_info.data" alt="** Preview **" :ref="'img_' + uuid" height="65" width="65"/>
            <br />
            <div>
                {{ img_info.file.name.substring(0, 13) }}
            </div>
            <select v-model.number="img_info.new_position" @change="moveLogo(uuid)">
                <option v-for="(pos, index) in fixed_positions" v-bind:value="index">
                    {{ pos.name }}
                </option>
            </select>
            <button @click.prevent.stop="deleteImage(uuid)">
                <font-awesome-icon icon="window-close"/>
            </button>
        </div>
        <input @change="newTmpFile" type="file" ref="tmpFile" style="display: none;" />
    </div>
</template>

<script src="./image_load_component.js"></script>

<style>
</style>
