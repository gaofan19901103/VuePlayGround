<template>
    <div class="parent">
        <span @click="changeText">i'M THE Parent</span>
        <slot></slot>
        <component :is="com" v-bind="xx"></component>
    </div> 
</template>

<script>
    import child from './child.vue';

    export default {
        components:{
            'xxx': child
        },
        mounted: function(){
            let x = 0;

            // const AsyncComponent = () => ({
            //     component: import('./child.vue')
            // });

            let y = 0;
        },
        props:{

        },
        data() {
            return {
                myString: 'test initial',
                com: 'xxx',
                xx: {text: '1234567'}
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
