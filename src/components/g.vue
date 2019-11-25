<template>
  <div class="grid">
      
      <div class="row" v-for="(item, index) in scrollList" v-bind:key="item.key">
          <div class="column"><span>{{index}} | </span></div>
          <div class="column"><span>{{item.rt}}</span></div>
          <div class="column"><span>{{item.vt}}</span></div>
          <div class="column"><span>{{item.currency}}</span></div>
          <div class="column"><span>{{item.status}}</span></div>
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

            let x = 0;
        },
        props:{

        },
        data() {
            return {
                source: [
                    {id: '1', rt: '01-AUG-19', vt:'02-AUG-19', currency: 'USD', product:'FRA', tenor:'3M', status:'Open'}
                ]
            };
        },
        computed:{
            myList: function(){
                var list = [];

                for(let i = 0; i < 1000; i ++){
                    list.push({id: i, rt: '01-AUG-19', vt:'02-AUG-19', currency: 'USD', product:'FRA', tenor:'3M', status:'Open'});
                }

                return list;
            },
            scrollList: function(){
                let index = 300 / 30;
                return this.myList.slice(0, index);
            }
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
    }
</style>
