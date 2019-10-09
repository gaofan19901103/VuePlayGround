<template>
  <div class="container">
        <div class="message">
            <div class="message-title"><span>{{messageTitle}}</span></div>
            <div class="message-content-wrapper">
                <div class="message-content">
                    <span>{{messageSum}}</span>
                    <span>{{messageNotion}}</span>
                </div>
                <div class="message-number">
                    <span >{{messageNumber}}</span>
                </div>
            </div>
        </div>
        <div class="circle">
            <span class="circle-number">{{circleNumber}}</span>
            <span class="circle-title">{{circleTitle}}</span>
            <div class="circle-warnings" v-if="circleWarnings"><span>{{circleWarnings}}</span></div>
            <div class="circle-errors" v-if="circleErrors"><span>{{circleErrors}}</span></div>
        </div>
  </div>
</template>

<script>
    export default {
        props:[
           'messageTitle',
           'messageSum',
           'messageNotion',
           'messageNumber',
           'circleNumber',
           'circleTitle',
           'circleWarnings',
           'circleErrors',
        ],
        data() {
            return {
                
            };
        },
    };
</script>

<style lang="less" scoped>
    .container {
        display: flex;
        height: 80px;
        width: 220px;
        background-color: grey;
        padding: 5px 10px;

        font-family:  'Nex Medium', sans-serif;
        background-color: #181818;

        .message{
            height: 100%;
            width: calc(100%  - 80px);


            .message-title{
                font-size: 14px;
                color: blue;
                margin-bottom: 24px;
            }

            .message-content-wrapper{
                display: flex;
                align-items: center;

                .message-content{
                    margin-right: 8px;

                    span{
                        font-size: 12px;
                        display: block;
                    }
                }

                .message-number{
                    span{
                        color: white;
                        font-size: 28px;
                    }
                }
            }
        }

        .circle{
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 80px;
            border-radius: 50%;
            box-sizing: border-box;
            border: 2px solid #94cb29;
            color: white;
//            background-color: black;

            .circle-number{
                font-size: 40px;
            }

            .circle-title{
                position: absolute;
                top: 0;
                left:0;
                transform: translateX(-100%);
                color: red;
                font-size: 12px;
            }

            .circle-warnings{
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                top: 50%;
                right: 0;
                transform: translate(50%, -50%);
                font-size: 10px;
                color: white;
                background-color: red;
                height: 20px;
                width: 20px;
                border-radius: 50%;
            }
        }
    }
</style>






