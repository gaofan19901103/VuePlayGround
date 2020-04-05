<template>
   <div class="v-grid" :style="{ top: offsetTop + 'px'}">
        <div class="grid-row" v-for="item in rows" v-bind:key="item.rowIndex" >
            <cell
                v-for="col in metaColumns" v-bind:key="col.colIndex"
                :row-index="item.rowIndex"
                :col-index="col.colIndex"
                :value="item.cells[col.colIndex].value"
                :freeze="col.freeze"
                :height="item.height"
                :width="col.width"
                :x="item.cells[col.colIndex].x">
            </cell>
        </div>
    </div>
</template>

<script>
    import Cell from './cell.component.vue';  

    export default {
        components:{
            'cell': Cell
        },
        props:{
           rows: {type: Array, required: false, default: [] },
           metaColumns: {type: Array, required: false, default: []},
           offsetTop: {type: Number, required: false, default: 0}
        },
        mounted: function(){
           this.$el.style.setProperty('--row-height', this.$parent.rowHeight + 'px');
        },
        updated: function(){
            console.debug('grid.component.vue - virtual scoll list updated', this.rows);
        }
    };
</script>

<style lang="less">
       
        .v-grid{
            --row-height: 0px;
            --grid-border-color: #cedbe6;

            position: relative;

            .grid-row{
                display: flex;
                height: var(--row-height);

                &:hover{
                    //GF:Review - ToDo: I want this to be on row leve, instead of styling each cell.
                    //border-bottom: 2px solid red;
                    .grid-cell{
                        border-bottom: 2px solid red;
                    }
                }
            }
        }

   
</style>
