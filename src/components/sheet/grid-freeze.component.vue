<template>
<div class="v-grid-freeze-container" style="z-index: 10; position: sticky; left: 0;">
   <div class="v-grid-freeze" :style="{ transform: `translateY(${offsetTop}px)`, 'background-color': 'grey'}" ref="GridEl">
    <!-- <div class="v-grid-freeze" :style="{ top: `${gridTop}px`, 'background-color': 'grey', 'z-index': 10}" ref="GridEl"> -->
        <!-- <div> -->
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

            <!-- </div> -->
        </div>
        <!-- <div class="selection-area-root" v-if="selections.length" style="z-index: 10">
            <div :class="{'selection-area': true, 'no-border-right': area.noRightBorder }" v-for="area in selectionAreas" v-bind:key="area.key" :v-if="area.show" :style="{ top: area.top + 'px', left: area.left + 'px', height: area.height + 'px', width: area.width + 'px' }"></div>
        </div> -->
        <selection-area :selections="freezeSelections" :indexed-rows="indexedRows" :indexed-cols="columns" :header-rows="headerRows"></selection-area>
        <div class="vault" :style="{ height: (indexedRows.length - headerRows.length) * $parent.rowHeight + 'px' }"></div>
    </div>
</template>

<script>
    import Cell from './cell.component.vue';  
    import selectionArea from './selection-area.component.vue';

    export default {
        components:{
            'cell': Cell,
            'selection-area': selectionArea
        },
        props:{
           rows: {type: Array, required: false, default: [] },
           columns: {type: Array, required: false, default: []},
           offsetTop: {type: Number, required: false, default: 0},
           selections: {type: Array, required: false, default: [] },
           indexedRows: {type: Array, required: false, default: [] },
           indexedCols: {type: Array, required: false, default: [] },
           headerRows: {type: Array, required: false, default: [] },
           freezeColCount: {type: Number, required: false, default: 0 }
        },

        computed:{
            freezeSelections: function(){
                return this.selections.map(selection =>{
                    return {                      
                        start:{
                            row: selection.start.row,
                            col: selection.start.col
                        },
                        end:{
                            row: selection.end.row,
                            col: selection.end.col >= this.freezeColCount - 1 ? this.freezeColCount - 1 : selection.start.col
                        },
                        noRightBorder: selection.start.col >= this.freezeColCount - 1
                    };
                });
            },
            selectionAreas:function(){
                let freezeAreas = [];

                this.selections.forEach((slt, index) =>{  
           
                    let tlX = Math.min(Number(slt.start.col), Number(slt.end.col));
                    let tlY = Math.min(Number(slt.start.row), Number(slt.end.row));
                    let brX = Math.max(Number(slt.start.col), Number(slt.end.col));
                    let brY = Math.max(Number(slt.start.row), Number(slt.end.row));

                    let showFreezeArea = tlX < this.columns.length;
                    if(showFreezeArea){
                        let brX_Freeze =  brX >= this.columns.length - 1 ? this.columns.length -1 : brX;

                        freezeAreas.push({
                            key: 'freeze' + index,
                            top: this.indexedRows[tlY].cells[tlX].y,
                            left: this.indexedRows[tlY].cells[tlX].x,
                            height: this.indexedRows[brY].cells[brX_Freeze].y - this.indexedRows[tlY].cells[tlX].y + this.indexedRows[brY].height,
                            width: this.indexedRows[brY].cells[brX_Freeze].x - this.indexedRows[tlY].cells[tlX].x + this.indexedCols[brX_Freeze].width,
                            noRightBorder: brX > this.columns.length - 1,
                            show: showFreezeArea
                        });
                    }
                });

                return freezeAreas;
            }
        },
        mounted: function(){
           this.$refs.GridEl.style.setProperty('--row-height', this.$parent.rowHeight + 'px');
           this.$refs.GridEl.style.setProperty('--col-width', this.$parent.columnWidth + 'px');
        },
        updated: function(){
            let x =0;
            console.log('grid freeze virtual scorll list updated');
        }
    };
</script>

<style lang="less">
       .v-grid-freeze-container{
            .v-grid-freeze{
                --col-width: 90px;
                --row-height: 20px;
                --grid-border-color: #cedbe6;

                position: relative;
                // left: 0;

                *{
                    box-sizing: border-box;
                }


                .grid-row{
                    display: flex;
                    height: var(--row-height);  
                }

                .grid-row:last-child{
                    .grid-cell{
                        border-bottom: 0.25px solid var(--grid-border-color);
                    }
                }

                .grid-column{
                    width: var(--col-width);
                }

                .grid-cell{ 
                    text-align: center;
                    line-height: var(--row-height);
                    border-top: 0.25px solid var(--grid-border-color);
                    border-left: 0.25px solid var(--grid-border-color);            
                }
            }

            .selection-area-root{
                position: absolute;
                top: -20px; //GF:Review: should be dynamic, variable.
                left: 0;

                .selection-area{
                    --selection-area-color: rgba(255,99,88,0.25);
                    --selection-area-border: #ff6358;
                    
                    position: absolute;
                    box-sizing: border-box;
                    pointer-events: none;
                    border: 2px solid var(--selection-area-border);
                    background-color: var(--selection-area-color);
                }

                .selection-area.no-border-right{
                    border-right: none;
                }
            }
       }
        

   
</style>
