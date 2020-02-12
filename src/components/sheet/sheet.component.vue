<template>
  <div class="v-sheet-vessel">
       
    <div class="v-sheet" v-on:scroll="onScroll($event)" v-on:mousedown="onMouseDown" v-on:mouseup="onMouseUp" v-on:mousemove="onMouseMove">
        <grid :virtual-list="virtualList" v-bind:grid-top="gridTop"></grid>    
        <selection-area :selections="selections"></selection-area>
        <div class="vault" :style="{ height: vaultHeight + 'px' }"></div>
    </div>

  </div>
</template>

<script>
  
    import Grid from './grid.component.vue';
    import SelectionArea from './selection-area.component.vue';
import { setInterval } from 'timers';

    export default {
        components:{
            grid: Grid,
            selectionArea: SelectionArea
        },
        mounted: function(){
            this.sheetHeight = this.$el.clientHeight; 
             
            this.selections = [{
                start: {x: 0, y: 0},
                end: {x: 3, y: 3}
            }];     
            
            // var customVar = this.selections;

            // setInterval(function(){
            //     customVar[0].end.x++;
            //     customVar[0].end.y++;
            // }, 500);
        },
        updated:function(){
            console.log(this.virtualList);
        },
        props:{
            source: {type: Array, required: true }, 
            rowHeight: {type: Number, required: false, default: 20 },
            columnWidth: {type: Number, required: false, default: 90 }
        },
        data:function(){
            return{
                lastVirtualPosition: 0,
                vaultHeight: this.source.length * this.rowHeight,
                sheetHeight: 0,

                sheetScrollTop: 0,
                virtualBuffer: 5,      

                selections:[],
                scrollInterval: null,

                gridTop: 0
            }   
        },
        computed:{         
            virtualList: function(){
                if(!this.sheetHeight) return[];
                let visibleRowCount = Math.ceil(this.sheetHeight / this.rowHeight);
                let scrolledRowCount = Math.floor(this.sheetScrollTop / this.rowHeight);          
                let startIndex = scrolledRowCount  - this.virtualBuffer < 0 ? 0 : scrolledRowCount  - this.virtualBuffer;   
                let endIndex = startIndex + visibleRowCount + this.virtualBuffer * 2;                      
                 return this.source.slice(startIndex, endIndex);
            }        
        },
        watch:{
           
        },
        methods:{
           onScroll: function(e){
              if(Math.abs(e.target.scrollTop -  this.lastVirtualPosition) > this.virtualBuffer * this.rowHeight){
                    console.debug('scroll render');
                    let scrollTop = e.target.scrollTop;
                    this.lastVirtualPosition = scrollTop;
                    this.sheetScrollTop = scrollTop;
                    this.gridTop = (scrollTop - this.virtualBuffer * this.rowHeight) < 0 ? 0 : (scrollTop - this.virtualBuffer * this.rowHeight);
                }
           },
           onMouseDown: function(){
               console.log('down xxx');
           },
           onMouseUp: function(){
                console.log('up xxx');
           },
           onMouseMove:function(){
               console.log('move xxx');

                this.selections[0].end.x++;
                this.selections[0].end.y++;
           }        
        }
    };
</script>

<style lang="less">
    .v-sheet-vessel{
        height: 100%;
        width: 100%;
        box-sizing: border-box;

        *{
            box-sizing: border-box;
        }
        
        .v-sheet{        
            --sheet-font-color: black;
            --sheet-font-size: 12px;
            --sheet-background-color: transparent;
            --vault-height: 0px;

            position: relative;
            height: 100%;
            width: 100%;
            // max-height: 100%;       
            // max-width: 100%;
            overflow: auto;
            
            font-size: var(--sheet-font-size);
            background-color: var(--sheet-background-color);
            color: var(--sheet-font-color);
                      
            .vault{
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: var(--vault-height);            
            }       
        }
    }
</style>
