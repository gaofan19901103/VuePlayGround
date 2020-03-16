<template>
        <div class="grid-row">
            <cell
                v-for="col in columns" v-bind:key="col.colIndex"
                :row-index="row.rowIndex"
                :col-index="col.colIndex"
                :value="row.cells[col.colId].value"
            >
            </cell>
        </div>
</template>

<script>
    import Cell from './cell.component.vue'; 

    export default {
        components:{
            'cell': Cell
        },
        props:{
           columns: {type: Array, required: false},  
           row: { type: Object, required: false }
        },
        computed:{

        },
        mounted: function(){
            console.log('row updated ->',this.row.rowIndex);
        },
        updated: function(){

        }
    };
</script>

<style lang="less">

    .v-grid{
            .grid-row{
                display: flex;
                height: var(--row-height);  


                .grid-cell:last-child{
                    border-right: 0.25px solid var(--grid-border-color);
                }
            }

            .grid-row:last-child{
                .grid-cell{
                    border-bottom: 0.25px solid var(--grid-border-color);
                }
            }
    }

</style>
