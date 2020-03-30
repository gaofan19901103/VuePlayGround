<template>
  <div class="v-sheet-vessel" v-on-resize="onResize">
    <div class="v-sheet-container" tabindex="0"  @mousedown="onMouseDown($event)"  @keydown="onKeyDown($event)" @dblclick="onDblClick">
        
        <div class="v-sheet-header">
            <grid-header :columns="indexedCols" :indexed-header-rows="indexedHeaderRows" :width="sheetWidth" :selections="selections"></grid-header>
        </div>

        <!-- <div class="v-sheet-body">
            <div>
                <grid :virtual-list="virtualList" :columns="indexedFreezeCols" :grid-top="gridTop"></grid> 
            </div> -->

            <div class="v-sheet" tabindex="0"
                @scroll="onScroll($event)" 
                @contextmenu.prevent="onMenu" 
 >
                <freeze-grid :virtual-list="virtualList" :columns="indexedFreezeCols" :grid-top="gridTop" :indexed-cols="indexedCols" :indexed-rows="indexedAll" :selections="selections"></freeze-grid>  
                <grid :virtual-list="virtualList" :columns="indexedNormalCols" :grid-top="gridTop"></grid>    
                <selection-area :selections="selections" :indexed-rows="indexedAll" :indexed-cols="indexedCols"></selection-area>
                <div class="vault" :style="{ height: (rowCount - indexedHeaderRows.length) * rowHeight + 'px' }"></div>
                <cell-editor v-if="showCellEditor" :combo="cellEditCombo"></cell-editor>
            </div>
        <!-- </div> -->

        <!-- <freeze-selection-area :selections="selections" :indexed-rows="indexedAll" :indexed-cols="indexedCols"></freeze-selection-area> -->
    </div>



  </div>
</template>

