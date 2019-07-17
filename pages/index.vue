<template>
    <section class="container">
        <div>
            <h1 class="title">
                Test BLK
            </h1>
            <div id="images" ref="images">
                <div class="pl-lg-4 dz-container">
                    <image-load-component v-bind:renderer="renderer"/>
                </div>
                <hr class="my-4" />
            </div>
            <div ref="rendererContainer">
            </div>
        </div>
    </section>
</template>

<script src="./index.js"></script>

<style>
#dz {
    background-color: rgb(219, 219, 219);
    border-radius: 20px 20px 20px 20px;
    padding-bottom: 25px;
    padding-top: 25px;
    height: 100%px;
}
.image_up {
    height: 128px;
    width: 128px;
}
</style>
