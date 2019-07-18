<template>
    <section class="container">
        <h1 class="title">
            Test BLK
        </h1>
        <div class="d-flex flex-row align-items-start">
            <div ref="rendererContainer"/>
            <b-tabs content-class="tab-content" class="flex-grow-1">
                <b-tab title="Templates"><template-select-component v-bind:renderer="renderer"/></b-tab>
                <b-tab title="Logos" active><image-load-component v-bind:renderer="renderer"/></b-tab>
            </b-tabs>
        </div>
    </section>
</template>

<script src="./index.js"></script>

<style>
.container {
    max-width: 100%
}
.tab-content {
    background-color: rgb(219, 219, 219);
    border-radius: 20px 20px 20px 20px;
    padding-bottom: 25px;
    padding-top: 25px;
    height: 100%px;
}
</style>
