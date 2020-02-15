<template>
  <div class="v-sheet-vessel" v-on-resize="onResize">
       
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
import { posix } from 'path';

    export default {
        components:{
            grid: Grid,
            selectionArea: SelectionArea
        },
        mounted: function(){
            let that = this;

            this.sheetHeight = this.$el.clientHeight; 

            let gridRect = this.$el.querySelector('.v-sheet').getBoundingClientRect();
             
            function dragElement(elmnt) {
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                var rowIndex, columnIndex;

                elmnt.onmousedown = dragMouseDown;
                
                function dragMouseDown(e) {
                    e.preventDefault();

                    rowIndex = null;
                    columnIndex = null;
                    that.selections = [];
                        
                    let dataAtt = e.target.dataset;
                    rowIndex = dataAtt.row;
                    columnIndex = dataAtt.col;

                    console.log('mouse down', rowIndex, columnIndex);
                        
                    that.selections.push({
                        start: {x: columnIndex, y: rowIndex}, 
                        end: {x: columnIndex, y: rowIndex}
                    });

                    document.onmouseup = closeDragElement;                 
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    
                    //e.preventDefault();
                   
                   

                    let dataAtt = e.target.dataset;     
                    let equrant = that.getMousePosition(e.pageX, e.pageY, gridRect);       

                    //if(that.$el.contains(e.target)){
                    if(equrant == 5){
                        if(rowIndex != dataAtt.row || columnIndex != dataAtt.col){
                            console.log('mouse moveing', e.target);
                            
                            rowIndex = dataAtt.row;
                            columnIndex = dataAtt.col;
                            if(that.selections[0] && that.selections[0].end){
                                that.selections[0].end.x = columnIndex;
                                that.selections[0].end.y = rowIndex;
                            }                               
                        }
                    }
                    else{
                        console.log('equrant: ' + equrant);

                        // if(that.scrollCallback){
                        //     return;
                        // }

                        // //where to scroll
                        // let gridElRect = gridEl.getClientRects()[0];
                        // let up, down, left, right;
                        // if(e.pageY > gridElRect.top + gridElRect.height){
                        //     //should be down
                        //     console.log('scroll outsite, down ...');
                        //     down = true;
                        // } 
                        // else if(e.pageY < gridElRect.top){
                        //     console.log('scroll outsite, up ...');
                        //     up = true;
                        // }
                        // if(e.pageX > gridElRect.left + gridElRect.width){
                        //     console.log('scroll outsite, left ...');
                        //     right = true;
                        // }
                        // else if(e.pageY < gridElRect.left){
                        //     console.log('scroll outsite, right ...');
                        //     left = true;
                        // }

                        // console.log('auto scroll....');
                        // that.dragScroll(up, down, left, right);
                    }                   
                }

                function closeDragElement(e) {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }       
            }

            let gridEl = this.$el.querySelector('.v-sheet');
            dragElement(gridEl);
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
                indexedSource: this.source.map((x,y) => Object.assign(x, {rowIndex: y })),

                lastVirtualPosition: 0,
                vaultHeight: this.source.length * this.rowHeight,
                sheetHeight: 0,

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
                let scrolledRowCount = Math.floor(this.lastVirtualPosition / this.rowHeight);          
                let startIndex = scrolledRowCount  - this.virtualBuffer < 0 ? 0 : scrolledRowCount  - this.virtualBuffer;   
                let endIndex = startIndex + visibleRowCount + this.virtualBuffer * 2;                      
                let result = this.indexedSource.slice(startIndex, endIndex);
                return result;
            }        
        },
        watch:{
           
        },
        methods:{
           onScroll: function(e){
              if(Math.abs(e.target.scrollTop -  this.lastVirtualPosition) > this.virtualBuffer * this.rowHeight){
                    console.debug('virtual list re-render', e.target.scrollTop);
                    let scrollTop = e.target.scrollTop;
                    this.lastVirtualPosition = scrollTop;              
                    let _gridTop = (scrollTop - this.virtualBuffer * this.rowHeight) < 0 ? 0 : (scrollTop - this.virtualBuffer * this.rowHeight);
                    this.gridTop = _gridTop - (_gridTop % this.rowHeight);
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

                // this.selections[0].end.x++;
                // this.selections[0].end.y++;
           },
           onResize: function(){
               console.log('on resize');
               this.sheetHeight = this.$el.clientHeight;
           },
           getMousePosition: function(mouseX, mouseY, targetRect){
                //let targetRect = target.getBoundingClientRect();
                //let position = {};

                let uppperEdge = targetRect.top;
                let lowerEdge = targetRect.top + targetRect.height;
                let leftEdge = targetRect.left;
                let rightEdge = targetRect.left + targetRect.width;
                
                let result;
                
                
               if(mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= uppperEdge && mouseY <= lowerEdge){
                   return 5;
               }
               else{
                   if(mouseY < uppperEdge){
                       if(mouseX < leftEdge){
                           return 1;
                       }
                       else if (mouseX > rightEdge){
                           return 3
                       }
                       else{
                           return 2;
                       }
                   }
                   else if(mouseY > lowerEdge){
                       if(mouseX < leftEdge){
                           return 7;
                       }
                       else if (mouseX > rightEdge){
                           return 9
                       }
                       else{
                           return 8;
                       }
                   }
                    else{
                        if(mouseX < leftEdge){
                            return 4;
                        }
                        else{
                                return 6;
                        }    
                    }
  
               }
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
