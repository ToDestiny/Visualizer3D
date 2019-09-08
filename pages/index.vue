<template>
    <section class="container">
        <!--h1 class="title">
            Visualizer
        </h1-->
        <div class="sidebar">
            <img src="/mythlogo.svg" class="myth-logo">
            <div class="d-flex flex-column align-items-start">
                <!-- tabs -->
                <nuxt-link class="tab-label" to="/design">Design</nuxt-link>
                <transition-group name="expand" class="d-flex flex-column align-items-start">
                    <nuxt-link v-show="route_matches('/design')" class="tab-label-sub" to="/design/template_select" key="template_select">Template</nuxt-link>
                    <nuxt-link v-show="route_matches('/design')" class="tab-label-sub text-nowrap" :to="'/design/colors/' + index"
                        v-for="(color, index) in colors" :key="'color_' + index">Color {{index + 1}}</nuxt-link>
                </transition-group>
                <nuxt-link class="tab-label" to="/logos">Logos</nuxt-link>
                <nuxt-link class="tab-label" to="/text">Text</nuxt-link>
            </div>
        </div>
        <div class="d-flex flex-row align-items-center center-container">
            <nuxt-child class="config-container" :renderer="renderer"/>
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
.myth-logo {
    margin: 0 0 20px 20px;
    max-width: 200px;
}
.container {
    max-width: 100%
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
    width: 300px;
    height: 100%;
    padding-top: 50px;
    padding-left: 30px;
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
    left: 20vw;
    top: 20vh;
    width: 80vw;
}
.config-container {
    flex-grow: 2;
    width: 550px;
    min-height: 400px;
    max-height: 700px;
    background-color: lightgrey;
}
.renderer-container {
    flex-grow: 1;
    width: 550px;
    height: 550px;
}
</style>
