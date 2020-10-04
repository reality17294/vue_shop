<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import router from "./router";

    import "./assets/css/global.css";

    export default {
        name: "",
        components: {},
        created() {
            console.log(this);
        }
    };
</script>

<style>
</style>