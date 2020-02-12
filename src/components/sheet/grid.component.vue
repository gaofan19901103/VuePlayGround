<template>
   <div class="v-grid" :style="{ top: gridTop + 'px'}">
        <div class="grid-row" v-for="(item, row_index) in virtualList" v-bind:key="item.key">
            <div class="grid-column grid-cell" :data-col="col_index" :data-row="row_index" 
            v-for="(col, col_index) in Object.keys(item)" v-bind:key="col" >
                {{item[col]}} 
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
           virtualList: {type: Array, required: false, default: [] },
           gridTop: {type: Number, required: false, default: 0}
        },
        updated:function(){
            console.log('gridTop has changed',this.gridTop);
        }
    };
</script>

<style lang="less">
       
        .v-grid{
            --col-width: 90px;
            --row-height: 20px;
            --grid-border-color: #cedbe6;

            position: absolute;
            left: 0;
            // border-bottom: 1px solid var(--grid-border-color);
            // border-right: 1px solid var(--grid-border-color);

            *{
                box-sizing: border-box;
            }

            .grid-row{
                display: flex;
                height: var(--row-height);  

                .grid-cell:first-child{
                    border-left: 1px solid var(--grid-border-color);
                }

                .grid-cell:last-child{
                    border-right: 1px solid var(--grid-border-color);
                }
            }

            .grid-row:first-child{
                .grid-cell{
                    border-top: 1px solid var(--grid-border-color); 
                }
            }

            .grid-row:last-child{
                .grid-cell{
                    border-bottom: 1px solid var(--grid-border-color); 
                }
            }

            .grid-column{
                width: var(--col-width);
            }

            .grid-cell{ 
                text-align: center;
                line-height: var(--row-height);
                border: 0.5px solid var(--grid-border-color);
                // border-top: 1px solid var(--grid-border-color);
                // border-left: 1px solid var(--grid-border-color);             
            }

    
        }

   
</style>
