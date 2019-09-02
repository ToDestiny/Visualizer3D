<template>
    <section class="container">
        <h1 class="title">
            Visualizer
        </h1>
        <div class="d-flex flex-row align-items-start">
            <div ref="rendererContainer"/>
            <div class="d-block">
                <div class="d-flex flex-row align-items-start">
                    <!-- tabs -->
                    <input class="tab-radio" type="radio" id="tab_0" value="templates" v-model="active_panel">
                    <label for="tab_0" class="tab-container">Templates</label>
                    <input class="tab-radio" type="radio" id="tab_1" value="logos" v-model="active_panel">
                    <label for="tab_1" class="tab-container">Logos</label>
                    <input class="tab-radio" type="radio" id="tab_2" value="colors" v-model="active_panel">
                    <label for="tab_2" class="tab-container">Colors</label>
                    <input class="tab-radio" type="radio" id="tab_3" value="config" v-model="active_panel">
                    <label for="tab_3" class="tab-container">Config</label>
                </div>
                <template-select :renderer="renderer" :active="active_panel == 'templates'"/>
                <image-load :renderer="renderer" :active="active_panel == 'logos'"/>
                <template-colors-list :renderer="renderer" :active="active_panel == 'colors'"/>
                <select-color :renderer="renderer" :active="active_panel == 'select_color'"/>
                <general-config :renderer="renderer" :active="active_panel == 'config'"/>
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
.color-container:hover {
    cursor: pointer;
}
.color-box {
    width: 5em;
    height: 2em;
}
.color-btn {
    display: none;
}
.hidden-radio {
    display: none;
}
</style>
