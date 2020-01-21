<template>
<div class="tooltip-box down">
    <span v-if="!component">{{text}}</span>
    <div class="tooltip-content" v-if="component">
        <component :is="component" v-bind="props"></component>
    </div> 
</div>

</template>

<script>
    import child from './child.vue';
    
    export default {
        components:{
            'child': child
        },
        mounted: function(){
            
        },
        props:{
            text: {type: String, required: false },
            component: {type: String, required: false },
            props: {type: Object, required: false}
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
