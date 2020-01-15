<template>
    <div class="child" ref="xxx">
        <span>{{text}}</span>
        <button @click="$emit('change-text', 0.1)">change text</button>
    </div> 
</template>

<script>
    export default {
        props:{
            text: {type: String, required: true },
        },
        data() {
            return {
 
            };
        },
        computed:{

        }
    };
</script>

<style lang="less" scoped>
   
</style>
