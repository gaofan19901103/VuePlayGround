<template>
    <div>
        <span v-if="header" style="font-weight: bold">{{header}}</span>
        <ul style="list-style:square;padding:0;margin:0;padding-left:16px">
            <li v-for="msg in messages" v-bind:key="msg">{{msg}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            header: { type: String, required: false },
            messages: { type: Array, required: true }
        }
    };
</script>

<style lang="less">
</style>
