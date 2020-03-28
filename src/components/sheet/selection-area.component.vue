<template>
    <div class="selection-area-root" v-if="selections.length">
        <!-- <div class="selection-area" v-if="onlyHeaderArea"></div> -->
        <!-- <div class="selection-area-root-freeze">                                                                                                           Review: This should be rowHieght * countOfHeaderRow -->
            <div :class="{'selection-area': true, 'for-freeze': true, 'no-right-border': area.noRightBorder}" v-for="area in freezeAreas" :key="area.key" :style="{ top: area.top  + 'px', left: area.left + 'px', height: area.height + 'px', width: area.width + 'px', position: 'fixed' }">
            </div>
        <!-- </div> -->
        
        <div class="selection-area" v-for="area in selectionAreas" v-bind:key="area.key" :style="{ top: area.top + 'px', left: area.left + 'px', height: area.height + 'px', width: area.width + 'px' }"></div>
    </div>
</template>

<script>
    export default {
        props:{
           selections: {type: Array, required: false, default: 0 },
           indexedRows: {type: Array, required: false, default: [] },
           indexedCols: {type: Array, required: false, default: [] }
        },
        data: function(){
            return{
                freezeAreas: [],
                countOfHeaderRow: this.indexedRows.findIndex(x => !x.isHeader),
                countOfFreeze: this.indexedCols.findIndex(x => !x.freeze)
            }
        },
        computed:{
            selectionAreas:function(){
                this.freezeAreas = [];

                let areas = [];

                this.selections.forEach((slt, index) =>{  
                    //tl: top-left,  br: bottom-left                
                    let tlX = Math.min(Number(slt.start.col), Number(slt.end.col));
                    let tlY = Math.min(Number(slt.start.row), Number(slt.end.row));
                    let brX = Math.max(Number(slt.start.col), Number(slt.end.col));
                    let brY = Math.max(Number(slt.start.row), Number(slt.end.row));

                    // areas.push({
                    //     key: index,
                    //     top: tlY * this.$parent.rowHeight,
                    //     left: tlX * this.$parent.columnWidth,
                   //     height: (brY - tlY + 1) * this.$parent.rowHeight,
                    //     width: (brX - tlX + 1) * this.$parent.columnWidth
                    // });
                  
                    areas.push({
                        key: index,
                        top: this.indexedRows[tlY].cells[tlX].y,
                        left: this.indexedRows[tlY].cells[tlX].x,
                        height: this.indexedRows[brY].cells[brX].y - this.indexedRows[tlY].cells[tlX].y + this.indexedRows[brY].height,
                        width: this.indexedRows[brY].cells[brX].x - this.indexedRows[tlY].cells[tlX].x + this.indexedCols[brX].width
                    });


                    let showFreezeArea = tlX < this.countOfFreeze;
                    if(showFreezeArea){
                        let brX_Freeze =  brX >= this.countOfFreeze ? this.countOfFreeze -1 : brX;

                        this.freezeAreas.push({
                            key: 'freeze' + index,
                            top: this.indexedRows[tlY].cells[tlX].y,
                            left: this.indexedRows[tlY].cells[tlX].x,
                            height: this.indexedRows[brY].cells[brX_Freeze].y - this.indexedRows[tlY].cells[tlX].y + this.indexedRows[brY].height,
                            width: this.indexedRows[brY].cells[brX_Freeze].x - this.indexedRows[tlY].cells[tlX].x + this.indexedCols[brX_Freeze].width,
                            noRightBorder: brX > this.countOfFreeze - 1,
                            show: showFreezeArea
                        });
                    }
                });

                return areas;
            },
            hasFreezeColumn: function(){
                this.indexedCols.some(x => x.freeze);
            },
            // onlyHeaderArea:function(){
            //     return this.selections.some(x => x.start.row == 0 && x.end.row == 0);
            // }
        },
        updated: function(){
            console.log('selection-area update');
        }
    };
</script>

<style lang="less">
.selection-area-root{
    position: relative;
    top: -20px;  // this should be the rowHeight * countOfHeaderRow
    left: 0;
    width: 0px;
    height: 0px;


        .selection-area.for-freeze{
            position: relative;
            z-index: 101;

            &.no-right-border{
                border-right: none;
            }   
        }


    // .selection-area-root-freeze{
    //     .selection-area.for-freeze{
    //         z-index: 101;

    //         &.no-right-border{
    //             border-right: none;
    //         }   
    //     }
    // }

    .selection-area{
        --selection-area-color: rgba(255,99,88,0.25);
        --selection-area-border: #ff6358;
        
        position: absolute;
        box-sizing: border-box;
        pointer-events: none;
        border: 2px solid var(--selection-area-border);
        background-color: var(--selection-area-color);
    }

}
  
</style>
