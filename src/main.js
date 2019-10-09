import Vue from 'vue';
import App from './App.vue';
import container from './container.vue'; 

Vue.component('app', App);
Vue.component('container', container);

new Vue({
  el: '#app'
});