require('./util/portal.js');
require('./util/tooltip.js');

import Vue from 'vue';
import App from './components/App.vue';
import g from './components/g.vue';
import container from './components/reset-submission-view.vue'; 
import slider from './components/slider.vue';
import parent from './components/parent.vue';
import xxx from './components/child.vue';
import VS from './components/virtual-scroller.vue';
import sheet from './components/sheet/sheet.component.vue';
import { FraMeta, FraTemplate } from './metaData.js';
import tooltip from './components/tooltip/tooltip.directive.js';

require('./directives/test-directive.js');
require('./directives/tooltip.js');
require('./directives/resize.directive.js');

Vue.component('app', App);
Vue.component('container', container);
Vue.component('grid', g);
Vue.component('slider', slider);
Vue.component('parent', parent);
Vue.component('xxx', xxx);
Vue.component('virtual-scroller', VS);
Vue.component('sheet', sheet);
Vue.directive('tooltip',tooltip);

var list = [];

for(let i = 0; i < 1000; i ++){
    list.push({id: i, rt: '01-AUG-19', vt:'02-AUG-19', rate: '1.234567', currency: 'USD', product:'FRA', tenor:'3M', status:'Open'});
}

window.myVue = new Vue({
  el: '#app',
  data:{
    testString: 'hello w',
    listSource: list,
    meta: FraMeta,
    template: FraTemplate,
    tooltipTestData: {
      component: 'message-list',
      props:{ messages: ['im a child']},
      classList: ['error-message-list']
    }
  },
  methods:{
    xxx: function(){

      document.querySelector('.v-sheet').focus();
    }
  }
});

window.myVue.$on('sheet-data-changed', function(id, changes){
  console.log('receive sheet data change:', id, changes);
  //async tasks  GF:Review
});

var testEl = document.getElementById("main-container");
var dragEl = document.getElementById("drag");

dragElement(dragEl);

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  elmnt.onmousedown = dragMouseDown;
  

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = e.clientX - pos3;
    pos2 = e.clientY - pos4;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    requestAnimationFrame(function(){
      testEl.style.width = testEl.getBoundingClientRect().width + pos1 + 'px';
      testEl.style.height = testEl.getBoundingClientRect().height + pos2 + 'px';
    });

    // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}