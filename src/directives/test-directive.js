import Vue from 'vue';
import dynamic from '../components/tooltip-content.vue';
// Register a global custom directive called `v-focus`
Vue.directive('highlight', {
  // When the bound element is inserted into the DOM...
  inserted: function (el, binding, vnode) {
    var that = this;
    // Focus the element
    el.onmouseenter = function(){
      el.style.backgroundColor = 'red';
    }

    var ComponentClass = Vue.extend(dynamic)
    var instance = new ComponentClass({
        propsData: { component: 'xxx' , properties: {text: '333'}}
    });
    instance.$mount();
    el.append(instance.$el);
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