import Vue from 'vue';

// Register a global custom directive called `v-focus`
Vue.directive('highlight', {
  // When the bound element is inserted into the DOM...
  inserted: function (el, binding, vnode) {
    var that = this;
    // Focus the element
    el.onmouseenter = function(){
      el.style.backgroundColor = 'red';
    }
  },
  bind: function (el, key, arg, expression, vm, value) {
    var that = this;
    // do preparation work
    // e.g. add event listeners or expensive stuff
    // that needs to be run only once
    // `value` is the initial value
  },
  update: function (value) {
    var that = this;
      // do something based on the updated value
      // this will also be called for the initial value
  },
  unbind: function () {
      // do clean up work
      // e.g. remove event listeners added in bind()
  }
})