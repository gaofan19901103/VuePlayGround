<template>
    <div class="virtual-scroller">
        <slot></slot>
    </div> 
</template>

<script>
    export default {
        created: function(){
            let x = 0;
        },
        beforeMount: function(){
            let x = 0;
        },
        mounted: function(){
            let x = 0;
            let lastPosition = 0;

            

            this.appendScroller();

            this.$slots.default.forEach(x =>{
                let childData = x.child;                      
                childData.virtualList = childData.source.slice(this.startIndex, this.startIndex + 15 + this.bufferItems * 2);                       
            }); 

            this.$el.onscroll = (function(e){
                console.log(`scroll: ${e.target.scrollTop}`);
               

                if(Math.abs(e.target.scrollTop -  lastPosition) > this.bufferItems * this.rowHeight){
                    console.log('scroll render');
                    lastPosition = e.target.scrollTop;

                    this.startIndex = Math.floor(e.target.scrollTop / this.rowHeight);
                    this.startIndex = this.startIndex  - this.bufferItems < 0 ? 0 : this.startIndex  - this.bufferItems;
                    this.$el.style.top = (e.target.scrollTop - this.bufferItems * this.rowHeight) < 0 ? 0 : (e.target.scrollTop - this.bufferItems * this.rowHeight)  + 'px';
                    
                    if(!this.$slots.default){
                        let y = 0;
                    }

                    this.$slots.default.forEach(x =>{
                        let childData = x.child;                      
                        childData.virtualList = childData.source.slice(this.startIndex, this.startIndex + 15 + this.bufferItems * 2);                       
                    });                                
                }
            }).bind(this);
        },
        props:{

        },
        data() {
            return {
                headerHeight: 0,
                footerHeight: 0,
                rowHeight: 20,
                rowCount: 1000,
                bufferItems: 5,
                startIndex: 0                    
            };
        },
        computed:{
            
        },
        methods:{
            appendScroller:function(){
                let scroller = document.createElement("div");
                scroller.style.opacity = 0;
                scroller.style.position = "absolute";
                scroller.style.top = 0;
                scroller.style.left = 0;
                scroller.style.width = "1px";
                scroller.style.height = 30000 + "px";
                //scroller.style.height = this.rowCount * this.rowHeight + 'px';
                               
                this.$el.append(scroller);
            }
        }
    };
</script>

<style lang="less" scoped>
   .virtual-scroller{
       position: relative;
       height: 300px;
       overflow: auto;
   }
</style>
