<template>
    <section class="container">
        <h1 class="title">
            Test BLK
        </h1>
        <div class="d-flex flex-row align-items-start">
            <div ref="rendererContainer"/>
            <div class="d-block">
                <div class="d-flex flex-row align-items-start">
                    <!-- tabs -->
                    <div class="tab-button">Templates</div>
                    <div class="tab-button">Logos</div>
                </div>
                <template-select class="config-panel" :class="[active_panel == 'templates' ? 'visible' : 'hidden']"/>
                <!-- image-load class="config-panel" :class="[active_panel == 'logos' ? 'visible' : 'hidden']"/-->
            </div>
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
