<template>
  <div class="container">
        <div class="message" :class="{'big': showBigCircle}">
            <div class="message-title" :title="messageTitle"><span>{{messageTitle}}</span></div>
            <div class="message-content-wrapper" v-if="messageNumber || messageSum || messageNotion">
                <div class="message-content">
                    <span>{{messageSum}}</span>
                    <span>{{messageNotion}}</span>
                </div>
                <div class="message-number">
                    <span >{{messageNumber}}</span>
                </div>
            </div>
        </div>
        <div class="circle" :class="{'has-error': circleErrors, 'big': showBigCircle }">
            <span class="circle-number">{{circleNumber}}</span>
            <span class="circle-title" v-if="circleTitle">{{circleTitle}}</span>
            <div class="circle-warnings" v-if="circleWarnings"><span>{{circleWarnings}}</span></div>
            <div class="circle-errors" v-if="circleErrors"><span>{{circleErrors}}</span></div>
        </div>
        <div class="select-button">✗</div> 
        <!-- ✗ -->
        
  </div>
</template>

<script>
    export default {
        props:{
            messageTitle: {type: String, required: true },
            messageSum: {type: String, required: false, default: '' },
            messageNotion: {type: String, required: false, default: '' },
            messageNumber: {type: String, required: false, default: '0' },
            circleNumber: {type: String, required: true },
            circleTitle: {type: String, required: false },
            circleWarnings: {type: String, required: false, default: '0' },
            circleErrors: {type: String, required: false, default: '0' }
        },
        // props:[
        //    'messageTitle',
        //    'messageSum',
        //    'messageNotion',
        //    'messageNumber',
        //    'circleNumber',
        //    'circleTitle',
        //    'circleWarnings',
        //    'circleErrors',
        // ],
        data() {
            return {
                
            };
        },
        computed:{
            showBigCircle(){
                return !this.messageNumber && !this.messageNotion && !this.messageSum;
            }
        }
    };
</script>

<style lang="less" scoped>
    // @font-face {
    //     font-family: 'Nex Medium';
    //     src: url('./assets/NEXWeb-Medium.woff') format('woff');
    // }

    .container {
        position: relative;
        @circle-radius: 65px;
        @circle-radius-big: 90px;
        // margin-top: 15px;
        margin: 2px;


        display: flex;
        width: 220px;
        background-color: grey;
        padding: 10px;
        font-family:  'Nex Medium', sans-serif;
        background-color: #181818;

        .message{
            width: calc(100%  - @circle-radius);
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .message-title{
                font-size: 12px;
                color: #00afaf;
                //margin-bottom: 24px;
                width: calc(100% - 40px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                //filter: brightness(120%);
            }

            .message-content-wrapper{
                display: flex;
                align-items: center;
                
                font-family: 'Nex Light';
                .message-content{
                    margin-right: 8px;
                    color: #635942;
                    font-weight: 800;

                    span{
                        font-size: 12px;
                        display: block;
                    }
                }

                .message-number{
                    span{
                        font-family: 'Nex Light';
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
            height: @circle-radius;
            width: @circle-radius;
            border-radius: 50%;
            box-sizing: border-box;
            border: 2px solid #94cb29;
            color: white;
//            background-color: black;

            .circle-number{
                font-family: 'Nex Light';
                font-size: 40px;
            }

            .circle-title{
                position: absolute;
                top: 0;
                left:0;
                transform: translateX(-100%);
                color: #635942;
                font-size: 12px;
                font-family: 'Nex Light';
                font-weight: 800;
            }
            .circle-info-shared{
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                top: 50%;
                right: 0;
                transform: translate(50%, -50%);
                font-size: 10px;
                color: white;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                font-family: 'Nex Light';
            }
            .circle-warnings{
                .circle-info-shared;
                background-color: #d67100;
            }
            .circle-errors{
                .circle-info-shared;
                background-color: #d61831;
            }
        }

        .circle.has-error{
            border-color: #d61831;
        }

        .message.big{

            .message-title{
                font-size: 18px;
            }

            align-items: center;
            width: calc(100%  - @circle-radius-big);
        }

        .circle.big{
            height: @circle-radius-big;
            width: @circle-radius-big;
        }

        .select-button{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 15px;
            width: 15px;
            color: red;
            position: absolute;
            top: -5px;
            left: 0;
            border: 1px solid red;
            border-radius: 50%;
            font-size: 12px;
        }
    }
</style>






