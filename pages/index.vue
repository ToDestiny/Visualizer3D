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
                    <input class="tab-radio" type="radio" id="0" value="templates" v-model="active_panel">
                    <label :for="0" class="tab-container">Templates</label>
                    <input class="tab-radio" type="radio" id="1" value="logs" v-model="active_panel">
                    <label :for="1" class="tab-container">Logs</label>
                </div>
                <div class="config-panel" :class="[active_panel == 'templates' ? '' : 'd-none']">
                    <template-select :renderer="renderer"/>
                </div>
                <div class="config-panel" :class="[active_panel == 'logos' ? '' : 'd-none']">
                    <!-- image-load class="config-panel" :class="[active_panel == 'logos' ? 'visible' : 'hidden']"/-->
                </div>
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
.config-panel {
    width: 30em;
    height: 40em;
}
.tab-container {

}
.tab-container:hover {
    cursor: pointer;
}
.tab-radio {
    display: none;
}
.tab-radio:checked + label {
    background: rgba(0, 0, 0, 0.2)
}
</style>
