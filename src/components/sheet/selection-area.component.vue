<template>
    <div class="selection-area-root" v-if="selections.length" :style="{width: sweller}">
        <div class="selection-area" v-for="area in selectionAreas" v-bind:key="area.key" :style="area.style">
            <div class="drag-dot" v-if="showDragDot"></div>
        </div>
        <div class="selection-area" v-for="area in freezeSelectionAreas" v-bind:key="area.key" :style="area.style">
            <div class="drag-dot" v-if="showDragDot && area.showDot"></div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted: function(){
            //GF:Review - one time set up, do it here, would this help vue to accelerate Recalculate styles.
            let lastHeaderRow = this.headerRows[this.headerRows.length - 1];
            let offSet = (lastHeaderRow.y + lastHeaderRow.height) * -1;
            this.$el.style.setProperty('--offSetTop', offSet + 'px');
        },
        props:{
           selections: { type: Array, required: false, default: [] },
           headerRows: { type: Array, required: false, default: [] },
           metaRows: { type: Array, required: false, default: [] },
           metaColumns: { type: Array, required: false, default: [] },
           freezeColCount: { type: Number, required: false, default: 0 }
        },
        data: function(){
            return{

            }
        },
        computed:{
            sweller: function(){ // GF:Review - this is kind of a hack, needed for sticky position.
                return this.metaColumns[this.metaColumns.length - 1].x + this.metaColumns[this.metaColumns.length - 1].width;
            },
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
                            top:  this.metaRows[tlY].y + 'px',
                            left: this.metaColumns[tlX].x + 'px',
                            height: this.metaRows[brY].y - this.metaRows[tlY].y + this.metaRows[brY].height + 'px',
                            width: this.metaColumns[brX].x - this.metaColumns[tlX].x + this.metaColumns[brX].width + 'px'
                        }
                    });
                });

                return areas;
            },
            freezeSelectionAreas:function(){
                if(!this.freezeColCount) return [];

                let freezeAreas = [];

                this.selections.forEach((slt, index) =>{  
           
                    let tlX = Math.min(Number(slt.start.col), Number(slt.end.col));
                    let tlY = Math.min(Number(slt.start.row), Number(slt.end.row));
                    let brX = Math.max(Number(slt.start.col), Number(slt.end.col));
                    let brY = Math.max(Number(slt.start.row), Number(slt.end.row));

                    if(tlX < this.freezeColCount){
                        let freezeBrX = brX >= this.freezeColCount - 1 ? this.freezeColCount -1 : brX;
                        let overBody = brX > this.freezeColCount - 1;

                        freezeAreas.push({
                            key: `freeze${index}`,
                            showDot: !overBody,
                            style: {
                                ...{
                                    position: 'sticky',
                                    zIndex: 120,
                                    transform:  `translateY(${this.metaRows[tlY].y}px)`,
                                    left: this.metaColumns[tlX].x + 'px',
                                    height: this.metaRows[brY].y - this.metaRows[tlY].y + this.metaRows[brY].height + 'px',
                                    width: this.metaColumns[freezeBrX].x - this.metaColumns[tlX].x + this.metaColumns[freezeBrX].width + 'px',
                                },
                                ...overBody ? { borderRight: 'none' } : {}
                            }
                        });
                    }
                });

                return freezeAreas;
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
    --offSetTop: 0px;
     position: absolute;
     top: var(--offSetTop); 
     height: 0; 

    // position: fixed; //GF:Review - todo: I think absolute is better, but we need to set the top dynamically base on the height.
    // top: 0;  
    // left: 0; //this fixed has a stacking order problem.

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
