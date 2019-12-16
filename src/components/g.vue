<template>
  <div>
    <div>something else you want to put here</div>
    <div class="grid">
        <div class="vessel">
            <div  class="row" v-for="(item, row_index) in scrollList" v-bind:key="item.key">
                <div v-for="(col, col_index) in Object.keys(item)" v-bind:key="col" class="column cell" :data-col="col_index" :data-row="row_index" v-on:click="test('gf')">{{item[col]}}</div>
            </div>
        </div>
        <canvas class="canvas"></canvas>
    </div>
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

            let canvas = this.$el.querySelector('canvas');
            canvas.height = this.$el.querySelector('.grid').clientHeight;
            canvas.width = this.$el.querySelector('.grid').clientWidth;
            ctx = canvas.getContext('2d');


            let scroller = document.createElement("div");
            scroller.style.opacity = 0;
            scroller.style.position = "absolute";
            scroller.style.top = 0;
            scroller.style.left = 0;
            scroller.style.width = "1px";
            scroller.style.height = 30000 + "px";
            
            this.$el.querySelector('.grid').append(scroller);
            
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
                    
            this.draw(10, 20, 150, 100);

            function dragElement(elmnt) {
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                var r, c;

                elmnt.onmousedown = dragMouseDown;
                
                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    // get the mouse cursor position at startup:
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    
                    r = null;
                    c = null;
                    that.selections = [];

                    document.onmouseup = closeDragElement;
                    // call a function whenever the cursor moves:
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

                    let dataAtt = e.target.dataset;                

                    if(r != dataAtt.row || c != dataAtt.col){
                        console.log(e.target);
                        
                        r = dataAtt.row;
                        c = dataAtt.col;
                        if(!that.selections[0])
                            that.selections[0] = {start: {x: r, y: c}};

                        
                    }
                }

                function closeDragElement(e) {
                    // stop moving when mouse button is released:
                    document.onmouseup = null;
                    document.onmousemove = null;

                    if(!that.selections[0].start) {throw 'no start..'}
                    let dataAtt = e.target.dataset;
                    that.selections[0].end = { x: dataAtt.row, y: dataAtt.col };
                }       
            }

            dragElement(this.$el.querySelector('.grid'));
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
            itemHeight: 30,
            weight: 1,
            selections:[]
            }   
        },
        computed:{         
            scrollList: function(){
                 //return this.source.slice(this.startIndex, 10 * this.weight);
                 return this.source.slice(this.startIndex, this.startIndex + 10 + this.bufferItems * 2);
            }        
        },
        watch:{
           
        },
        methods:{
            draw:function(x, y , w, h){
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#ff6358"
                ctx.rect(x, y, w, h);
                ctx.stroke();

                this.selections.forEach(x =>{
                    
                });
            },
            clear: function(x, y, w, h){
                ctx.clearRect(x -2, y -2, w + 2, h + 2);
            },
            test: function(v){
                console.log('xxxx' + v);
            }
        }
    };
</script>

<style lang="less" scoped>
    .grid{        
        --col-width: 90px;
        --row-height: 30px;

        height: 300px;
        width: 100%;
        background-color: transparent;
        color: black;
        overflow: auto;
        position: relative;
        font-size: 12px;
        

        .row{
            display: flex;
            height: var(--row-height);
        }

        .column{
            width: var(--col-width);
        }

        // span{
        //     font-size: 12px;
        //     //font-family: 'NEX Light';
        //     background-color: #232323;
        //     line-height: 24px;
        //     margin: 1px;
        //     padding: 4px 8px;
        // }

        .vessel{
            position: absolute;
        }

        .cell{
            border: 0.5px solid black;
        }

        canvas{
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
        }
    }
</style>
