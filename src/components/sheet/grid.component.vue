<template>
   <div class="v-grid" :style="{ top: gridTop + 'px'}" ref="GridEl">
            <!-- <div class="grid-header">
                <div class="grid-column grid-cell" v-for="x in columns" v-bind:key="x.colIndex">{{x.Title}}</div>
            </div> -->

            <!-- <div class="grid-row" v-for="item in virtualList" v-bind:key="item.rowIndex">
                <div class="grid-column grid-cell" v-for="col in columns" v-bind:key="col.colIndex" :data-col="col.colIndex" :data-row="item.rowIndex">
                    {{item.Values[col.Col] ? item.Values[col.Col].Val : ''}} 
                </div>
            </div> -->

            <div class="grid-row" v-for="item in headerRows" v-bind:key="item.rowIndex" style="position: sticky; top: 0;">
                <cell
                    v-for="col in columns" v-bind:key="col.colIndex"
                    :row-index="item.rowIndex"
                    :col-index="col.colIndex"
                    :value="item.cells[col.colId].value"
                >
                </cell>
            </div>
            <div :class="{'grid-row': true, 'freeze': item.freeze }" v-for="item in virtualList" v-bind:key="item.rowIndex">
                <cell
                    v-for="col in columns" v-bind:key="col.colIndex"
                    :row-index="item.rowIndex"
                    :col-index="col.colIndex"
                    :value="item.cells[col.colId].value"
                >
                </cell>
            </div>

            <!-- <div class="grid-row" v-for="item in virtualList" v-bind:key="item.rowIndex">
                <row :row="item" :columns="columns"></row>
            </div> -->
    </div>
</template>

<script>
    import Cell from './cell.component.vue';  
    import Row from './row.component.vue';

    export default {
        components:{
            'cell': Cell,
            'row': Row
        },
        props:{
           virtualList: {type: Array, required: false, default: [] },
           headerRows: {type: Array, required: false, default: [] },
           columns: {type: Array, required: false, default: []},
           gridTop: {type: Number, required: false, default: 0}
        },
        mounted: function(){
           this.$refs.GridEl.style.setProperty('--row-height', this.$parent.rowHeight + 'px');
           this.$refs.GridEl.style.setProperty('--col-width', this.$parent.columnWidth + 'px');
        },
        updated: function(){
            let x =0;
            console.log('grid virtualList updated');
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

            *{
                box-sizing: border-box;
            }

            // .grid-header{
            //     display: flex;
            //     height: var(--row-height);  
            //     position: sticky;
            //     top: 0;
            //     background-color: aqua;
            //     z-index: 30;

            //     .grid-column:first-child{
            //         position: sticky;
            //         left:0;
            //         z-index: 40;
            //         background-color: aqua;
            //     }

            //     .grid-column:nth-child(2){
            //         position: sticky;
            //         left: 90;
            //         z-index: 40;
            //         background-color: aqua;
            //     }
            // }

            .grid-row{
                display: flex;
                height: var(--row-height);  


                .grid-cell:last-child{
                    border-right: 0.25px solid var(--grid-border-color);
                }
            }

            .grid-row:last-child{
                .grid-cell{
                    border-bottom: 0.25px solid var(--grid-border-color);
                }
            }

            .grid-column{
                width: var(--col-width);
            }

            .grid-cell{ 
                text-align: center;
                line-height: var(--row-height);
                border-top: 0.25px solid var(--grid-border-color);
                border-left: 0.25px solid var(--grid-border-color);            
            }

            // .grid-cell[data-col="0"]{
            //     background-color: grey;
            //     position: sticky;
            //     left: 0px;
            //     //position: fixed;
            //     //position: absolute;
            // }


            // .grid-cell[data-col="1"]{
            //     background-color: grey;
            //     position: sticky;
            //     left: 90px;
            //     //position: fixed;
            //     //position: absolute;
            // }

            // .grid-row:first-child{
            //     position: sticky;
            //     top: 0;
            //     background-color: aqua;
            // }


            // .grid-cell[data-col="3"]{
            //     background-color: blue;
            // }

            // .grid-cell[data-row="3"]{
            //     background-color: red;
            // }

            // .freeze{
            //     position: sticky;
            //     top: 0;
            //     background-color: white;
            // }
        }

   
</style>
