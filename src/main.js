import Vue from 'vue';
import App from './App.vue';
import container from './container.vue'; 

require('./test-directive.js');

Vue.component('app', App);
Vue.component('container', container);

new Vue({
  el: '#app'
});