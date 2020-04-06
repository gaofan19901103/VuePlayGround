require('./util/util.js');

import Vue from 'vue';
import App from './components/App.vue';
import Sheet from './components/sheet/sheet.component.vue';

import { FraMeta, FraTemplate } from './metaData.js';
import tooltip from './components/tooltip/tooltip.directive.js';
import {onResize } from './directives/resize.directive.js';


Vue.component('app', App);
Vue.component('sheet', Sheet);

Vue.directive('tooltip',tooltip);
Vue.directive('on-resize',onResize);

import {convertColumns, convertRows } from './services/sheet-data.service.js';

let convertedCols = convertColumns(FraMeta);
let convertedRows = convertRows(FraMeta, convertedCols);

window.myVue = new Vue({
  el: '#app',
  data:{
    sheetRows: convertedRows,
    sheetCols: convertedCols,
    rowHeight: 20
  }
});

window.myVue.$on('sheet-data-changed', function(id, changes){
  console.log('receive sheet data change:', id, changes);
  //async tasks  GF:Review
});


//--------------------------------------------------------------------------------------------------------------
var testEl = document.getElementById("main-container");
var dragEl = document.getElementById("drag");

dragElement(dragEl);

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  elmnt.onmousedown = dragMouseDown;
  

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = e.clientX - pos3;
    pos2 = e.clientY - pos4;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    requestAnimationFrame(function(){
      testEl.style.width = testEl.getBoundingClientRect().width + pos1 + 'px';
      testEl.style.height = testEl.getBoundingClientRect().height + pos2 + 'px';
    });

    // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
//--------------------------------------------------------------------------------------------------------------