import Vue from 'vue';

// Register a global custom directive called `v-focus`
Vue.directive('hightlight', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.onmouseenter = function(){
      el.style.backgroundColor = 'red';
    }
  }
})