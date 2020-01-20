<template>
    <div class="tooltip-content">
        <component :is="component" v-bind="properties"></component>
    </div> 
</template>

<script>
    import child from './child.vue';
    
    export default {
        components:{
            'xxx': child
        },
        mounted: function(){
            
        },
        props:{
            component: {type: String, required: false },
            properties: {type: Object, required: false}
        },
        data() {
            return {
                
            };
        },
        computed:{
            
        },
        methods:{
            
        }
    };
</script>

<style lang="less" scoped>
   
</style>
