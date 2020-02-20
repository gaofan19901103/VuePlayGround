<template>
  <div class="v-sheet-vessel" v-on-resize="onResize">
       
    <div class="v-sheet" v-on:scroll="onScroll($event)" v-on:copy="onCopy"  ref="SheetEl">
        <grid :virtual-list="virtualList" v-bind:grid-top="gridTop" ref="GridEl"></grid>    
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
            this.sheetEl = vSheet;
            this.sheetHeight = this.$el.clientHeight;
            this.rowCount = this.source.length;
            this.colCount = Object.keys(this.source[0]).length;

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
                    rowIndex = Number(dataAtt.row);
                    columnIndex = Number(dataAtt.col);

                    console.log('mouse down', rowIndex, columnIndex);
                        
                    that.selections.push({
                        start: {col: columnIndex, row: rowIndex}, 
                        end: {col: columnIndex, row: rowIndex}
                    });

                    document.onmouseup = closeDragElement;                 
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    
                    //e.preventDefault();
                    //console.debug('hovered over------>',e.target);             
                         
                    that.currentEqurant = Portal.Utils.getMouseEqurant(e.pageX, e.pageY, that.gridRect);       
                    console.log('--------------equrant',  that.currentEqurant);
                    if(that.currentEqurant == 5){
                        console.log('cancel ----------------- interval');
                        that.inDragScrolling = false;
                        clearInterval(that.onDragScroll);
                        that.onDragScroll = null;

                        let dataAtt = e.target.dataset;

                        if(dataAtt.row && dataAtt.col && (rowIndex != dataAtt.row || columnIndex != dataAtt.col)){
                            console.log('mouse moveing', e.target);
                                                   
                            rowIndex = Number(dataAtt.row);
                            columnIndex = Number(dataAtt.col);

                            if(that.selections[that.currentSelectionIndex] && that.selections[that.currentSelectionIndex].end){ //this needs to be considered.
                                that.selections[that.currentSelectionIndex].end.col = columnIndex;
                                that.selections[that.currentSelectionIndex].end.row = rowIndex;
                            }                               
                        }
                    }
                    else{
                        that.inDragScrolling = true;                   
                        that.onDragScroll = that.onDragScroll || setInterval(function(){      
                            console.log('setTimeInterval triggered');                       
                                switch(that.currentEqurant) {
                                    case 1:
                                        that.increase(-1, -1, that.currentEqurant);
                                        break;
                                    case 2:
                                        that.increase(-1, 0, that.currentEqurant);
                                        break;
                                    case 3:
                                        that.increase(-1, 1, that.currentEqurant);
                                        break;
                                    case 4:
                                        that.increase(0, -1, that.currentEqurant); 
                                        break;
                                    case 6:
                                        that.increase(0, 1, that.currentEqurant);
                                        break;
                                    case 7:
                                        that.increase(1, -1, that.currentEqurant);
                                        break;
                                    case 8:
                                        that.increase(1, 0, that.currentEqurant);
                                        break;
                                    case 9:
                                        that.increase(1, 1, that.currentEqurant); 
                                        break;
                                    default:
                                        console.error('equrant not found...');
                                        break;
                                }
                        }, that.scrollSpeed);                                                                                                            
                    }                   
                }

                function closeDragElement(e) {
                    console.log('cancel ----------------- interval');
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
                //source
                indexedSource: this.source.map((x,y) => Object.assign(x, {rowIndex: y })),
                //sheet meta
                sheetEl: null,
                colCount: 0,
                rowCount: 0,

                //virtual scroll
                lastVirtualPosition: 0,
                sheetHeight: 0,
                gridRect: null,
                virtualBuffer: 5, 
                     
                //drag scroll
                currentOverCell: {row: null, col: null},
                inDragScrolling: false,
                onDragScroll: null,
                scrollSpeed: 20,
                currentEqurant: 0,

                //cell selections
                selections:[],
                currentSelectionIndex: 0
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
                
                console.log('_gridtop', _gridTop);
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
           onCopy(){
document.getSelection().removeAllRanges(); 

                const copyToClipboard = str => {
                    const el = document.createElement('textarea');
                    el.value = str;
                    el.setAttribute('readonly', '');
                    el.style.position = 'absolute';
                    el.style.left = '-9999px';
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                };

               console.log('on copy on copy');
               var arr = [
                ['A', 'B', 'C'],
                ['D', 'Some\nlong\ntext', 'F'],
                ['G', 'H', 'I']
                ];
               var str = SheetClip.stringify(arr);

                copyToClipboard(str);
           },   
           increase: function(row, col, equrant){     
               console.log('qurant',equrant);          
                this.selections[this.currentSelectionIndex].end.row = this.selections[this.currentSelectionIndex].end.row + row;
                this.selections[this.currentSelectionIndex].end.col = this.selections[this.currentSelectionIndex].end.col + col;
                this.lastVirtualPosition = this.lastVirtualPosition + row * this.rowHeight;                                                           
                
                if(this.selections[this.currentSelectionIndex].end.row < 0) {
                    this.selections[this.currentSelectionIndex].end.row++;
                    this.lastVirtualPosition = this.lastVirtualPosition + this.rowHeight; 
                }
                if(this.selections[this.currentSelectionIndex].end.row > this.rowCount - 1){
                    this.selections[this.currentSelectionIndex].end.row--;
                    this.lastVirtualPosition = this.lastVirtualPosition - this.rowHeight; 
                } 
                if(this.selections[this.currentSelectionIndex].end.col < 0) {
                    this.selections[this.currentSelectionIndex].end.col++;
                }
                if(this.selections[this.currentSelectionIndex].end.col > this.colCount - 1){
                    this.selections[this.currentSelectionIndex].end.col--;
                } 
                this.sheetEl.scrollBy(col * this.columnWidth, row * this.rowHeight);
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
