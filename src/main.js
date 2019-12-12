import Vue from 'vue';
import App from './components/App.vue';
import g from './components/g.vue';
import container from './components/reset-submission-view.vue'; 
import slider from './components/slider.vue';

require('./directives/test-directive.js');

Vue.component('app', App);
Vue.component('container', container);
Vue.component('grid', g);
Vue.component('slider', slider);

var list = [];

for(let i = 0; i < 1000; i ++){
    list.push({id: i, rt: '01-AUG-19', vt:'02-AUG-19', currency: 'USD', product:'FRA', tenor:'3M', status:'Open'});
}

new Vue({
  el: '#app',
  data:{
    testString: 'hello w',
    listSource: list
  }
});