<template>


   <div class="v-grid-header" :style="{width: width + 'px'}">
        <div class="grid-header-row" v-for="item in indexedHeaderRows" v-bind:key="item.rowIndex">
            <cell
                v-for="col in columns" v-bind:key="col.colIndex"
                :row-index="item.rowIndex"
                :col-index="col.colIndex"
                :value="item.cells[col.colIndex].value"
                :freeze="col.freeze"
                :height="item.height"
                :width="col.width"
                :header="isHeader"
                :x="item.cells[col.colIndex].x"
            >
            </cell>
        </div>
        <div class="selection-area-root" v-if="selections.length">
            <div :class="{'selection-area': true, 'no-bottom-border': area.noBottomBorder, 'no-right-border': area.noRightBorder }" v-for="area in selectionAreas" v-bind:key="area.key" :v-if="area.show" :style="[{ top: area.top + 'px', left: area.left + 'px', height: area.height + 'px', width: area.width + 'px' }, area.style]"></div>
        </div>
    </div>
</template>

<script>
    import Cell from './cell.component.vue';  

    export default {
        components:{
            'cell': Cell,
        },
        props:{
           indexedHeaderRows: {type: Array, required: false, default: [] },
           columns: {type: Array, required: false, default: []},
          // width: {type: Number,required: false, default: 0},
           selections: {type: Array, required: false, default: []}
        },
        data:function(){
            return{
                isHeader: true,
                firstNormalColIndex: this.columns.findIndex(x => !x.freeze)
                // noBottomBorder: false,
                // showHeaderSelectionArea: false
            };
        },
        computed:{
            width: function(){
                return this.columns[this.columns.length - 1].x + this.columns[this.columns.length - 1].width;
            },
            selectionAreas:function(){
                let areas = [];

                this.selections.forEach((slt, index) =>{  
                    //tl: top-left,  br: bottom-left                
                    let tlX = Math.min(Number(slt.start.col), Number(slt.end.col));
                    let tlY = Math.min(Number(slt.start.row), Number(slt.end.row));
                    let brX = Math.max(Number(slt.start.col), Number(slt.end.col));
                    let brY = Math.max(Number(slt.start.row), Number(slt.end.row));

                    let showHeaderSelectionArea = tlY < this.indexedHeaderRows.length;

                    let noBottomBorder = brY > (this.indexedHeaderRows.length -1);

                    if(showHeaderSelectionArea)
                    {
                        
                        //this.noBottomBorder = brY > (this.indexedHeaderRows.length -1);
                        brY = brY > (this.indexedHeaderRows.length -1) ? this.indexedHeaderRows.length -1 : brY;
                        

                        areas.push({
                            key: index,
                            top: this.indexedHeaderRows[tlY].cells[tlX].y,
                            left: this.indexedHeaderRows[tlY].cells[tlX].x,
                            height: this.indexedHeaderRows[brY].cells[brX].y - this.indexedHeaderRows[tlY].cells[tlX].y + this.indexedHeaderRows[brY].height,
                            width: this.indexedHeaderRows[brY].cells[brX].x - this.indexedHeaderRows[tlY].cells[tlX].x + this.columns[brX].width,
                            noBottomBorder: noBottomBorder,
                            show: showHeaderSelectionArea,
                            style: {}
                        });
                    }

                    let showHeaderSelectionAreaFreeze = showHeaderSelectionArea && tlX < this.firstNormalColIndex;

                    if(showHeaderSelectionAreaFreeze){
                        let noRightBorder = brX > (this.firstNormalColIndex -1);
                        brX = brX >= this.firstNormalColIndex - 1 ? this.firstNormalColIndex - 1 : brX;

                        areas.push({
                            key: 'gridheaderfreeze' + index,
                            top: this.indexedHeaderRows[tlY].cells[tlX].y,
                            left: this.indexedHeaderRows[tlY].cells[tlX].x,
                            height: this.indexedHeaderRows[brY].cells[brX].y - this.indexedHeaderRows[tlY].cells[tlX].y + this.indexedHeaderRows[brY].height,
                            width: this.indexedHeaderRows[brY].cells[brX].x - this.indexedHeaderRows[tlY].cells[tlX].x + this.columns[brX].width,
                            noBottomBorder: noBottomBorder,
                            noRightBorder: noRightBorder,
                            show: showHeaderSelectionArea,
                            style: {
                                'z-index': 1000,
                                position: 'fixed',
                                left: this.indexedHeaderRows[tlY].cells[tlX].x
                            }
                        });
                    }
                });

                return areas;
            }
        },
        mounted: function(){
            let x = 0;
        },
        updated: function(){

        }
    };
</script>

<style lang="less">

        .v-grid-header{
            --grid-border-color: #cedbe6;

            position: relative;
            //position: absolute;
        //   position: sticky; 
        //   top: 0; 
        //   background-color: white;

            .grid-header-row{
                display: flex;
                height: 20px; // variable
            }

            // .grid-cell{
            //     overflow: hidden;
            //     text-align: center;
            //     border-top: 0.25px solid var(--grid-border-color);
            //     border-left: 0.25px solid var(--grid-border-color);    
            // }

            .selection-area-root{
                position: absolute;
                top: 0;
                left: 0;
               // z-index: 100;

                .selection-area{
                    --selection-area-color: rgba(255,99,88,0.25);
                    --selection-area-border: #ff6358;
                    
                    position: absolute;
                    box-sizing: border-box;
                    pointer-events: none;
                    border: 2px solid var(--selection-area-border);
                    background-color: var(--selection-area-color);
                }

                .selection-area.no-bottom-border{
                    border-bottom: none;
                }

                .selection-area.no-right-border{
                    border-right: none;
                }
            }
        }

   
</style>
