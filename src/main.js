import Vue from 'vue';
import App from './components/App.vue';
import container from './components/reset-submission-view.vue'; 

require('./directives/test-directive.js');

Vue.component('app', App);
Vue.component('container', container);

new Vue({
  el: '#app'
});