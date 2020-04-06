<template>
    <!-- GF:Review - apply filters on the value, and see if async is possbile, I don't want the filter to slow down the animation loop -->
   <div class="grid-cell" :data-col="colIndex" :data-row="rowIndex" v-bind="attributes" :style="style">{{value}}</div>
</template>

<script>
    export default {
        props:{
           rowIndex: { type: [Number, String], required: true },
           colIndex: { type: [Number, String], required: true },
           value: { type: String, required: false, default: '' },
           valueType: { type: String, required: false, default: '' },
           freeze: { type: Boolean, required: false, default: false },
           header: { type: Boolean, required: false, default: false },
           height: { type: Number, required: false, default: 20 },
           width: { type: Number, required: false, default: 90 },
           span: { type: Number, required: false, default: 1 },
           errorMessages: { type: Array, required: false, default: () => []}, 
           warningMessages: { type: Array, required: false, default: () => []}, 

        //    GF:Review - let me think about them.
        //    fomula: {type: Object, required: false, default: null }
        //    validators: { type: Array, required: false, default: () => []},
        //    filters: { type: Array, required: false, default: () => []},

           x: { type: Number, required: false, default: 0 }
        },
        computed:{
            style: function(){
                let style = {
                    //GF:Review - span with widht and colIndex will be used for merging cells.
                    //width: this.width * this.span + 'px',

                    width: `${this.width}px`,
                    height: `${this.height}px`
                };

                if(this.freeze && this.header){
                    style = Object.assign(style, {
                        position: 'sticky',
                        left: `${this.x}px`,

                        //GF:Review - the style below is temporary, standardize them.
                        backgroundColor: 'grey',
                        zIndex: 100
                    });
                }

                if(this.freeze && !this.header){
                    style = Object.assign(style, {
                        position: 'sticky',
                        left: `${this.x}px`,
                        //GF:Review - the style below is temporary, standardize them.
                        backgroundColor: 'grey',
                        zIndex: 90
                    });
                }

                return style;
            },
            attributes: function(){            
                let attributes = { 
                    ...{
                        'data-col' : this.colIndex, 
                        'data-row' : this.rowIndex
                    },
                    ...this.freeze ? {'data-freeze': true} : {},
                    ...this.header ? {
                        'data-header': true,
                        //GF:Rview - I don't want to have v-tooltip for each cell, dynamic binding doesn't work very nicely, do extra set up later.
                        //'v-tooltip': this.tooltipValue
                        } : {},
                };

                return attributes;
            },
            tooltipValue: function(){
                if(this.header){
                    return this.value;
                }
                else if (this.warningMessages.length || this.errorMessages.length){
                    // have the tooltip data here.
                }
                else{
                    return false;
                }
            }
        }
    };
</script>

<style lang="less">

    .v-grid{
        .grid-row{
            .grid-cell{ 
                position: relative;

                text-align: center;
                line-height: var(--row-height);
                //GF:Review - border, should I put top border on row level, or use css grid ??
                border-top: 0.25px solid var(--grid-border-color);
                border-left: 0.25px solid var(--grid-border-color);            
            }

            .grid-cell:last-child{
                border-right: 0.25px solid var(--grid-border-color);
            }

            &:last-child{
                .grid-cell{
                    border-bottom: 0.25px solid var(--grid-border-color);
                }
            }

            //GF:Review - we don't always need this below, enable as much as possbile to test the performance.
            .grid-cell:after{
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                width: 0px;
                height: 0px;
                border-left: 5px solid transparent;
                border-right: 5px solid orange;
                border-bottom: 5px solid transparent;
            }
        }
    }

</style>
