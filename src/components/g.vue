<template>
  <div class="grid">
      <div class="header">
          <div class="column"><span>RUN</span></div>
          <div class="column"><span>TRADE</span></div>
          <div class="column"><span>CCY</span></div>
          <div class="column"><span>PROD</span></div>
          <div class="column"><span>TYPE</span></div>
          <div class="column"><span>STATUS</span></div>
      </div>
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
        props:{

        },
        data() {
            return {
                source: {
                    
                }
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

.header{
                display: flex;
}

        .row{
            display: flex;
        }

        .column{}

        span{
            font-size: 12px;
            //font-family: 'NEX Light';
            background-color: #232323;
            line-height: 24px;
            margin: 1px;
            padding: 4px 8px;
        }
    }
</style>
