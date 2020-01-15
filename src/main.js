import Vue from 'vue';
import App from './components/App.vue';
import g from './components/g.vue';
import container from './components/reset-submission-view.vue'; 
import slider from './components/slider.vue';
import parent from './components/parent.vue';

require('./directives/test-directive.js');

Vue.component('app', App);
Vue.component('container', container);
Vue.component('grid', g);
Vue.component('slider', slider);
Vue.component('parent', parent);

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