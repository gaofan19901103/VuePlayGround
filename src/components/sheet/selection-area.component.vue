<template>
   <div class="selection-area" :style="{ top: top + 'px', left: left + 'px', height: height + 'px', width: width + 'px' }"></div>
</template>

<script>
    export default {
        props:{
           top: {type: Number, required: false, default: 0 }, 
           left: {type: Number, required: false, default: 0 }, 
           height: {type: Number, required: false, default: 0 }, 
           width: {type: Number, required: false, default: 0 }
        }
    };
</script>

<style lang="less" scoped>
  .selection-area{
        --selection-area-color: rgba(255,99,88,0.25);
        --selection-area-border: #ff6358;

        position: absolute;
        pointer-events: none;
        border: 2px solid var(---selection-area-border);
        background-color: var(--selection-area-color);
    }
</style>
