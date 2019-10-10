<template>
  <div id="app">
    {{ message }}
    <xxx></xxx>
  </div>
</template>

<script>
    import cc from './container.vue';

    export default {
        data() {
            return {
                message: 'Hello Vue',
            };
        },
        components: {
            'xxx': cc
        }
    };
</script>

<style>
    @import './main.less';

    #app {
        font-size: 18px;
        font-family: 'Roboto', sans-serif;
       
    }
</style>