require('./util/util.js');

import Vue from 'vue';
import VueRouter from 'vue-router';

import Sheet from './components/sheet/sheet.component.vue';

import { FraMeta, FraTemplate } from './metaData.js';
import tooltip from './components/tooltip/tooltip.directive.js';
import {onResize } from './directives/resize.directive.js';

import AppInstruction from './components/readme/app-instruction.component.vue';
import SheetReadme from './components/readme/sheet-readme.component.vue';
import SheetContainer from './components/readme/sheet-container.component.vue';


Vue.component('sheet', Sheet);
Vue.directive('tooltip',tooltip);
Vue.directive('on-resize',onResize);

import {convertColumns, convertRows } from './services/sheet-data.service.js';

let convertedCols = convertColumns(FraMeta);
let convertedRows = convertRows(FraMeta, convertedCols);

Vue.use(VueRouter);

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const routes = [
  { path: '/', component: AppInstruction },
  { path: '/readme', component: SheetReadme },
  { path: '/sheet', component: SheetContainer, props: { metaRows: convertedRows, metaColumns: convertedCols, rowHeight: 20  } }
];

const router = new VueRouter({ routes });

window.myVue = new Vue({
  el: '#app',
  router: router,
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

