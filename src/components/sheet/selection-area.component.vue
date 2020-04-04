<template>
    <div class="selection-area-root" v-if="selections.length">
        <div class="selection-area" v-for="area in selectionAreas" v-bind:key="area.key" :style="area.style">
            <div class="drag-dot" v-if="showDragDot"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
           selections: { type: Array, required: false, default: [] },
           indexedRows: { type: Array, required: false, default: [] },
           indexedCols: { type: Array, required: false, default: [] },

           //GF:Review - the two props below for freeze col and header.
           noBottomBorder: { type: Boolean, required: false, default: false },
           noRightBorder: { type: Boolean, required: false, default: false } 
        },
        data: function(){
            return{

            }
        },
        computed:{
            showDragDot: function(){
                return this.selections.length == 1;
            },
            selectionAreas:function(){
                let areas = [];

                this.selections.forEach((slt, index) =>{  
                    //tl: top-left,  br: bottom-left                
                    let tlX = Math.min(Number(slt.start.col), Number(slt.end.col));
                    let tlY = Math.min(Number(slt.start.row), Number(slt.end.row));
                    let brX = Math.max(Number(slt.start.col), Number(slt.end.col));
                    let brY = Math.max(Number(slt.start.row), Number(slt.end.row));

                    areas.push({
                        key: index,
                        style: {
                            ...{
                                top:  this.indexedRows[tlY].y + 'px',
                                left: this.indexedCols[tlX].x + 'px',
                                height: this.indexedRows[brY].y - this.indexedRows[tlY].y + this.indexedRows[brY].height + 'px',
                                width: this.indexedCols[brX].x - this.indexedCols[tlX].x + this.indexedCols[brX].width + 'px'
                            },
                            ...this.noBottomBorder ? { borderBottom: 'none' } : {},
                            ...this.noRightBorder ? { borderRight: 'none' } : {}
                        }
                    });
                });

                return areas;
            }
        },
        updated: function(){
            console.debug('selection-area update');
        }
    };
</script>

<style lang="less">
.selection-area-root{
    //GF:Review - suppose to be this way, for simpliciy, use fixed for now (below)
    // position: absolute;
    // top: -20px; 

    position: fixed; //GF:Review - todo: I think absolute is better, but we need to set the top dynamically base on the height.
    top: 0;  
    left: 0;

    .selection-area{
        --selection-area-color: rgba(255,99,88,0.25);
        --selection-area-border: #ff6358;
        
        pointer-events: none;
        position: absolute;
        box-sizing: border-box;
        border: 2px solid var(--selection-area-border);
        background-color: var(--selection-area-color);

        .drag-dot{
            position: absolute;
            bottom: -4px;
            right: -4px;
            height: 8px;
            width: 8px;
            border-radius: 4px;
            background-color: var(--selection-area-border);
            border: 0.5px solid white;
            pointer-events: all;
            cursor: crosshair;
        }
    }
}
  
</style>
