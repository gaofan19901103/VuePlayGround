import Vue from 'vue';
import dynamic from '../components/tooltip-content.vue';

Vue.directive('tooltip', {
  // When the bound element is inserted into the DOM...
  inserted: function (el, binding, vnode) { 
    // var ComponentClass = Vue.extend(dynamic)
    // var instance = new ComponentClass({
    //     propsData: { component: 'xxx' , properties: {text: '333'}}
    // });
    // instance.$mount();
    // el.append(instance.$el);

    let text = 'hello, tooltip';

    var tooltipBox = document.createElement('div');
    var tooltipSpan = document.createElement('span');
    var tooltipSpanText = document.createTextNode(text);
    var tooltipArrow = document.createElement('div');
    tooltipBox.classList.add('tooltip-box');
    tooltipArrow.classList.add('tooltip-arrow');
    tooltipArrow.setAttribute('id','123' + '-tooltip-arrow');
    tooltipSpan.appendChild(tooltipSpanText);
    tooltipBox.appendChild(tooltipSpan);

    el.onmouseenter = function(){
        console.log('enter');
        document.body.appendChild(tooltipBox);
        document.body.appendChild(tooltipArrow);
        
        let position = window.Portal.getTooltipPosition(el, tooltipBox);

        tooltipBox.style.top = position.box.top + 'px';
        tooltipBox.style.left = position.box.left + 'px';
        tooltipArrow.style.top = position.arrow.top + 'px';
        tooltipArrow.style.left = position.arrow.left + 'px';

        position.box.classList.forEach(x =>{
            tooltipBox.classList.add(x);
        });

        position.arrow.classList.forEach(x =>{
            tooltipArrow.classList.add(x);
        });

        tooltipArrow.classList.toggle('show');
        tooltipBox.classList.toggle('show');
    }

    el.onmouseleave = function(){
        //removeElements();
        console.log('mouse leave')
        tooltipBox.style.top = 'auto';
        tooltipBox.style.right = 'auto';
        tooltipBox.style.bottom = 'auto';
        tooltipBox.style.left = 'auto';

        tooltipArrow.style.top = 'auto';
        tooltipArrow.style.right = 'auto';
        tooltipArrow.style.bottom = 'auto';
        tooltipArrow.style.left = 'auto';

        tooltipArrow.classList.remove('show-below');
        tooltipArrow.classList.remove('show-above');
        tooltipBox.classList.toggle('show');
        tooltipArrow.classList.toggle('show');

        document.body.removeChild(tooltipBox);
        document.body.removeChild(tooltipArrow);
    }
  },
  bind: function (el, key, arg, expression, vm, value) {
    var that = this;
    // do preparation work
    // e.g. add event listeners or expensive stuff
    // that needs to be run only once
    // `value` is the initial value
  },
  update: function (value) {
    var that = this;
      // do something based on the updated value
      // this will also be called for the initial value
  },
  unbind: function () {
      // do clean up work
      // e.g. remove event listeners added in bind()
  }
})