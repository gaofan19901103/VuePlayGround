<template>
    <div :class="classes">
        <span v-if="!component">{{text}}</span>
        <component v-if="component" :is="component" v-bind="props" ></component>
    </div>
</template>

<script>
    //list all tooltip content components here...
    import messageList from './message-list.vue';

    export default {
        //import all tooltip content components here...
        components:{
            'message-list': messageList
        },
        props:{
            text: {type: String, required: false },
            component: {type: String, required: false },
            props: { type: Object, required: false },
            classList: {type: Array, required: false}
        },
        computed:{
            classes() {
                return ['v-tooltip-box', 'down'].concat(this.classList || []);
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
