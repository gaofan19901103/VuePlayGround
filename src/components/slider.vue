<template>
    <div class="bar">
        <div class="braille">&#10247;</div>
        <div><button>test</button></div>
        <div><button>test1</button></div>
        <div><p>sdfsdf</p></div>
    </div> 
</template>

<script>
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
   .bar{
       height: 25px;
       display: flex;
       overflow: hidden;
       width: 15px;
       background-color: red;
       
   }

    .bar:hover{
        width: 200px;
        transition: width 0.3s ease-in-out;
    }

   .move{
       width: 100px;
   }

   .braille{
       font-size: 24px;
       font-weight: 800;
   }
</style>
