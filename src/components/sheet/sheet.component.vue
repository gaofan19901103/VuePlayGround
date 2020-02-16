<template>
  <div class="v-sheet-vessel" v-on-resize="onResize">
       
    <div class="v-sheet" v-on:scroll="onScroll($event)">
        <grid :virtual-list="virtualList" v-bind:grid-top="gridTop"></grid>    
        <selection-area :selections="selections"></selection-area>
        <div class="vault" :style="{ height: source.length * rowHeight + 'px' }"></div>
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
            let vSheet = that.$el.querySelector('.v-sheet');
            this.sheetHeight = this.$el.clientHeight; 

            this.gridRect = this.$el.querySelector('.v-sheet').getBoundingClientRect();
             
            function dragElement(elmnt) {
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
                    let equrant = Portal.Utils.getMouseEqurant(e.pageX, e.pageY, that.gridRect);       

                    //if(that.$el.contains(e.target)){
                    if(equrant == 5){
                        that.inDragScrolling = false;
                        clearInterval(that.onDragScroll);
                        that.onDragScroll = null;

                        if(rowIndex != dataAtt.row || columnIndex != dataAtt.col){
                            console.log('mouse moveing', e.target);
                            
                            rowIndex = dataAtt.row;
                            columnIndex = dataAtt.col;
                            if(that.selections[0] && that.selections[0].end){ //this needs to be considered.
                                that.selections[0].end.x = columnIndex;
                                that.selections[0].end.y = rowIndex;
                            }                               
                        }
                    }
                    else{
                        console.log('equrant: ' + equrant);                      
                        if(equrant ==8){
                            that.inDragScrolling = true;                          
                            
                            that.onDragScroll = that.onDragScroll || setInterval(function(){
                                console.debug('------------interval');
                                if(that.withinRange()){
                                    that.lastVirtualPosition = that.lastVirtualPosition + that.rowHeight;
                                    that.selections[0].end.y ++;
                                    vSheet.scrollBy(0, that.rowHeight);
                                }
                                else{
                                    that.inDragScrolling = false;
                                    clearInterval(that.onDragScroll);
                                    that.onDragScroll = null;
                                }
                            }, 50);
                        }                        
                    }                   
                }

                function closeDragElement(e) {
                    that.inDragScrolling = false;
                    clearInterval(that.onDragScroll);
                    that.onDragScroll = null;
                    document.onmouseup = null;
                    document.onmousemove = null;
                }       
            }

            dragElement(vSheet);
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
                sheetHeight: 0,
                gridRect: null,
                virtualBuffer: 5,      

                selections:[],

                currentOverCell: {row: null, col: null},
                inDragScrolling: false,
                onDragScroll: null
            }   
        },
        computed:{         
            virtualList: function(){ //depends on lastVirtualPostion, sheetHeight, rowHeight, virtualBuffer.
                if(!this.sheetHeight) return[];
                let visibleRowCount = Math.ceil(this.sheetHeight / this.rowHeight);
                let scrolledRowCount = Math.floor(this.lastVirtualPosition / this.rowHeight);          
                let startIndex = scrolledRowCount  - this.virtualBuffer < 0 ? 0 : scrolledRowCount  - this.virtualBuffer;   
                let endIndex = startIndex + visibleRowCount + this.virtualBuffer * 2;                      
                let result = this.indexedSource.slice(startIndex, endIndex);

                console.log('virtual list',result);
                return result;
            },
            gridTop: function(){ //depends on lastVirtualPostion
                let _gridTop = (this.lastVirtualPosition - this.virtualBuffer * this.rowHeight) < 0 ? 0 : (this.lastVirtualPosition - this.virtualBuffer * this.rowHeight);
                _gridTop = _gridTop - (_gridTop % this.rowHeight); //even myself doesn't know why ....
                return _gridTop;
            }  
        },
        watch:{
           
        },
        methods:{
           onScroll: function(e){
              if(this.inDragScrolling) return;
              if(Math.abs(e.target.scrollTop -  this.lastVirtualPosition) > this.virtualBuffer * this.rowHeight){
                    console.debug('virtual list re-render', e.target.scrollTop);
                    this.lastVirtualPosition = e.target.scrollTop;              
                }
           },
           onResize: function(){
               console.log('on resize');
               this.sheetHeight = this.$el.clientHeight;
               this.gridRect = this.$el.querySelector('.v-sheet').getBoundingClientRect();
           },
           withinRange: function(){
               return this.selections[0].end.y >= 0 && 
               this.selections[0].end.y <= this.source.length - 2 &&
               this.selections[0].end.x >= 0 &&
               this.selections[0].end.x <= Object.keys(this.source[0]).length
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
