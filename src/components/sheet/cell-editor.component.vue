<template>
    <div class="cell-editor" :style="combo.style">
        <input type="text" id="lname" name="lname" :value="combo.value" ref="editor">
    </div>
</template>

<script>
    export default {
        props:{
           combo: { type: Object, required: false }
        },
        computed:{

        },
        mounted: function(){
           this.$refs.editor.focus();
        },
        updated: function(){

        }
    };
</script>

<style lang="less">

.cell-editor{
    position: absolute;
    z-index: 1001;
    overflow: hidden;
    border: 1px solid orange;
}


</style>
