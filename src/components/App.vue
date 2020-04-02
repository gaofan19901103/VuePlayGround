<template>
  <div id="app">
    {{ message }}
    <xxx></xxx>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                message: 'Hello Vue',
            };
        }
    };
</script>

<style>
    @import '../main.less';

    #app {
        font-size: 18px;
        font-family: 'Roboto', sans-serif;
       
    }
</style>