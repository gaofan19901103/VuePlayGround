<template>
  <div class="container">
      <div class="message">{{message}}</div>
      <div class="circle"><span>8</span></div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                message: 'cc',
            };
        },
    };
</script>

<style scoped>
    .container {
        display: flex;
        height: 100px;
        width: 200px;
        background-color: antiquewhite;
    }

    .message{
        height: 100%;
        width: 50%;
    }
    .circle{
        height: 100%;
        width: 50%;
        border-radius: 50%;
        background-color: blueviolet;
    }
</style>

