<template>
    <div class="parent">
        <span @click="changeText">i'M THE Parent</span>
        <slot></slot>
    </div> 
</template>

<script>
    import child from './child.vue';

    export default {
        components:{
            'xxx': child
        },
        props:{

        },
        data() {
            return {
                myString: 'test initial'
            };
        },
        computed:{
            
        },
        methods:{
            changeText: function(){
                this.myString = 'test changed';
            }
        }
    };
</script>

<style lang="less" scoped>
   
</style>
