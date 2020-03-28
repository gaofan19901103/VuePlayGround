<template>
   <div class="grid-cell" :data-col="colIndex" :data-row="rowIndex" v-bind="attributes" :style="style">{{value}}</div>
</template>

<script>
    export default {
        props:{
           rowIndex: { type: [Number, String], required: true },
           colIndex: { type: [Number, String], required: true },
           value: { type: String, required: false, default: '' },
           freeze: { type: Boolean, required: false, default: false },
           header: { type: Boolean, required: false, default: false },
           height: {type: Number, required: false, default: 20},
           width: {type: Number, required: false, default: 90},
           span: {type: Number, required: false, default: 1},
           errorMessages: {type: Array, required: false, default: () => []}, 
           warningMessages: {type: Array, required: false, default: () => []}, 
           validators: {type: Array, required: false, default: () => []},
           filters: {type: Array, required: false, default: () => []},
           x: {type: Number, required: false, default: 0}
        },
        computed:{
            style: function(){
                let style = {
                    width: this.width + 'px',
                    height: this.height + 'px'
                };

                if(this.freeze){
                    style = Object.assign(style, {
                        position: 'sticky',
                        left: this.x + 'px',
                        'background-color': 'grey',
                        'z-index': 100
                    });
                }

                return style;
            },
            attributes: function(){
                return { 'data-freeze': this.freeze, 'data-header': this.header };
            }
        },
        mounted: function(){

        },
        updated: function(){

        }
    };
</script>

<style lang="less">

    .v-grid{
        .grid-cell{ 
            text-align: center;
            line-height: var(--row-height);
            border-top: 0.25px solid var(--grid-border-color);
            border-left: 0.25px solid var(--grid-border-color);            
        }
    }

    .v-grid-header{
        .grid-cell{ 
            text-align: center;
            line-height: var(--row-height);
            border-top: 0.25px solid var(--grid-border-color);
            border-left: 0.25px solid var(--grid-border-color);            
        }
    }

</style>
