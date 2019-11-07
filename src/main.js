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

new Vue({
  el: '#app'
});