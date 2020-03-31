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
        data:function(){
            return{
                value: null
            }
        },
        computed:{

        },
        mounted: function(){
           this.$refs.editor.focus();
        },
        updated: function(){

        },
        beforeDestroy:function(){
            this.value = this.$refs.editor.value;
        },
        destroyed:function(){
            let valueObj = {
                row: this.combo.row,
                col: this.combo.col,
                rowId: this.combo.cell.rowId,
                colId: this.combo.cell.colId,
                oldValue: this.combo.value,
                newValue: this.value
            };
            this.$emit('hide-cell-editor', valueObj);
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
