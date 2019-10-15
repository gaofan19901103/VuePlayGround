import Vue from 'vue';

// Register a global custom directive called `v-focus`
Vue.directive('tab-item', {
  // When the bound element is inserted into the DOM...
  inserted: function (el, key, arg, expression, vm, value) {
    var that = this;
    // Focus the element
    el.onmouseenter = function(){
      el.style.backgroundColor = 'blue';
    }
  },
  bind: function (el, key, arg, expression, vm, value) {
    var that = this;

  },
  update: function (value) {
    var that = this;

  },
  unbind: function () {

  }
})