<template>
  <div class="v-sheet-vessel" v-on-resize="onResize">
    <div class="v-sheet-container" tabindex="0"  @mousedown="onMouseDown($event)"  @keydown="onKeyDown($event)" @dblclick="onDblClick">
        
        <div class="v-sheet-header" ref="sheetHeader" v-if="!!headerRowCount">
            <grid-header :meta-columns="metaColumns" :meta-rows="metaRows" :header-rows="headerRows" :selections="selections" :header-row-count="headerRowCount" :freeze-col-count="freezeColCount"></grid-header>
        </div>

        <div class="v-sheet" ref="sheet"
            @scroll="onScroll($event)" 
            @contextmenu.prevent="onMenu">
            <!-- <freeze-grid :rows="virtualScrollList" :columns="freezeCols" :offset-top="offsetTop" :indexed-cols="metaColumns" :indexed-rows="metaRows" :header-rows="headerRows" :selections="selections" :freeze-col-count="freezeColCount"></freeze-grid>   -->
            <grid :rows="virtualScrollList" :meta-columns="metaColumns" :offset-top="offsetTop"></grid>    
            <selection-area :selections="selections" :meta-rows="metaRows" :meta-columns="metaColumns" :header-rows="headerRows" :freeze-col-count="freezeColCount"></selection-area>
            <div class="vault" :style="{ height: (rowCount - headerRowCount) * rowHeight + 'px' }"></div>
            <cell-editor v-if="showCellEditor" :combo="cellEditCombo" v-on:hide-cell-editor="setValue"></cell-editor>
        </div>
    </div>
  </div>
</template>

