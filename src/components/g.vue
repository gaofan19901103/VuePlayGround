<template>
  <div class="grid">
      <div class="row">
          <div class="column"><span>01-AUG-19</span></div>
          <div class="column"><span>02-AUG-19</span></div>
          <div class="column"><span>EUR</span></div>
          <div class="column"><span>FRA</span></div>
          <div class="column"><span>3M,6M</span></div>
          <div class="column"><span>SUBMITTED</span></div>
      </div>
      <div class="row">
          <div class="column"><span>01-AUG-19</span></div>
          <div class="column"><span>02-AUG-19</span></div>
          <div class="column"><span>EUR</span></div>
          <div class="column"><span>FRA</span></div>
          <div class="column"><span>3M,6M</span></div>
          <div class="column"><span>SUBMITTED</span></div>
      </div>
  </div>
</template>

<script>
    export default {
        props:{

        },
        data() {
            return {
                
            };
        },
        computed:{

        }
    };
</script>

<style lang="less" scoped>
    .grid{        
        width: 100%;
        background-color: black;
        color: white;
        .row{
            display: flex;
        }

        .column{}

        span{
            font-size: 14px;
            font-family: 'NEX Light';
            background-color: #232323;
            line-height: 24px;
            margin: 1px;
        }
    }
</style>
