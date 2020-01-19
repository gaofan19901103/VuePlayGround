import Vue from 'vue';
import App from './components/App.vue';
import g from './components/g.vue';
import container from './components/reset-submission-view.vue'; 
import slider from './components/slider.vue';
import parent from './components/parent.vue';
import xxx from './components/child.vue';
import VS from './components/virtual-scroller.vue';
import sheet from './components/sheet.vue';

require('./directives/test-directive.js');

Vue.component('app', App);
Vue.component('container', container);
Vue.component('grid', g);
Vue.component('slider', slider);
Vue.component('parent', parent);
Vue.component('xxx', xxx);
Vue.component('virtual-scroller', VS);
Vue.component('sheet', sheet);

var list = [];

for(let i = 0; i < 1000; i ++){
    list.push({id: i, rt: '01-AUG-19', vt:'02-AUG-19', currency: 'USD', product:'FRA', tenor:'3M', status:'Open'});
}

window.myVue = new Vue({
  el: '#app',
  data:{
    testString: 'hello w',
    listSource: list
  }
});

// window.testVue = new Vue(
//   {
//     el:'#hhh'
//   }
// );