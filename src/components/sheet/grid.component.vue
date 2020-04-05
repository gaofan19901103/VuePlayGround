<template>
   <div class="v-grid" :style="{ top: offsetTop + 'px'}">
        <div :class="{'grid-row': true, 'freeze': item.freeze }" v-for="item in rows" v-bind:key="item.rowIndex" :style="{height: item.height + 'px'}">
            <cell
                v-for="col in columns" v-bind:key="col.colIndex"
                :row-index="item.rowIndex"
                :col-index="col.colIndex"
                :value="item.cells[col.colIndex].value"
                :freeze="col.freeze"
                :height="item.height"
                :width="col.width"
                :x="item.cells[col.colIndex].x"
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
           rows: {type: Array, required: false, default: [] },
           columns: {type: Array, required: false, default: []},
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
            --row-height: 20px;
            --grid-border-color: #cedbe6;

            position: relative;
        }

   
</style>
