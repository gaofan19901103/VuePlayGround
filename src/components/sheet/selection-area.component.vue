<template>
    <div class="selection-area-root" v-if="selections.length">
        <div class="selection-area"     
        v-for="area in selectionAreas" v-bind:key="area.key"
        :style="{ top: area.top + 'px', left: area.left + 'px', height: area.height + 'px', width: area.width + 'px' }">
        </div>
    </div>
   
</template>

<script>
    export default {
        props:{
           selections: {type: Array, required: false, default: 0 }
        },
        computed:{
            selectionAreas:function(){
                let areas = [];

                this.selections.forEach((slt, index) =>{  
                    //tl: top-left,  br: bottom-left                
                    let tlX = Math.min(Number(slt.start.x), Number(slt.end.x));
                    let tlY = Math.min(Number(slt.start.y), Number(slt.end.y));
                    let brX = Math.max(Number(slt.start.x), Number(slt.end.x));
                    let brY = Math.max(Number(slt.start.y), Number(slt.end.y));
                           
                    //let cell = this.$el.parentElement.querySelector(`[data-row="${tlX}"][data-col="${tlY}"]`);


                    areas.push({
                        key: index,
                        // top: cell.offsetTop,
                        // left: cell.offsetLeft,
                        top: tlY * this.$parent.rowHeight,
                        left: tlX * this.$parent.columnWidth,
                        height: (brY - tlY + 1) * this.$parent.rowHeight,
                        width: (brX - tlX + 1) * this.$parent.columnWidth
                    });
                });
                console.log('------top-------', areas[0].height);
                return areas;
            }
        },
        methods:{
           
        }
    };
</script>

<style lang="less">
.selection-area-root{
    position: absolute;
    top: 0;
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
