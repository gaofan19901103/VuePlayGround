<template>
    <div class="child" ref="xxx">
        <span>{{text1}}</span>
        <p>{{xxx}}</p>
        <p>{{text}}</p>
        <button @click="$emit('change-text', 0.1)">change text</button>
    </div> 
</template>

<script>
    export default {
        props:{
            text: {type: String, required: false },
        },
        data() {
            return {
                text1: 'ttt',
                xxx: '123'
            };
        },
        computed:{

        }
    };
</script>

<style lang="less" scoped>
   
</style>
