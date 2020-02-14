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

    export default {
        components:{
            grid: Grid,
            selectionArea: SelectionArea
        },
        mounted: function(){
            let that = this;

            this.sheetHeight = this.$el.clientHeight; 
             
            this.selections = [{
                start: {x: 1, y: 24},
                end: {x: 5, y: 100}
            }];     
            
            // var customVar = this.selections;

            // setInterval(function(){
            //     customVar[0].end.x++;
            //     customVar[0].end.y++;
            // }, 500);

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
                    e = e || window.event;
                    e.preventDefault();
                    // calculate the new cursor position:
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    // set the element's new position:
                    // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                    // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

                    //console.log(e.offsetX,e.offsetY);
                    //console.log(e.target);
                    console.log('/////////////');

                    let dataAtt = e.target.dataset;                

                    if(that.$el.contains(e.target)){
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
                        if(that.scrollCallback){
                            return;
                        }

                        //where to scroll
                        let gridElRect = gridEl.getClientRects()[0];
                        let up, down, left, right;
                        if(e.pageY > gridElRect.top + gridElRect.height){
                            //should be down
                            console.log('scroll outsite, down ...');
                            down = true;
                        } 
                        else if(e.pageY < gridElRect.top){
                            console.log('scroll outsite, up ...');
                            up = true;
                        }
                        if(e.pageX > gridElRect.left + gridElRect.width){
                            console.log('scroll outsite, left ...');
                            right = true;
                        }
                        else if(e.pageY < gridElRect.left){
                            console.log('scroll outsite, right ...');
                            left = true;
                        }

                        console.log('auto scroll....');
                        that.dragScroll(up, down, left, right);
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
                let result = this.indexedSource.slice(startIndex, endIndex);
                return result;
                //return this.source.concat();
            }        
        },
        watch:{
           
        },
        methods:{
           onScroll: function(e){
                console.log(e.target.scrollTop);
              if(Math.abs(e.target.scrollTop -  this.lastVirtualPosition) > this.virtualBuffer * this.rowHeight){
                    console.debug('scroll render');
                    let scrollTop = e.target.scrollTop;
                    this.lastVirtualPosition = scrollTop;
                    this.sheetScrollTop = scrollTop;
                    
                    let _gridTop = (scrollTop - this.virtualBuffer * this.rowHeight) < 0 ? 0 : (scrollTop - this.virtualBuffer * this.rowHeight);
                    let testNumber = _gridTop % this.rowHeight;
                    this.gridTop = _gridTop - testNumber;
                   console.log('xxxxxxxxxxxxx ' + scrollTop,_gridTop, testNumber);
                   //this.selections = this.selections.concat();
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
