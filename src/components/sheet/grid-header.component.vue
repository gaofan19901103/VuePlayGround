<template>
   <div class="v-grid-header">
        <div class="grid-header-row" v-for="item in headerRows" v-bind:key="item.rowIndex">
            <cell
                v-for="col in columns" v-bind:key="col.colIndex"
                :row-index="item.rowIndex"
                :col-index="col.colIndex"
                :value="item.cells[col.colId].value"
                :freeze="item.freeze"
            >
            </cell>
        </div>
    </div>
</template>

<script>
    import Cell from './cell.component.vue';  
    import Row from './row.component.vue';

    export default {
        components:{
            'cell': Cell,
            'row': Row
        },
        props:{
           headerRows: {type: Array, required: false, default: [] },
           columns: {type: Array, required: false, default: []}
        },
        mounted: function(){

        },
        updated: function(){

        }
    };
</script>

<style lang="less">

        .v-grid-header{
        //   position: sticky; 
        //   top: 0; 
        //   background-color: white;

            .grid-header-row{
                display: flex;
                
            }
        }

   
</style>
