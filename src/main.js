import Vue from 'vue';
import App from './components/App.vue';
import g from './components/g.vue';
import container from './components/reset-submission-view.vue'; 
import slider from './components/slider.vue';
import parent from './components/parent.vue';
import xxx from './components/child.vue';
import VS from './components/virtual-scroller.vue';
import sheet from './components/sheet.vue';

require('./directives/test-directive.js');
require('./directives/tooltip.js');

Vue.component('app', App);
Vue.component('container', container);
Vue.component('grid', g);
Vue.component('slider', slider);
Vue.component('parent', parent);
Vue.component('xxx', xxx);
Vue.component('virtual-scroller', VS);
Vue.component('sheet', sheet);

var list = [];

for(let i = 0; i < 1000; i ++){
    list.push({id: i, rt: '01-AUG-19', vt:'02-AUG-19', currency: 'USD', product:'FRA', tenor:'3M', status:'Open'});
}

window.myVue = new Vue({
  el: '#app',
  data:{
    testString: 'hello w',
    listSource: list
  },
  components: {
    'rr': parent
  }
});

// window.testVue = new Vue(
//   {
//     el:'#hhh'
//   }
// );
window.Portal = {};

window.Portal.getTooltipPosition = function(target, tooltipBox){
  let position = {
    arrow: {top: 0, left: 0, classList: []},
    box: {top: 0, left: 0, classList: []}
  };

  const _arrowSize = 8;
  const _arrowMargin = 2;
  let _showTooltipBelow;

  let _targetRect = target.getBoundingClientRect();
  let _tootipBoxRect = tooltipBox.getBoundingClientRect();

  let _viewPortHeight = window.innerHeight;
  let _viewPortWidth = window.innerWidth;
  let _targetRectWidth = _targetRect.right - _targetRect.left;
  let _targetRectHeight = _targetRect.bottom - _targetRect.top;
  let _tooltipBoxRectWidth = _tootipBoxRect.right - _tootipBoxRect.left;
  let _tooltipBoxRectHeight = _tootipBoxRect.bottom - _tootipBoxRect.top;

  let _targetTopSpace =  _targetRect.top - _arrowSize - _tooltipBoxRectHeight;
  let _targetBottomSpace = _viewPortHeight - _targetRect.bottom - _arrowSize - _tooltipBoxRectHeight;
  let _targetTopAndBottomLeftSpace = _targetRect.left + _targetRectWidth / 2 - _tooltipBoxRectWidth / 2;
  let _targetTopAndBottomRightSpace = (_viewPortWidth - _targetRect.right) + _targetRectWidth / 2 - _tooltipBoxRectWidth / 2;

  let _targetLeftSpace = _targetRect.left - _arrowSize - _tooltipBoxRectWidth;
  let _targetRightSpace = _viewPortWidth - _targetRect.right - _arrowSize - _tooltipBoxRectWidth;
  let _targetLeftAndRightTopSpace = _targetRect.top + _targetRectHeight / 2 - _tooltipBoxRectHeight / 2;
  let _targetLeftAndRightBottomSpace = _targetRect.top + _targetRectHeight / 2 - _tooltipBoxRectHeight / 2;

  if(_targetBottomSpace > 0 || _targetTopSpace > 0){
    if(_targetBottomSpace > 0 && _targetTopSpace > 0){
        if(_targetBottomSpace >= _targetTopSpace){
          _showTooltipBelow = true;
            position.arrow.top = _targetRect.bottom + _arrowMargin;
            position.box.top = _targetRect.bottom + _arrowSize + _arrowMargin;
        }
        else{         
          _showTooltipBelow = false;
            position.arrow.top = _targetRect.top - _arrowSize - _arrowMargin;
            position.box.top = _targetRect.top - _arrowSize - _arrowMargin - _tooltipBoxRectHeight;
        }
    }
    else if(_targetBottomSpace > 0){
        _showTooltipBelow = true;
        position.arrow.top = _targetRect.bottom + _arrowMargin;
        position.box.top = _targetRect.bottom + _arrowSize + _arrowMargin;
    }
    else if(_targetTopSpace > 0){
        _showTooltipBelow = false;
        position.arrow.top = _targetRect.top - _arrowSize - _arrowMargin;
        position.box.top = _targetRect.top - _arrowSize - _arrowMargin - _tooltipBoxRectHeight;
    }
    else{
        throw console.error('your tooltip wiht id {' + id + '} is too heigh.');
    } 
    
    if(_targetTopAndBottomLeftSpace < 0 && _targetTopAndBottomRightSpace < 0){
        throw console.error('your tooltip wiht id {' + id + '} is too long.');
    }
    
    position.arrow.left = _targetRect.left + _targetRectWidth / 2 - _arrowSize;

    if(_targetTopAndBottomLeftSpace > 0 && _targetTopAndBottomRightSpace > 0){        
        position.box.left = _targetRect.left - _tooltipBoxRectWidth / 2 + _targetRectWidth / 2;
    }
    else if (_targetTopAndBottomLeftSpace < 0){
        position.box.left = 4;
    }
    else if (_targetTopAndBottomRightSpace < 0){
        position.box.left = _viewPortWidth - _tooltipBoxRectWidth - 4;
    }

    if(_showTooltipBelow){
      position.arrow.classList.push('show-below');
    }
    else{
      position.arrow.classList.push('show-above');
    }

    return position;
  }
}