<script>
  
    import Grid from './grid.component.vue';
    import GridHeader from './grid-header.component.vue';
    import SelectionArea from './selection-area.component.vue';
    import FreezeGrid from './grid-freeze.component.vue';
    import CellEditor from './cell-editor.component.vue';
    import {convertColumns, convertRows } from '../../services/sheet-data.service.js';

    export default {
        components:{
            grid: Grid,
            selectionArea: SelectionArea,
            gridHeader: GridHeader,
            freezeGrid: FreezeGrid,
            cellEditor: CellEditor
        },
        created: function(){
            // GF:Review: this method shouldn't be in this life cycle method, they need to be reactive to changes. reactive to metaData change.
            let convertedCols = convertColumns(this.meta);
            let convertedRows = convertRows(this.meta, convertedCols);

            let headerIndex = convertedRows.findIndex(x => !x.isHeader);


            this.indexedCols = convertedCols;
            this.indexedAll = convertedRows;
            this.indexedHeaderRows = convertedRows.slice(0, headerIndex);
            this.indexedRows = convertedRows.slice(headerIndex, convertedRows.length);

            let lastFreezeColIndex = convertedCols.findIndex(x => !x.freeze);
            this.indexedFreezeCols = convertedCols.slice(0, lastFreezeColIndex);
            this.indexedNormalCols = convertedCols.slice(lastFreezeColIndex, convertedCols.length);

            this.colCount = convertedCols.length;
            this.rowCount = convertedRows.length;
        },
        mounted: function(){
            this.sheetEl = this.$el.querySelector('.v-sheet');
            this.sheetHeaderEl = this.$el.querySelector('.v-sheet-header');
            this.sheetHeight = this.$el.clientHeight;
            this.gridRect = this.$el.querySelector('.v-sheet').getBoundingClientRect(); 

            // this.rowCount = Object.keys(this.meta.Rows).length;
            // this.colCount = this.meta.Columns.length;       
            
            
            this.sheetWidth = this.indexedRows[0].cells[this.colCount - 1].x + this.indexedCols[this.colCount - 1].width;
        },
        props:{
            template: {type: Object, required: true },
            meta: {type: Object, required: true }, 
            rowHeight: {type: Number, required: false, default: 20 },
            columnWidth: {type: Number, required: false, default: 90 }
        },
        data:function(){
            return{
                sheetWidth: 0,

                //meta data
                // indexedRows: Object.keys(this.meta.Rows).map((x,y) => Object.assign(this.meta.Rows[x], {rowIndex: y })),
                // indexedCols: this.meta.Columns.map((x,y) => Object.assign(x, {colIndex: y })),
                indexedAll: [],
                indexedHeaderRows: [],
                indexedRows: [],
                indexedCols: [],
                indexedFreezeCols: [],
                indexedNormalCols: [],
                //matrix: this.meta.map(x => Object.keys(x).map(y => x[y])),

                //sheet meta
                sheetEl: null,
                sheetHeaderEl: null,
                sheetHeight: 0,
                gridRect: null,
                colCount: 0,
                rowCount: 0,

                //virtual scroll
                lastVirtualPosition: 0,
                virtualBuffer: 0, 
                     
                //drag scroll
                rowIndex: null,
                columnIndex: null,
                currentOverCell: {row: null, col: null},
                isRAFLooping: false,
                onDragScroll: null,
                scrollSpeed: 20,
                currentEqurant: 0,
                lastCell: null,
                lastArea: null,
                startCell: null,

                //cell selections
                selections:[{start:{row: 0, col: 0}, end:{row: 0, col: 0}}],
                //selectionMatrix: null,
                currentSelectionIndex: 0,

                render: null,
                rafRef: null,

                //editing
                showCellEditor: false,
                cellEditCombo: null
            }   
        },
        computed:{         
            virtualList: function(){ //depends on lastVirtualPostion, sheetHeight, rowHeight, virtualBuffer.
                if(!this.sheetHeight) return[];
                let visibleRowCount = Math.ceil(this.sheetHeight / this.rowHeight);
                let scrolledRowCount = Math.floor(this.lastVirtualPosition / this.rowHeight);          
                let startIndex = scrolledRowCount  - this.virtualBuffer < 0 ? 0 : scrolledRowCount  - this.virtualBuffer;   
                let endIndex = startIndex + visibleRowCount + this.virtualBuffer * 2;                      
                let result = this.indexedRows.slice(startIndex, endIndex);

                // if(result[0].rowIndex != 0){
                //     result.unshift(this.headerRow);
                // }

                console.log('virtual list',result);
                return result;
            },
            gridTop: function(){ //depends on lastVirtualPostion
                let _gridTop = (this.lastVirtualPosition - this.virtualBuffer * this.rowHeight) < 0 ? 0 : (this.lastVirtualPosition - this.virtualBuffer * this.rowHeight);
                _gridTop = _gridTop - (_gridTop % this.rowHeight); 
                return _gridTop;
            }  
        },

        watch:{
           
        },
        methods:{
           onScroll: function(e){
              this.showCellEditor = false;
              this.sheetHeaderEl.scrollLeft = this.sheetEl.scrollLeft;

              console.log('isDragingScroll -->', this.isRAFLooping);
              if(this.isRAFLooping) return;
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
           copyCurrentSelection(){
                let timerBefore = performance.now();

                let tlX = Math.min(Number(this.selections[this.currentSelectionIndex].start.col), Number(this.selections[this.currentSelectionIndex].end.col));
                let tlY = Math.min(Number(this.selections[this.currentSelectionIndex].start.row), Number(this.selections[this.currentSelectionIndex].end.row));
                let brX = Math.max(Number(this.selections[this.currentSelectionIndex].start.col), Number(this.selections[this.currentSelectionIndex].end.col));
                let brY = Math.max(Number(this.selections[this.currentSelectionIndex].start.row), Number(this.selections[this.currentSelectionIndex].end.row));

                let valueMatrix = this.indexedAll.map(x => Object.keys(x.cells).map(y => x.cells[y].value));

                let twoD = valueMatrix.slice(tlY, brY + 1);
                twoD = twoD.map(x => x.slice(tlX, brX + 1));;
                let content = this.buildString(twoD);
                Portal.Utils.copyToClipboard(content);

                let timerAfter = performance.now();
                console.info(`copy used ${Math.ceil(timerAfter - timerBefore)} milliseconds`);
           },   
           moveSelection: function(rowIncrement, colIncrement, scroll = true, check = false){
                this.selections[this.currentSelectionIndex].end.row = this.selections[this.currentSelectionIndex].end.row + rowIncrement;
                this.selections[this.currentSelectionIndex].end.col = this.selections[this.currentSelectionIndex].end.col + colIncrement;


                if(scroll){
                // this.lastVirtualPosition = this.lastVirtualPosition + (rowIncrement * this.rowHeight); 
                    if(check){
                        if(!this.isCellInView(this.selections[this.currentSelectionIndex].end.row, this.selections[this.currentSelectionIndex].end.col)){
                            this.lastVirtualPosition = this.lastVirtualPosition + (rowIncrement * this.rowHeight); 
                            this.sheetEl.scrollBy(colIncrement * this.columnWidth, rowIncrement * this.rowHeight);
                        }
                    }

                    else{
                        this.lastVirtualPosition = this.lastVirtualPosition + (rowIncrement * this.rowHeight); 
                        this.sheetEl.scrollBy(colIncrement * this.columnWidth, rowIncrement * this.rowHeight);
                    }
                } 
                

                                                                        
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

                this.selections[this.currentSelectionIndex].start.row = this.selections[this.currentSelectionIndex].end.row;
                this.selections[this.currentSelectionIndex].start.col = this.selections[this.currentSelectionIndex].end.col;
                

                //if(scroll) this.sheetEl.scrollBy(colIncrement * this.columnWidth, rowIncrement * this.rowHeight);
           },
           expandSelection: function(rowIncrement, colIncrement, scroll = true, check = false){              
                this.selections[this.currentSelectionIndex].end.row = this.selections[this.currentSelectionIndex].end.row + rowIncrement;
                this.selections[this.currentSelectionIndex].end.col = this.selections[this.currentSelectionIndex].end.col + colIncrement;
                if(scroll){
                   // this.lastVirtualPosition = this.lastVirtualPosition + (rowIncrement * this.rowHeight); 
                    if(check){
                        if(!this.isCellInView(this.selections[this.currentSelectionIndex].end.row, this.selections[this.currentSelectionIndex].end.col)){
                            this.lastVirtualPosition = this.lastVirtualPosition + (rowIncrement * this.rowHeight); 
                            this.sheetEl.scrollBy(colIncrement * this.columnWidth, rowIncrement * this.rowHeight);
                        }
                    }
                    else{
                        this.lastVirtualPosition = this.lastVirtualPosition + (rowIncrement * this.rowHeight); 
                        this.sheetEl.scrollBy(colIncrement * this.columnWidth, rowIncrement * this.rowHeight);
                    }
                }                                                          
                
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

                // if(scroll){
                //     this.sheetEl.scrollBy(colIncrement * this.columnWidth, rowIncrement * this.rowHeight);
                // //     let x = () => { this.sheetEl.scrollBy(colIncrement * this.columnWidth, rowIncrement * this.rowHeight); }
                // //     x = x.bind(this);
                // //    setTimeout(x) ; 
                // } 
           },
           buildString: function(twoDArray, withStyle){
               const tab = '\t';
               const lb = '\n';

               if(withStyle)
                    return '';//build up <table> with style getting from css variables. 
               else
                    return twoDArray.reduce((a,b) => `${a}${b.reduce((c,d) =>`${c}${tab}${d}`)}${lb}`,'');
           },
           rafLoop: function(){
               this.rafRef = requestAnimationFrame(this.rafLoop);
               this.render();
           },
           isCellInView: function(row, column){
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

                // let isOut = this.gridRect.top > cellRect.top ||
                //             this.gridRect.top + this.gridRect.height < cellRect.top + cellRect.height ||
                //             this.gridRect.left > cellRect.left || 
                //             this.gridRect.left + this.gridRect.width < cellRect.left + cellRect.width;

                let isOut = this.gridRect.top > cellRect.top ||
                this.gridRect.top + this.gridRect.height < cellRect.top + cellRect.height ||
                (this.gridRect.left + this.indexedFreezeCols[this.indexedFreezeCols.length - 1].x) > cellRect.left ||  //GF:Review: this is to offset the freeze.
                this.gridRect.left + this.gridRect.width < cellRect.left + cellRect.width;

                return !isOut;
           },
           isCellIndexWithinRange: function(row, column){
               return row >=0 && row < this.rowCount && column >= 0 && column < this.colCount;
           },
           getCurrentArea:function(currentCell){
               if(currentCell.dataset.header){
                   return 'header';
               }
               else if(currentCell.dataset.freeze){
                   return 'freeze';
               }
               else{
                   return 'body';
               }
           },
           onMenu: function(event){
               // put menu here if needed.
           },
           onKeyDown: function(event){

                if(event.repeat && this.isRAFLooping){
                    return;
                } 

                if (event.ctrlKey  &&  event.key === "c") { 
                    event.preventDefault();

                    this.copyCurrentSelection(); 
                }

                if (event.ctrlKey  &&  event.key === "a") { 
                    event.preventDefault();

                    this.currentSelectionIndex = 0;
                    this.selections.splice(1);
                    this.selections[0].start.row = 0;
                    this.selections[0].start.col = 0;
                    this.selections[0].end.row = this.rowCount - 1;
                    this.selections[0].end.col = this.colCount - 1;
                }

                if (event.key.startsWith('Arrow')) {   
                    event.preventDefault();
                    this.showCellEditor = false;

                    if(event.key == 'ArrowUp'){
                        if(event.shiftKey){
                            this.render = () => { this.expandSelection(-1, 0, true, true); };
                        }  
                        else{
                            this.render = () => { this.moveSelection(-1, 0, true, true); };
                        }  
                    } 
                    else if(event.key == 'ArrowDown'){
                        if(event.shiftKey){
                            this.render = () => { this.expandSelection(1, 0, true, true); };
                        }  
                        else{
                            this.render = () => { this.moveSelection(1, 0, true, true); };
                        }
                    } 
                    else if(event.key == 'ArrowLeft'){
                        if(event.shiftKey){
                            this.render = () => { this.expandSelection(0, -1, true, true); };
                        }  
                        else{
                            this.render = () => { this.moveSelection(0, -1, true, true); };
                        } 
                    } 
                    else if(event.key == 'ArrowRight'){
                        if(event.shiftKey){
                            this.render = () => { this.expandSelection(0, 1, true, true); };
                        }  
                        else{
                            this.render = () => { this.moveSelection(0, 1, true, true); };
                        } 
                    } 
                    else{
                        throw 'key not found...'; 
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
                cancelAnimationFrame(this.rafRef);
                this.rafRef = null;

                this.isRAFLooping = false;

                document.onkeyup = null;
           },
           onMouseDown:  function (e) {
                let that = this;
                var rowIndex = null;
                var columnIndex = null;
                                                
                if(e.which == 3) return;
                
                this.gridRect = this.sheetEl.getBoundingClientRect();
                let dataSet = e.target.dataset;
                if(dataSet.row == undefined || dataSet.col == undefined){
                    //console.error('which cell is it???');
                    return;
                } 

                this.rowIndex = Number(dataSet.row);
                this.columnIndex = Number(dataSet.col);
                console.log('mouse down', this.rowIndex, this.columnIndex);                   

                if (e.which == 1) {
                    this.showCellEditor = false;

                    if(e.shiftKey){
                        e.preventDefault();
                        this.selections[this.currentSelectionIndex].end.row = this.rowIndex;
                        this.selections[this.currentSelectionIndex].end.col = this.columnIndex;
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

                        this.selections[this.currentSelectionIndex].start.row = this.rowIndex;
                        this.selections[this.currentSelectionIndex].start.col = this.columnIndex;
                        this.selections[this.currentSelectionIndex].end.row = this.rowIndex;
                        this.selections[this.currentSelectionIndex].end.col = this.columnIndex;
                    }
                            
                    this.startCell = e.target;                            
                    document.onmousemove = this.onMouseMove;
                }
                
                document.onmouseup = this.onEndDarg;                                             
            },
            onMouseMove: function(e){

                e.preventDefault();

                let currentCell = e.target;
               // let lastCell = this.lastCell;
                
                
                if(this.startCell && this.startCell.dataset.header && !currentCell.dataset.header && !this.isRAFLooping){
                    this.sheetEl.scrollTo(this.sheetEl.scrollLeft, 0);
                }
                else if(this.startCell && this.startCell.dataset.freeze && !currentCell.dataset.freeze && !this.isRAFLooping){
                    this.sheetEl.scrollTo(0, this.sheetEl.scrollTop);
                }
                

                //this.lastArea = this.getCurrentArea(currentCell);
                

                // if((!this.lastCell || this.lastCell.dataset.header) && currentCell.dataset.header){
                //     this.currentEqurant = 5;
                //     this.lastCell = currentCell;
                // }
                // else if(this.lastCell && !this.lastCell.dataset.header && currentCell.dataset.header){
                //     this.currentEqurant = 2;
                //     this.lastCell = lastCell;
                // }
                // else{
                //     this.currentEqurant = Portal.Utils.getMouseEqurant(e.clientX, e.clientY, this.gridRect, currentCell); 
                //     this.lastCell = currentCell;
                // }

                

                // if((!this.lastCell || this.lastCell.dataset.header) && currentCell.dataset.header){
                //     this.currentEqurant = 5;
                // }
                // else{
                //      this.currentEqurant = Portal.Utils.getMouseEqurant(e.clientX, e.clientY, this.gridRect);
                //      this.lastCell = currentCell;
                // }
 
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
                    this.currentEqurant = Portal.Utils.getMouseEqurant(e.clientX, e.clientY, this.gridRect);
                }
                
                this.lastCell = currentCell;
                

                console.log('--------------equrant',  this.currentEqurant);
                if(this.currentEqurant == 5){
                    console.log('cancel ----------------- interval');

                    cancelAnimationFrame(this.rafRef);
                    this.rafRef = null;
                    this.isRAFLooping = false;


                    let dataSet = currentCell.dataset;


                    if(dataSet.row && dataSet.col && (this.rowIndex != dataSet.row || this.columnIndex != dataSet.col)){
                        console.log('mouse moveing', currentCell);
                                                
                        this.rowIndex = Number(dataSet.row);
                        this.columnIndex = Number(dataSet.col);

                        if(this.selections[this.currentSelectionIndex] && this.selections[this.currentSelectionIndex].end){ //this needs to be considered.
                            this.selections[this.currentSelectionIndex].end.col = this.columnIndex;
                            this.selections[this.currentSelectionIndex].end.row = this.rowIndex;
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
                            console.error('equrant not found...');
                            break;
                    }

                    if(!this.rafRef)
                        this.rafLoop();
                }                                
            },
            onEndDarg: function(e){
                console.log('cancel ----------------- interval');

                this.isRAFLooping = false; 
                cancelAnimationFrame(this.rafRef);
                this.rafRef = null;
                document.onmouseup = null;
                document.onmousemove = null;
            },
            onDblClick: function(event){
                console.log('double click');

                this.showCellEditor = true;

                let row = event.target.dataset.row;
                let col = event.target.dataset.col;

                this.cellEditCombo = {
                    value: this.indexedAll[row].cells[col].value,
                    style:{
                        top: (this.indexedAll[row].cells[col].y - 20) + 'px',
                        left: this.indexedAll[row].cells[col].x + 'px',
                        height: this.rowHeight + 'px',
                        width: this.indexedCols[col].width + 'px'
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
            --vault-height: 0px;
            --sheet-scroller-size: 10px;

            transform: rotate(0deg); // this is import for fixed positioned element.

            position: relative;
            height: 100%;
            width: 100%;       
            outline: none;
            
            font-size: var(--sheet-font-size);
            background-color: var(--sheet-background-color);
            color: var(--sheet-font-color);

            .v-sheet-header{
                background-color: aquamarine;
                width: calc(100% - var(--sheet-scroller-size)); // don't always minus this 10px, if there is no scroller no need, but I havn't checked it yet.
                height: 20px;  // GF:Review: should be dynamic, variable.
                overflow: auto;

                &::-webkit-scrollbar {
                    height: 0px;
                }
                
                // &::-webkit-scrollbar-track {
                //     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
                //     border-radius: 1px;
                // }
                
                // &::-webkit-scrollbar-thumb {
                //     border-radius: 1px;
                //     -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
                // }
            }

            .v-sheet{
                    //transform: rotate(0deg); // this is import for fixed positioned element.

                display: flex;
                outline: none;
                position: relative;
                height: calc(100% - 20px); 
                width: 100%;
                overflow: auto;

                .vault{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 1px;
                    height: var(--vault-height);            
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

            // .v-sheet-body{
            //     display: flex;
            //     height: calc(100% - 20px); // GF:Review: 20 should be header height variable.

            //     .v-sheet{
            //         //transform: rotate(0deg); // this is import for fixed positioned element.

            //         outline: none;
            //         position: relative;
            //         height: 100%; 
            //         width: 100%;
            //         overflow: auto;

            //         .vault{
            //             position: absolute;
            //             top: 0;
            //             left: 0;
            //             width: 1px;
            //             height: var(--vault-height);            
            //         } 
                    
            //         &::-webkit-scrollbar {
            //             width: var(--sheet-scroller-size);
            //             height: var(--sheet-scroller-size);
            //         }

                
            //         &::-webkit-scrollbar-track {
            //             -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
            //             border-radius: 10px;
            //         }
                    
            //         &::-webkit-scrollbar-thumb {
            //             border-radius: 10px;
            //             -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
            //         }
            //     }                                                
            // }       
        }
    }
</style>
