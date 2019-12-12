<template>
  <div class="grid">
      <div id="vessel">
        <div  class="row" v-for="(item) in scrollList" v-bind:key="item.key">
            <div class="column"><span>{{item.id}} | </span></div>
            <div class="column"><span>{{item.rt}}</span></div>
            <div class="column"><span>{{item.vt}}</span></div>
            <div class="column"><span>{{item.currency}}</span></div>
            <div class="column"><span>{{item.status}}</span></div>
        </div>
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
            let scroller = document.createElement("div");
            scroller.style.opacity = 0;
            scroller.style.position = "absolute";
            scroller.style.top = 0;
            scroller.style.left = 0;
            scroller.style.width = "1px";
            scroller.style.height = 3000 + "px";
            
            this.$el.append(scroller);
            
            var vessel = document.getElementById('vessel');

            let lastPosition = 0;

            this.$el.onscroll = (function(e){
                console.log('scroll');
               

                if(Math.abs(e.target.scrollTop -  lastPosition) > 10 * 30){
                    console.log('scroll render');
                     lastPosition = e.target.scrollTop;
 vessel.style.top = e.target.scrollTop + 'px';
                     this.startIndex = Math.floor(e.target.scrollTop / 30);
                     
                    //this.weight = this.weight + 1;               
                }
            }).bind(this);

            let x = 0;
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
            bufferItems: 10,
            weight: 1
            }   
        },
        computed:{         
            scrollList: function(){
                 //return this.source.slice(this.startIndex, 10 * this.weight);
                 return this.source.slice(this.startIndex, this.startIndex + 20);
            }        
        },
        watch:{
           
        }
    };
</script>

<style lang="less" scoped>
    .grid{        
        height: 300px;
        width: 100%;
        background-color: black;
        color: white;
        overflow: auto;
        position: relative;

        .row{
            display: flex;
            height: 30px;
        }

        .column{
            
        }

        // span{
        //     font-size: 12px;
        //     //font-family: 'NEX Light';
        //     background-color: #232323;
        //     line-height: 24px;
        //     margin: 1px;
        //     padding: 4px 8px;
        // }

        #vessel{
            position: absolute;
        }
    }
</style>
