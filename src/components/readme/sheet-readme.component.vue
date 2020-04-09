<template>
   <div class="v-sheet-explaination">
    <h3>components</h3>
    <div><p><code>&lt;cell&gt;&lt;/cell&gt;</code> is the most fundamental component of a sheet, during rendering different data attributes will be set on the cell root element, row and column index, x and y coordinates, also is-header and is-freeze. These attributes later will be used for sheet events, it's also easy to query the cell with them.</p></div>
        
    <div><p><code>&lt;grid&gt;&lt;/grid&gt;</code>  is the cell matrix holder (I'm not using css-grid), it doesn't do anything particular, just orgnazing cells row by row, and its content is driven by virtual scroll list passed in from sheet component.</p></div>

    <div></div><p><code>&lt;selection-area&gt;&lt;/selection-area&gt;</code> is the box that covers all selections, it is driven by selections passed in from sheet component.</p>

    <div>
        <p><code>&lt;sheet&gt;&lt;/sheet&gt;</code> this is the root element, also the most complex one, events driven, I think it is still readable by following all the events.</p>
        <p>There are 3 main events, onScroll, onMouseDown, and onKeyDown.</p>
        <p>
            <ul>
                <li>onScroll is mainly for virtual scroll, which will just calculate how many rows to show base on the view height of the sheet, these rows will be sliced from meta rows and pass to &lt;grid&gt;&lt;/grid&gt;, so while you are scrolling, as long as the view height is fixed you always pass the same number of rows to grid.</li>
                <li>onMouseDown is mainly for drag selection, which mimics the behavirous of the spread sheet, while mouse is dragging the corresponding corvered cells will be pushed into the selections by getting the attributes you set on cell. </li>
                <li>onKeyDown is very similar to onMouseDown, change selections correspondingly while receving different keys.</li>
            </ul>
        </p>
    </div>


    <div><p><code>&lt;cell-editor&gt;&lt;/cell-editor&gt;</code> shows on double click a cell, and it renders based on the x and y coordinates of a cell. Now I only have text input as an example, later I will create "drop down", "yes no nubmer" and other components needed and &lt;cell-editor&gt; will be used as a holder of these small components. </p></div>
    <p>Another featrure for cell editor is that it reports out/publish the changes includes the cell row col index, row col Id, as well as the old and new value. We can subscribe to this publish and do the thing we want aysch, like column validation or saving data. </p>
    <p>For cell value validation we should use vue custom filters. I have a filter folder and template there, later I will fill them.</p>


    <div><p><code>&lt;gird-header&gt;&lt;/gird-header&gt;</code> is hacky and you can ignore it for now, its very similar to &lt;grid&gt;, I will add cell merge features on it.</p></div>

    <div><p><code>&lt;sheet-menu&gt;&lt;/sheet-menu&gt;</code> is easy so I didn't do it yet, it should be binded to the onContextMenu event on lt;sheet&gt;, I'm thinking we can have more feature in context menu, because now it is under our control now. </p></div>

    <div><p><code>sheet-data.service.js</code> I copied a very baisc Fra Run template from Portal, this service is transfering the template data into something the component needs, currently I didn't change anything but aggregating properties I need to arries. </p></div>
    <div>
        <h3>Pending things I need to do:</h3>
        <p>  ....  I will update.</p>

        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
    </div>

    <div>
        <h3>Testing:  </h3>
        <p>  ....  I will update.</p>

        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
    </div>

    <div>
        <h3>Integration:  </h3>
        <p>  ....  I will update.</p>

        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
    </div>
   </div>
  

  
</template>

<script>
    export default {

    };
</script>

<style lang="less">
       .v-sheet-explaination{
           color: #6c757d;

           div{
               padding-top: 8px;
               line-height: 24px;
           }

           code{
               font-weight: bold;
               color: #007bff;
           }
       }
</style>
