<template>
    <section class="container">
        <!--h1 class="title">
            Visualizer
        </h1-->
        <div class="sidebar">
            <img src="/mythlogo_dark.svg" class="myth-logo">
            <div class="d-flex flex-column align-items-start">
                <!-- tabs -->
                <nuxt-link class="tab-label" to="/design">Design</nuxt-link>
                <transition-group name="expand" class="d-flex flex-column align-items-start">
                    <nuxt-link v-show="route_matches('/design')" class="tab-label-sub text-nowrap" to="/design/load" key="load">Load</nuxt-link>
                    <nuxt-link v-show="route_matches('/design')" class="tab-label-sub text-nowrap" to="/design/template_select" key="template_select">Template</nuxt-link>
                    <nuxt-link v-show="route_matches('/design')" class="tab-label-sub text-nowrap" :to="'/design/colors/' + index"
                        v-for="(color, index) in colors" :key="'color_' + index">Color {{index + 1}}</nuxt-link>
                </transition-group>
                <nuxt-link class="tab-label" to="/logos">Logos</nuxt-link>
                <transition-group name="expand" class="d-flex flex-column align-items-start">
                    <template v-if="model && model.parts">
                    <nuxt-link v-show="route_matches('/logos')" class="tab-label-sub text-nowrap" :to="'/logos/' + part.name"
                        v-for="(part, index) in logo_parts" :key="'part_' + index">{{part.nice_name}}
                    </nuxt-link>
                    </template>
                </transition-group>
                <nuxt-link class="tab-label" to="/text">Text</nuxt-link>
                <nuxt-link class="tab-label" to="/save">Save</nuxt-link>
            </div>
        </div>
        <div class="d-flex flex-row align-items-center justify-content-around center-container">
            <div class="config-container">
                <nuxt-child :renderer="renderer"/>
            </div>
            <div class="renderer-container" ref="rendererContainer"/>
        </div>
    </section>
</template>

<script src="./index.js"></script>

<style>
@font-face {
  font-family: Bebas Neue;
  src: url("/fonts/BebasNeue-Regular.woff2");
}
@font-face {
  font-family: Dosis;
  src: url("/fonts/dosis-v12-latin-regular.woff2");
}
.myth-logo {
    margin: 0 0 20px 20px;
    max-width: 70%;
}
.container {
    position: fixed;
    left: 0;
    top: 0;
    max-width: 100%;
    background: repeating-linear-gradient(
        -45deg,
        white,
        white 10px,
        lightgrey 1.5px,
        lightgrey 11.5px
    );
    width: 100%;
    height: 100%;
}
.hidden-radio {
    display: none;
}
a, a:hover {
    text-decoration: none;
    color: inherit;
}
.tab-label {
    font-family: Bebas Neue;
    font-size: 2em;
    line-height: 1.8em;
    padding: 0 200px 0 10px;
    max-width: 200px;
    margin: 0.10em 0;
    color: black;
    border-radius: 10px;
    box-sizing: border-box;
}
.tab-label-sub {
   font-family: Bebas Neue;
    font-size: 1.5em;
    line-height: 1.80em;
    padding: 0 170px 0 10px;
    max-width: 180px;
    margin: 0 30px;
    color: black;
    border-radius: 10px;
}
.expand-enter-active,
.expand-leave-active {
    transition: max-height 0.15s ease-in-out;
    overflow: hidden;
}
.expand-enter-active {
    max-height: 1.80em;
}
.expand-enter,
.expand-leave-active {
    max-height: 0;
}
.expand-leave {
    max-height: 1.80em;
}
.tab-label.nuxt-link-active, .tab-label-sub.nuxt-link-active  {
    color: white;
    background-color: red;
}
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 18vw;
    min-width: 260px;
    height: 100%;
    padding-top: 50px;
    padding-left: 30px;
    background-color: white;
    border-style: solid;
    border-image:
        linear-gradient(
            to right,
            rgba(0, 0, 0, 0.4),
            rgba(0, 0, 0, 0)
        ) 1 100% / 0 10px 0 0;
}
.center-container {
    position: fixed;
    left: 18vw;
    top: 0;
    width: 80vw;
    height: 100%;
}
.config-container, .renderer-container {
    background: white;
    border-radius: 10px;
    border-style: solid;
    border-width: 5px;
    border-color: lightgrey;
    box-sizing: content-box;
}
.config-container {
    min-width: 550px;
    max-width: 600px;
    min-height: 400px;
    max-height: 700px;
    overflow: scroll;
}
.renderer-container {
    width: 800;
    height: 800px;
}
.renderer-container > canvas {
    margin: 0
}
.color-radio:checked + .color-label {
    background: rgba(0, 0, 0, 0.2)
}
.color-label {
    border-radius: 10px;
    padding: 4px 2px;
    display: inline-block;
    line-height: 0;
    margin: 0;
}
.color-box {
    width: 50px;
    height: 30px;
    display: inline-block;
    line-height: 0;
    border-style: solid;
    border-color: darkgrey;
    border-width: 2px;
}
.color-picker {
    width: 8em;
}
</style>
