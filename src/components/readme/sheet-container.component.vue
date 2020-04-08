<template>
   <div style="height: 307px; width: 600px; margin-left: 200px; margin-top: 200px; position: relative;">             
        <div style="height: 8px; width: 20px; position:absolute; top: 100%; left: 100%; cursor: nwse-resize;" id="drag">drag me</div>
        <sheet :meta-rows="metaRows" :meta-columns="metaColumns" :row-height="rowHeight"></sheet>
    </div>
</template>

<script>
    export default {
        props:{
           metaRows: {type: Array, required: false, default: [] },
           metaColumns: {type: Array, required: false, default: []},
           rowHeight: {type: Number, required: false, default: 0}
        },
         mounted:function(){
            var testEl = this.$el;
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
        }
    };
</script>

<style lang="less">
       

</style>
