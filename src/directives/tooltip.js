import Vue from 'vue';
import dynamic from '../components/tooltip-content.vue';

Vue.directive('tooltip', {

  inserted: function (el, binding, vnode) {
    let text, component, props;

    if(binding.arg == 'data'){
        component = binding.value.component;
        props = binding.value.props;
    }   
    else if (binding.arg == 'component'){
        component = binding.value;
    } 
    else{
        text = binding.value;
    }

    var ComponentClass = Vue.extend(dynamic)
    var instance = new ComponentClass({
        propsData: { text: text, component: component , props: props}
    });
    let tooltipBox = instance.$mount().$el;


    el.onmouseenter = function(){
        console.log('enter');
      
        document.body.appendChild(tooltipBox);

        let position = window.Portal.getTooltipPosition(el, tooltipBox);

        tooltipBox.style.top = position.box.top + 'px';
        tooltipBox.style.left = position.box.left + 'px';


        position.box.classList.forEach(x =>{
            tooltipBox.classList.add(x);
        });

        tooltipBox.classList.toggle('show');
    }

    el.onmouseleave = function(){
        console.log('mouse leave')
        document.body.removeChild(tooltipBox);
    }
  }
})