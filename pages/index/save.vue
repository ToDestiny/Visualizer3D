<template>
    <div class="px-2 py-2 d-flex flex-row justify-content-around align-items-center" style="height: 400px">
        <div @click="onSaveFile" class="d-flex flex-column align-items-center">
            <font-awesome-icon style="font-size: 4em;" icon="save"/>
            <p>Download</p>
        </div>
        <div @click="onUploadFile" class="d-flex flex-column align-items-center">
            <font-awesome-icon style="font-size: 4em;" icon="save"/>
            <p>Save to dashboard</p>
        </div>
    </div>
</template>

<script src="./save.js"/>