<template>
    <div class="selection-area-root" v-if="selections.length">
        <!-- <div class="selection-area" v-if="onlyHeaderArea"></div> -->

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
        computed:{
            selectionAreas:function(){
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
    position: absolute;
    top: -20px;
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
}
  
</style>
