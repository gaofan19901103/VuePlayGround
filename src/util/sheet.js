
window.Portal.Utils.Sheet = {};

window.Portal.Utils.Sheet.getMouseEqurant = function (mouseX, mouseY, targetRect, offSetX = 0, offSetY = 0) {
    
    let uppperEdge = targetRect.top + offSetY;
    let lowerEdge = targetRect.top + targetRect.height;
    let leftEdge = targetRect.left + offSetX;
    let rightEdge = targetRect.left + targetRect.width;

    if (mouseX >= leftEdge && mouseX <= rightEdge && mouseY >= uppperEdge && mouseY <= lowerEdge) {
        return 5;
    }
    else {
        if (mouseY < uppperEdge) {
            if (mouseX < leftEdge)
                return 1;
            else if (mouseX > rightEdge)
                return 3;
            else
                return 2;
        }
        else if (mouseY > lowerEdge) {
            if (mouseX < leftEdge)
                return 7;
            else if (mouseX > rightEdge)
                return 9
            else
                return 8;
        }
        else {
            if (mouseX < leftEdge)
                return 4;
            else
                return 6;
        }
    }
}

window.Portal.Utils.Sheet.copyToClipboard = function(str){
    //document.getSelection().removeAllRanges(); 

    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}




