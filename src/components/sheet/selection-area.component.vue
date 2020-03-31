<template>
    <div class="selection-area-root" v-if="selections.length">
        <div class="selection-area" v-for="area in selectionAreas" v-bind:key="area.key" :style="area.style"><div class="dot"></div></div>
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

                    areas.push({
                        key: index,
                        // top: this.indexedRows[tlY].cells[tlX].y,
                        // left: this.indexedRows[tlY].cells[tlX].x,
                        // height: this.indexedRows[brY].cells[brX].y - this.indexedRows[tlY].cells[tlX].y + this.indexedRows[brY].height,
                        // width: this.indexedRows[brY].cells[brX].x - this.indexedRows[tlY].cells[tlX].x + this.indexedCols[brX].width,
                        style: {
                            top:  this.indexedRows[tlY].cells[tlX].y + 'px',
                            left: this.indexedRows[tlY].cells[tlX].x + 'px',
                            height:  (this.indexedRows[brY].cells[brX].y - this.indexedRows[tlY].cells[tlX].y + this.indexedRows[brY].height) + 'px',
                            width: (this.indexedRows[brY].cells[brX].x - this.indexedRows[tlY].cells[tlX].x + this.indexedCols[brX].width) + 'px'
                        }
                    });
                });

                return areas;
            }
        },
        updated: function(){
            console.log('selection-area update');
        }
    };
</script>

<style lang="less">
.selection-area-root{
    //position: relative; //GF:Rview: clear all the positions.
    position: absolute;
    top: -20px;  //GF:Rview: this should be the rowHeight * countOfHeaderRow
    left: 0;
    width: 0px;
    height: 0px;

    .selection-area{
        --selection-area-color: rgba(255,99,88,0.25);
        --selection-area-border: #ff6358;
        
        position: absolute;
        box-sizing: border-box;
        pointer-events: none;
        border: 2px solid var(--selection-area-border);
        background-color: var(--selection-area-color);

        .dot{
            position: absolute;
            bottom: -4px;
            right: -4px;
            height: 8px;
            width: 8px;
            border-radius: 4px;
            background-color: #ff6358;
            border: 0.5px solid white;
            pointer-events: all;
            cursor: crosshair;
        }
    }

}
  
</style>
