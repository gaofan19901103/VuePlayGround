<template>
   <div class="v-grid-header" :style="{width: `${sweller}px`}">
       <!-- GF:Review - later refactor here to cater the cell merge header -->
        <div class="grid-header-row" v-for="item in headerRows" v-bind:key="item.rowIndex">
            <cell
                v-for="col in metaColumns" v-bind:key="col.colIndex"
                :row-index="item.rowIndex"
                :col-index="col.colIndex"
                :value="item.cells[col.colIndex].value"
                :freeze="col.freeze"
                :height="item.height"
                :width="col.width"
                :header="isHeader"
                :x="item.cells[col.colIndex].x">
            </cell>
        </div>
        <selection-area :selections="headerSelections" :meta-rows="metaRows" :meta-columns="metaColumns" :header-rows="headerRows" :freeze-col-count="freezeColCount"></selection-area>
    </div>
</template>

<script>
    import Cell from './cell.component.vue';  
    import SelectionArea from './selection-area.component.vue';

    export default {
        components:{
            'cell': Cell,
            'selection-area': SelectionArea
        },
        props:{
           selections: {type: Array, required: false, default: []},
           headerRows: {type: Array, required: false, default: [] },
           metaRows: {type: Array, required: false, default: [] },
           metaColumns: {type: Array, required: false, default: []},
           headerRowCount: {type: Number, required: false, default: 0},
           freezeColCount: {type: Number, required: false, default: 0}
        },
        data:function(){
            return{
                isHeader: true
            };
        },
        computed:{
            sweller: function(){
                return this.metaColumns[this.metaColumns.length - 1].x + this.metaColumns[this.metaColumns.length - 1].width;
            },
            headerSelections:function(){
                let hs = [];

                this.selections.forEach(slt =>{

                    let tlX = Math.min(Number(slt.start.col), Number(slt.end.col));
                    let tlY = Math.min(Number(slt.start.row), Number(slt.end.row));
                    let brX = Math.max(Number(slt.start.col), Number(slt.end.col));
                    let brY = Math.max(Number(slt.start.row), Number(slt.end.row));

                    if(tlY < this.headerRowCount){
                        tlY = tlY >= this.headerRowCount - 1 ? this.headerRowCount - 1 : tlY;

                        hs.push({
                            start: { row:tlY, col: tlX },
                            end: { row: brY, col: brX }
                        });
                    }
                });

                return hs;
            },
        },
        mounted: function(){
           this.$el.style.setProperty('--row-height', this.$parent.rowHeight + 'px');
        },
        updated: function(){
            console.debug('grid-header - updated');
        }
    };
</script>

<style lang="less">

        .v-grid-header{
            --row-height: 0px;
            --grid-border-color: #cedbe6;

            position: relative;

            .grid-header-row{
                display: flex;
                height: var(--row-height); 

                .grid-cell{ 
                    text-align: center;
                    line-height: var(--row-height);
                    border-top: 0.25px solid var(--grid-border-color);
                    border-left: 0.25px solid var(--grid-border-color);            
                }
            }

            .selection-area-root{
                top: 0; //GF:Rview - move this ?
            }
        }

   
</style>
