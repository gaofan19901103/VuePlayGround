<template>
    <div class="parent">
        <span>i'M THE Parent</span>
        <xxx ref="myChild" :text="myString" v-on:change-text="changeText"></xxx>
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
