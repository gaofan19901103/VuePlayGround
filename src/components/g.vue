<template>
  <div>
    <div>something else you want to put here</div>
    <div class="grid">
        <div class="vessel">
            <div  class="row" v-for="(item, row_index) in scrollList" v-bind:key="item.key">
                <div v-for="(col, col_index) in Object.keys(item)" v-bind:key="col" class="column cell" :data-col="col_index" :data-row="row_index">
                   {{item[col]}} 
                </div>
            </div>
        </div>
        <div class="selection-area"></div>
    </div>
    <button v-on:click="test('gf')">test</button>
    <button v-on:click="clear('gf')">clear</button>
  </div>
</template>

<script>
    class column{
        constructor(id, name, type, sortable, style){
            this.id = id;
            this.name = name;
            this.type = type;
            this.sortable = sortable;
            this.style = style;
        }
    }

    var selectionArea = null;
    var ctx = null;

    export default {
        created: function(){
            let x = 0;
        },
        beforeMount: function(){
            let x = 0;
        },
        mounting: function(){
            let x = 0;
        },
        mounted: function(){
            let that = this;

        
            selectionArea = this.$el.querySelector('.selection-area');         
           
            


            let scroller = document.createElement("div");
            scroller.style.opacity = 0;
            scroller.style.position = "absolute";
            scroller.style.top = 0;
            scroller.style.left = 0;
            scroller.style.width = "1px";
            scroller.style.height = 30000 + "px";
            
            let gridEl = this.$el.querySelector('.grid');
            gridEl.append(scroller);
            
            var vessel = this.$el.querySelector('.vessel');

            let lastPosition = 0;

            // this.$el.onscroll = (function(e){
            //     console.log(`scroll: ${e.target.scrollTop}`);
               

            //     if(Math.abs(e.target.scrollTop -  lastPosition) > 10 * 30){
            //         console.log('scroll render');
            //         lastPosition = e.target.scrollTop;

            //         this.startIndex = Math.floor(e.target.scrollTop / 30);
            //         this.startIndex = this.startIndex  - 10 < 0 ? 0 : this.startIndex  - 10;
            //         vessel.style.top = (e.target.scrollTop - 10 * 30) < 0 ? 0 : (e.target.scrollTop - 10 * 30)  + 'px';
            //         //this.weight = this.weight + 1;               
            //     }
            // }).bind(this);


            this.$el.querySelector('.grid').onscroll = (function(e){
                console.log(`scroll: ${e.target.scrollTop}`);
               

                if(Math.abs(e.target.scrollTop -  lastPosition) > this.bufferItems * this.itemHeight){
                    console.log('scroll render');
                    lastPosition = e.target.scrollTop;

                    this.startIndex = Math.floor(e.target.scrollTop / this.itemHeight);
                    this.startIndex = this.startIndex  - this.bufferItems < 0 ? 0 : this.startIndex  - this.bufferItems;
                    vessel.style.top = (e.target.scrollTop - this.bufferItems * this.itemHeight) < 0 ? 0 : (e.target.scrollTop - this.bufferItems * this.itemHeight)  + 'px';
                    //this.weight = this.weight + 1;               
                }
            }).bind(this);
                    
            

            function dragElement(elmnt) {
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                var r, c;

                elmnt.onmousedown = dragMouseDown;
                
                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    // get the mouse cursor position at startup:
 
                    r = null;
                    c = null;
                    that.selections = [];
                        
                    let dataAtt = e.target.dataset;
                    r = dataAtt.row;
                    c = dataAtt.col;

                    console.log('mouse down', r, c);
                        
                    that.selections[0] = {start: {x: r, y: c}, end: {x: r, y: c}};

                    //that.draw();
                    that.drawdiv();
                    
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

                    if(gridEl.contains(e.target)){
                        if(r != dataAtt.row || c != dataAtt.col){
                            console.log('mouse moveing', e.target);
                            
                            r = dataAtt.row;
                            c = dataAtt.col;
                            if(that.selections[0] && that.selections[0].end){
                                that.selections[0].end.x = r;
                                that.selections[0].end.y = c;
                            }
                                
                           // that.draw();
                            that.drawdiv();
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
                    // stop moving when mouse button is released:
                    document.onmouseup = null;
                    document.onmousemove = null;

                    that.clearDragScroll();
                    //if(!that.selections[0].start) {throw 'no start..'}

                    //let dataAtt = e.target.dataset;
                    //that.selections[0].end = { x: dataAtt.row, y: dataAtt.col };
                }       
            }

            dragElement(this.$el.querySelector('.grid'));

            // ctx.beginPath();
            // ctx.rect(10,10, 200, 3000);
            // ctx.stroke();
        },
        updated:function(){
            console.log(this.scrollList);
        },
        props:{
            source: {
                type: Array,
                default: null
            }
        },
        data:function(){
            return{
            startIndex: 0,
            bufferItems: 5,
            itemHeight: 20,
            weight: 1,
            selections:[],
            cellHeight: 20,
            cellWidth: 90,
            scrollCallback: null,
            }   
        },
        computed:{         
            scrollList: function(){
                 //return this.source.slice(this.startIndex, 10 * this.weight);
                 return this.source.slice(this.startIndex, this.startIndex + 15 + this.bufferItems * 2);
            }        
        },
        watch:{
           
        },
        methods:{
            draw:function(){
                this.clear();

                console.log('selectionArea draw ... ');
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#ff6358"   
                ctx.fillStyle = "rgba(255,99,88,0.25)";                     

                this.selections.forEach(x =>{
                    //tl: top left; br: bottom right;
                    let tlX = Math.min(Number(x.start.x), Number(x.end.x));
                    let tlY = Math.min(Number(x.start.y), Number(x.end.y));
                    let brX = Math.max(Number(x.start.x), Number(x.end.x));
                    let brY = Math.max(Number(x.start.y), Number(x.end.y));
                           
                    let cell = this.$el.querySelector(`[data-row="${tlX}"][data-col="${tlY}"]`);

                    let xx = cell.offsetLeft;
                    let y = cell.offsetTop;
                    let w = (brX - tlX + 1) * this.cellHeight;
                    let h = (brY - tlY + 1) * this.cellWidth;

                    ctx.beginPath();
                    //ctx.rect(cell.offsetLeft, cell.offsetTop, (brX - tlX) * this.cellWidth, (brY - tlY) * this.cellHeight);
                    ctx.rect(xx,y, h, w );
                    ctx.fill();
                    ctx.stroke();
                });
            },
            clear: function(x, y, w, h){
                console.log('clearing whole selectionArea');
                ctx.clearRect(0, 0, selectionArea.width, selectionArea.height);
            },
            drawdiv:function(){
                this.cleardiv();

                console.log('selectionArea div draw ... ');
                                  

                this.selections.forEach(x =>{
                    //tl: top left; br: bottom right;
                    let tlX = Math.min(Number(x.start.x), Number(x.end.x));
                    let tlY = Math.min(Number(x.start.y), Number(x.end.y));
                    let brX = Math.max(Number(x.start.x), Number(x.end.x));
                    let brY = Math.max(Number(x.start.y), Number(x.end.y));
                           
                    let cell = this.$el.querySelector(`[data-row="${tlX}"][data-col="${tlY}"]`);

                    let xx = cell.offsetLeft;
                    let y = cell.offsetTop;
                    let w = (brX - tlX + 1) * this.cellHeight;
                    let h = (brY - tlY + 1) * this.cellWidth;

                    selectionArea.style.top = y + 'px';
                    selectionArea.style.left = xx + 'px';
                    selectionArea.style.width = h + 'px';
                    selectionArea.style.height = w + 'px';
                });
            },
            cleardiv: function(x, y, w, h){
                selectionArea.style.top = '0';
                selectionArea.style.left = '0';
                selectionArea.style.width = '0px';
                selectionArea.style.height = '0px'; 
            },
            test: function(v){
                console.log('xxxx' + v);
                this.draw();
            },
            dragScroll: function(up, down, left, right){
                let that = this;
                this.scrollCallback = setInterval(()=>{
                    if(up){
                        that.selections.end.y = (Number(that.selections[0].end.y) + 1) + '';
                    }

                    if(down){
                        that.selections[0].end.y = (Number(that.selections[0].end.y) - 1) + '';
                    }

                    if(left){
                        that.selections.end.x = (Number(that.selections.end.x) + 1) + '';
                    }

                    if(right){
                        that.selections.end.x = (Number(that.selections.end.x) - 1) + '';
                    }

                    that.$el.querySelector('.grid').scrollBy(0, 30);
                    that.drawdiv();
                }, 500);
            },
            clearDragScroll: function(){
                
                clearInterval(this.scrollCallback);
                this.scrollCallback = null;
            }
        }
    };
</script>

<style lang="less" scoped>
//rgba(255,99,88,.25)
    .grid{        
        --col-width: 90px;
        --row-height: 20px;

        height: 300px;
        width: 100%;
        background-color: transparent;
        color: black;
        overflow: auto;
        position: relative;
        font-size: 12px;

        *{
            box-sizing: border-box;
        }


        .row{
            display: flex;
            height: var(--row-height);
        }

        .column{
            width: var(--col-width);
        }

       
        .vessel{
            position: absolute;
            border-bottom: 1px solid #cedbe6;
            border-right: 1px solid #cedbe6;
        }

        .cell{
            //outline: rgb(206, 219, 230) solid 1px;
           // border: 0.5px solid black;
            border-top: 1px solid #cedbe6;
             border-left: 1px solid #cedbe6;
                 text-align: center;
                line-height: var(--row-height);
        }

        .selection-area{
            position: absolute;
            top: 0;
            left: 0;
            width: 0px;
            height: 0px;
            pointer-events: none;
            border: 2px solid #ff6358;
            background-color: rgba(255,99,88,0.25);
        }

        .black{
            background-color: black;
        }
    }
</style>