<script>
  
    import Grid from './grid.component.vue';
    import GridHeader from './grid-header.component.vue';
    import SelectionArea from './selection-area.component.vue';
    import CellEditor from './cell-editor.component.vue';

    export default {
        components:{
            grid: Grid,
            selectionArea: SelectionArea,
            gridHeader: GridHeader,
            cellEditor: CellEditor
        },
        created: function(){

        },
        mounted: function(){      
            this.sheetEl = this.$refs.sheet;
            this.sheetHeaderEl = this.$refs.sheetHeader;
            
            //GF:Review - only static data should be populated this way, which will not change within the lifecycle of a sheet component, but I made an exception for sheetRect for now.
            this.sheetRect = this.sheetEl.getBoundingClientRect(); 
            
        },
        props:{
            metaRows: {type: Array, required: false, default: []},
            metaColumns: {type: Array, required: false, default: []},
            headerColumns: {type: Array, required: false, default: null }, //GF:Review - for merge cell header.
            rowHeight: {type: Number, required: false, default: 20 } //GF:Review - now I'm assuming all rows have same height in sheet-body, possible to change, but you need to change how you scroll and the virtual list calculation.
        },
        data:function(){
            return{
                //sheet meta
                sheetEl: null,
                sheetHeaderEl: null,
                sheetRect: null,

                //for virtual scroller
                lastVirtualPosition: 0,
                virtualBuffer: 0, //GF:Review - I need to think about the potential issues.
                     
                //for raf
                currentRowIndex: null,
                currentColumnIndex: null,
                currentEqurant: 0,
                isRAFLooping: false,
                startCell: null,
                render: null,
                rafRef: null,

                //for cell selections
                selections:[{start:{row: 0, col: 0}, end:{row: 0, col: 0}}],
                currentSelectionIndex: 0,

                //for cell edit
                showCellEditor: false,
                cellEditCombo: null
            }   
        },
        computed:{         
            colCount: function(){ 
                return this.metaColumns.length;
            },
            rowCount: function(){
                return this.metaRows.length;
            },  
            headerRowCount: function(){
                return this.metaRows.findIndex(x => !x.isHeader);
            },
            freezeColCount: function(){
                return this.metaColumns.findIndex(x => !x.freeze);
            },
            headerRows: function(){
                return this.metaRows.slice(0, this.headerRowCount);
            },
            bodyRows: function(){
                return this.metaRows.slice(this.headerRowCount, this.rowCount);
            },
            freezeCols: function(){
                return this.metaColumns.slice(0, this.freezeColCount);
            },
            bodyCols: function(){
                return this.metaColumns.slice(this.freezeColCount, this.colCount);
            },
            virtualScrollList: function(){ //depends on bodyRows, lastVirtualPostion, sheetRect, rowHeight, virtualBuffer.
                if(!this.sheetRect) return[];

                let visibleRowCount = Math.ceil(this.sheetRect.height / this.rowHeight);
                let scrolledRowCount = Math.floor(this.lastVirtualPosition / this.rowHeight);          
                let startIndex = scrolledRowCount  - this.virtualBuffer < 0 ? 0 : scrolledRowCount  - this.virtualBuffer;   
                let endIndex = startIndex + visibleRowCount + this.virtualBuffer * 2;     

                let resultList = this.bodyRows.slice(startIndex, endIndex);

                console.debug('current virtual scroll list computed: ', resultList);
                return resultList;
            },
            offsetTop: function(){ //depends on lastVirtualPostion
                let offset = (this.lastVirtualPosition - this.virtualBuffer * this.rowHeight) < 0 ? 0 : (this.lastVirtualPosition - this.virtualBuffer * this.rowHeight);
                let residual = offset % this.rowHeight; 
                return offset - residual;
            }  
        },
        watch:{
           //GF:Review - I'm thinking to move some of the calculations here to reduce the vue re-activity chain, would it be a good idea ?
        },
        methods:{ 
           copyCurrentSelection(){
                let timerBefore = performance.now();

                //tl: top-left,  br: bottom-left
                let tlX = Math.min(Number(this.selections[this.currentSelectionIndex].start.col), Number(this.selections[this.currentSelectionIndex].end.col));
                let tlY = Math.min(Number(this.selections[this.currentSelectionIndex].start.row), Number(this.selections[this.currentSelectionIndex].end.row));
                let brX = Math.max(Number(this.selections[this.currentSelectionIndex].start.col), Number(this.selections[this.currentSelectionIndex].end.col));
                let brY = Math.max(Number(this.selections[this.currentSelectionIndex].start.row), Number(this.selections[this.currentSelectionIndex].end.row));

                let valueMatrix = this.metaRows.map(x => Object.keys(x.cells).map(y => x.cells[y].value));
                valueMatrix = valueMatrix.slice(tlY, brY + 1);
                valueMatrix = valueMatrix.map(x => x.slice(tlX, brX + 1));

                let content = this.buildCopyContent(valueMatrix);
                Portal.Utils.Sheet.copyToClipboard(content);

                let timerAfter = performance.now();

                console.info(`copy used ${Math.ceil(timerAfter - timerBefore)} milliseconds`);
           },   
           expandSelection: function(rowIncrement, colIncrement, moveCell = false, scroll = true, check = false){     
                let incrementedRow = this.selections[this.currentSelectionIndex].end.row + rowIncrement;
                let incrementedCol = this.selections[this.currentSelectionIndex].end.col + colIncrement;
                this.selections[this.currentSelectionIndex].end.row = incrementedRow;
                this.selections[this.currentSelectionIndex].end.col = incrementedCol;
                if(scroll){
                   // this.lastVirtualPosition = this.lastVirtualPosition + (rowIncrement * this.rowHeight); 
                    if(check){
                        if(!this.isCellInView(this.selections[this.currentSelectionIndex].end.row, this.selections[this.currentSelectionIndex].end.col)){
                            this.lastVirtualPosition = this.lastVirtualPosition + (rowIncrement * this.rowHeight); 
                            let verticalScroll = colIncrement * (this.metaColumns[incrementedCol] && this.metaColumns[incrementedCol].width || 0);
                            let horizontalScroll = rowIncrement * this.rowHeight;
                            this.sheetEl.scrollBy(verticalScroll, horizontalScroll);
                        }
                    }
                    else{
                        this.lastVirtualPosition = this.lastVirtualPosition + (rowIncrement * this.rowHeight); 
                        let verticalScroll = colIncrement * (this.metaColumns[incrementedCol] && this.metaColumns[incrementedCol].width || 0);
                        let horizontalScroll = rowIncrement * this.rowHeight;
                        this.sheetEl.scrollBy(verticalScroll, horizontalScroll);
                    }
                }                                                          
                
                if(incrementedRow < 0) {
                    this.selections[this.currentSelectionIndex].end.row++;
                    this.lastVirtualPosition = this.lastVirtualPosition + this.rowHeight; 
                }
                if(incrementedRow > this.rowCount - 1){
                    this.selections[this.currentSelectionIndex].end.row--;
                    this.lastVirtualPosition = this.lastVirtualPosition - this.rowHeight; 
                } 
                if(incrementedCol < 0) {
                    this.selections[this.currentSelectionIndex].end.col++;
                }
                if(incrementedCol > this.colCount - 1){
                    this.selections[this.currentSelectionIndex].end.col--;
                } 

                if(moveCell){
                    this.selections[this.currentSelectionIndex].start.row = this.selections[this.currentSelectionIndex].end.row;
                    this.selections[this.currentSelectionIndex].start.col = this.selections[this.currentSelectionIndex].end.col;
                }

                // if(scroll){
                //     this.sheetEl.scrollBy(colIncrement * this.columnWidth, rowIncrement * this.rowHeight);
                // //     let x = () => { this.sheetEl.scrollBy(colIncrement * this.columnWidth, rowIncrement * this.rowHeight); }
                // //     x = x.bind(this);
                // //    setTimeout(x) ; 
                // } 
           },
           buildCopyContent: function(twoDArray, withStyle){
               const tab = '\t';
               const lb = '\n';

               if(withStyle)
                    return ''; //GF:Review - build up <table> with style getting from css.
               else
                    return twoDArray.reduce((a,b) => `${a}${b.reduce((c,d) =>`${c}${tab}${d}`)}${lb}`,'');
           },
           rafLoop: function(){
               this.rafRef = requestAnimationFrame(this.rafLoop);
               this.render();
           },
           resetRaf: function(){
                cancelAnimationFrame(this.rafRef);
                this.rafRef = null;
                this.isRAFLooping = false;

                console.debug('raf loop canceled.');
           },
           scrollToCell(rowIndex, colIndex){
               //GF:Review - this never used, but it will be useful.
               this.sheetEl.scrollTo(this.metaColumns[colIndex].x, this.metaRows[rowIndex].y); 
           },
           isCellInView: function(row, column){
               //GF:Review: there is an issue here with keyboard arrow keys, moving from normal to header then continue naviate with right or left key.
                let nextCell = this.sheetEl.querySelector(`[data-row="${row}"][data-col="${column}"]`);

                if(this.startCell && this.startCell.dataset.header && (!nextCell || !nextCell.dataset.header) && !this.isRAFLooping){
                    this.sheetEl.scrollTo(this.sheetEl.scrollLeft, 0);
                    //GF:Review: later it scrolled by 20 again, need to prevent that... find a good way.
                }
                else if(this.startCell && this.startCell.dataset.freeze && !nextCell.dataset.freeze && !this.isRAFLooping){
                    this.sheetEl.scrollTo(0, this.sheetEl.scrollTop);
                }
                
                if(!nextCell){
                    console.log('no such cell');
                    return false;
                } 

                let cellRect = nextCell && nextCell.getBoundingClientRect();

                //GF:Reivew - the comment area is the one to use, but think about the freeze col and header...

                // let isOut = this.sheetRect.top > cellRect.top ||
                //             this.sheetRect.top + this.sheetRect.height < cellRect.top + cellRect.height ||
                //             this.sheetRect.left > cellRect.left || 
                //             this.sheetRect.left + this.sheetRect.width < cellRect.left + cellRect.width;

                let isOut = this.sheetRect.top > cellRect.top ||
                this.sheetRect.top + this.sheetRect.height < cellRect.top + cellRect.height ||
                //this.sheetRect.left > cellRect.left ||
                (this.sheetRect.left + this.freezeCols[this.freezeColCount - 1].x) > cellRect.left ||  //GF:Review: this is to offset the freeze.
                this.sheetRect.left + this.sheetRect.width < cellRect.left + cellRect.width;

                return !isOut;
           },
           isCellIndexWithinRange: function(row, column){
               return row >=0 && row < this.rowCount && column >= 0 && column < this.colCount;
           },
            hideCellEditor: function(){
                this.showCellEditor = false;
            },
            setValue: function(valueObj){
                this.metaRows[valueObj.row].cells[valueObj.col].value = valueObj.newValue;
                this.$root.$emit('sheet-data-changed', 'input sheet', [valueObj]);
            },

           //events-----------------------------------------------------------------------------  
           onScroll: function(e){
              this.showCellEditor = false;
              this.sheetHeaderEl.scrollLeft = this.sheetEl.scrollLeft;

              console.debug('on scroll, and RAFLopping: ', this.isRAFLooping);

              if(this.isRAFLooping) return;
              if(Math.abs(e.target.scrollTop -  this.lastVirtualPosition) > this.virtualBuffer * this.rowHeight){
                    console.debug('change lastVirtualPosition: ', e.target.scrollTop);
                    this.lastVirtualPosition = e.target.scrollTop;              
              }
           },
           onResize: function(){
               //GF:Review - there is one pending thing I need to do - scroll to bottom and resize.
               console.debug('the v-sheet-vessel resized');
               this.sheetRect = this.$refs.sheet.getBoundingClientRect();
           },  
           onMenu: function(event){
               // GF:Reivew- todo : put menu here if needed.
           },
           onKeyDown: function(event){
                if(!this.showCellEditor)
                    event.preventDefault();

                if(event.repeat && this.isRAFLooping){
                    return;
                } 

                if (event.ctrlKey  &&  event.key === "c") { 
                    this.copyCurrentSelection(); 
                }

                if (event.ctrlKey  &&  event.key === "a") { 
                    //GF:Review - ToDo: select all then use arrow key, fix it, use scroll to view.
                    this.currentSelectionIndex = 0;
                    this.selections.splice(1);
                    this.selections[0].start.row = 0;
                    this.selections[0].start.col = 0;
                    this.selections[0].end.row = this.rowCount - 1;
                    this.selections[0].end.col = this.colCount - 1;
                }

                if (event.key && event.key.startsWith('Arrow')) {   
                    this.showCellEditor = false;

                    if(event.key == 'ArrowUp'){
                        this.render = () => { this.expandSelection(-1, 0, !event.shiftKey, true, true); };
                    } 
                    else if(event.key == 'ArrowDown'){
                        this.render = () => { this.expandSelection(1, 0, !event.shiftKey, true, true); };
                    } 
                    else if(event.key == 'ArrowLeft'){
                        this.render = () => { this.expandSelection(0, -1, !event.shiftKey, true, true); };
                    } 
                    else if(event.key == 'ArrowRight'){
                        this.render = () => { this.expandSelection(0, 1, !event.shiftKey, true, true); };
                    } 

                    if(event.repeat && !this.isRAFLooping){
                        document.onkeyup = this.onKeyUp;
                        this.isRAFLooping= true;
                        this.rafLoop();
                    }
                    else{
                        this.render();
                    }                       
                }
           },
           onKeyUp: function(){
                this.resetRaf();
                document.onkeyup = null;
           },
           onMouseDown:  function (e) {
                        
                if(e.which == 3) return;
                
                this.sheetRect = this.sheetEl.getBoundingClientRect();
                let dataSet = e.target.dataset;
                if(dataSet.row == undefined || dataSet.col == undefined){
                    throw 'which cell is it???';
                } 

                this.currentRowIndex = Number(dataSet.row);
                this.currentColumnIndex = Number(dataSet.col);
                console.log('mouse down', this.currentRowIndex, this.currentColumnIndex);                   

                if (e.which == 1) {
                    this.showCellEditor = false;

                    if(e.shiftKey){
                        e.preventDefault();
                        this.selections[this.currentSelectionIndex].end.row = this.currentRowIndex;
                        this.selections[this.currentSelectionIndex].end.col = this.currentColumnIndex;
                    }
                    else{
                        if(e.ctrlKey){
                            this.currentSelectionIndex++;
                            this.selections = this.selections.concat([{start:{row: 0, col: 0}, end:{row: 0, col: 0}}]);
                        }
                        else{
                            this.selections.splice(1);
                            this.currentSelectionIndex = 0;
                        }

                        this.selections[this.currentSelectionIndex].start.row = this.currentRowIndex;
                        this.selections[this.currentSelectionIndex].start.col = this.currentColumnIndex;
                        this.selections[this.currentSelectionIndex].end.row = this.currentRowIndex;
                        this.selections[this.currentSelectionIndex].end.col = this.currentColumnIndex;
                    }
                            
                    this.startCell = e.target;                            
                    document.onmousemove = this.onMouseMove;
                }
                
                document.onmouseup = this.onEndDarg;                                             
            },
            onMouseMove: function(e){
                e.preventDefault();

                let currentCell = e.target;
                
                if(this.startCell && this.startCell.dataset.header && !currentCell.dataset.header && !this.isRAFLooping){
                    this.sheetEl.scrollTo(this.sheetEl.scrollLeft, 0);
                }
                else if(this.startCell && this.startCell.dataset.freeze && !currentCell.dataset.freeze && !this.isRAFLooping){
                    this.sheetEl.scrollTo(0, this.sheetEl.scrollTop);
                }
                
                if(this.startCell && this.startCell.dataset.header && currentCell.dataset.header){
                    this.currentEqurant = 5;
                }
                else if(this.startCell && !this.startCell.dataset.header && currentCell.dataset.header && this.sheetEl.scrollTop == 0){
                    this.currentEqurant = 5;
                }
                else if(this.startCell && !this.startCell.dataset.freeze && currentCell.dataset.freeze && this.sheetEl.scrollLeft > 0){
                    this.currentEqurant = 4;
                }
                else{
                    this.currentEqurant = Portal.Utils.Sheet.getMouseEqurant(e.clientX, e.clientY, this.sheetRect);
                }       

                console.debug('current equrant: ',  this.currentEqurant);
                if(this.currentEqurant == 5){
                    this.resetRaf();

                    let dataSet = currentCell.dataset;

                    if(dataSet.row && dataSet.col && (this.currentRowIndex != dataSet.row || this.currentColumnIndex != dataSet.col)){
                        console.debug('mouse moveing to cell: ', currentCell);
                                                
                        this.currentRowIndex = Number(dataSet.row);
                        this.currentColumnIndex = Number(dataSet.col);

                        if(this.selections[this.currentSelectionIndex] && this.selections[this.currentSelectionIndex].end){ //this needs to be considered.
                            this.selections[this.currentSelectionIndex].end.col = this.currentColumnIndex;
                            this.selections[this.currentSelectionIndex].end.row = this.currentRowIndex;
                        }                               
                    }
                }
                else{
                    this.isRAFLooping = true;                                         
                    switch(this.currentEqurant) {
                        case 1:
                            this.render = () => { this.expandSelection(-1, -1); };
                            break;
                        case 2:
                            this.render = () => { this.expandSelection(-1, 0); };
                            break;
                        case 3:
                            this.render = () => { this.expandSelection(-1, 1); };
                            break;
                        case 4:
                            this.render = () => { this.expandSelection(0, -1); }; 
                            break;
                        case 6:
                            this.render = () => { this.expandSelection(0, 1); };
                            break;
                        case 7:
                            this.render = () => { this.expandSelection(1, -1); };
                            break;
                        case 8:
                            this.render = () => { this.expandSelection(1, 0); };
                            break;
                        case 9:
                            this.render = () => { this.expandSelection(1, 1); }; 
                            break;
                        default:
                            throw 'equrant not found...';
                            break;
                    }

                    if(!this.rafRef)
                        this.rafLoop();
                }                                
            },
            onEndDarg: function(e){
                this.resetRaf();
                document.onmouseup = null;
                document.onmousemove = null;
            },
            onDblClick: function(event){
                console.log('double click');

                this.showCellEditor = true;

                let row = event.target.dataset.row;
                let col = event.target.dataset.col;

                this.cellEditCombo = {
                    row: row,
                    col: col,
                    cell: this.metaRows[row].cells[col],
                    value: this.metaRows[row].cells[col].value,
                    style:{
                        top: (this.metaRows[row].cells[col].y - 20) + 'px',
                        left: this.metaRows[row].cells[col].x + 'px',
                        height: this.rowHeight + 'px',
                        width: this.metaColumns[col].width + 'px'
                    }
                };
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
        
        .v-sheet-container{        
            --sheet-font-color: black;
            --sheet-font-size: 12px;
            --sheet-background-color: transparent;
            --sheet-scroller-size: 10px;

            transform: rotate(0deg); // GF:Review - this is being used by grid-header, area on top position fixed reference this, change it.

            position: relative;
            height: 100%;
            width: 100%;       
            outline: none;
            
            font-size: var(--sheet-font-size);
            background-color: var(--sheet-background-color);
            color: var(--sheet-font-color);

            .v-sheet-header{
                --sheet-background-color: green;
                --sheet-header-height: 0px;

                background-color: var(--sheet-background-color);
                width: calc(100% - var(--sheet-scroller-size)); // GF:Reivew - if there is not enough metaRows to show a scroller, the deduction is not needed.
                height: 20px;  // GF:Review: should be dynamic, variable.
                overflow: auto;

                &::-webkit-scrollbar {
                    height: 0px;
                    width: 0px;
                }
            }

            .v-sheet{
                display: flex;
                position: relative;
                height: calc(100% - 20px); 
                width: 100%;
                overflow: auto;

                .vault{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 1px;            
                } 
                
                &::-webkit-scrollbar {
                    width: var(--sheet-scroller-size);
                    height: var(--sheet-scroller-size);
                }      

                &::-webkit-scrollbar-track {
                    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
                    border-radius: 10px;
                }
                
                &::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
                }
            }    
        }
    }
</style>
