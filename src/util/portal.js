window.Portal = {};
window.Portal.Utils = {};
window.Portal.Utils.Tooltip = {};

window.Portal.Utils.getMouseEqurant = function (mouseX, mouseY, targetRect, offSetX = 0, offSetY = 0) {
    //let uppperEdge = targetRect.top + headerRowCount * 20;
    //console.log('target ------>',target);

    // if(currentTarget.dataset.row && currentTarget.dataset.row == 0){
    //     return 5;
    // }

    // if(currentTarget)

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

window.Portal.Utils.copyToClipboard = function(str){
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

window.Portal.Utils.Tooltip.getTooltipPosition = function (target, tooltipBox) {
    const _arrowSize = 4;
    const _arrowMargin = 2;
    const _edgeMargin = 4;

    let _targetRect = target.getBoundingClientRect();
    let _tootipBoxRect = tooltipBox.getBoundingClientRect();

    let _viewPortHeight = window.innerHeight;
    let _viewPortWidth = window.innerWidth;
    let _targetRectWidth = _targetRect.right - _targetRect.left;
    let _targetRectHeight = _targetRect.bottom - _targetRect.top;
    let _tooltipBoxRectWidth = _tootipBoxRect.right - _tootipBoxRect.left;
    let _tooltipBoxRectHeight = _tootipBoxRect.bottom - _tootipBoxRect.top;

    let _targetTopSpace = _targetRect.top - _arrowSize - _arrowMargin - _tooltipBoxRectHeight;
    let _targetBottomSpace = _viewPortHeight - _targetRect.bottom - _arrowSize - _arrowMargin - _tooltipBoxRectHeight;
    let _targetTopAndBottomLeftSpace = _targetRect.left + _targetRectWidth / 2 - _tooltipBoxRectWidth / 2;
    let _targetTopAndBottomRightSpace = (_viewPortWidth - _targetRect.right) + _targetRectWidth / 2 - _tooltipBoxRectWidth / 2;

    let _targetLeftSpace = _targetRect.left - _arrowSize - _arrowMargin - _tooltipBoxRectWidth;
    let _targetRightSpace = _viewPortWidth - _targetRect.right - _arrowSize - _arrowMargin - _tooltipBoxRectWidth;
    let _targetLeftAndRightTopSpace = _targetRect.top + _targetRectHeight / 2 - _tooltipBoxRectHeight / 2;
    let _targetLeftAndRightBottomSpace = _targetRect.top + _targetRectHeight / 2 - _tooltipBoxRectHeight / 2;


    let direction = {
        up: { top: _targetTopSpace, left: _targetTopAndBottomLeftSpace, class: 'up' },
        down: { top: _targetRect.bottom + _arrowSize + _arrowMargin, left: _targetTopAndBottomLeftSpace, class: 'down' },
        left: { top: _targetLeftAndRightTopSpace, left: _targetLeftSpace, class: 'left' },
        right: { top: _targetLeftAndRightTopSpace, left: _targetRect.right + _arrowSize + _arrowMargin, class: 'right' },
        recommand: { top: 0, left: 0, class: '' }
    };

    let _showTooltipBelow;

    if (_targetBottomSpace > 0 || _targetTopSpace > 0) {
        if (_targetBottomSpace > 0 && _targetTopSpace > 0) {
            if (_targetBottomSpace >= _targetTopSpace) {
                _showTooltipBelow = true;
                direction.recommand.top = _targetRect.bottom + _arrowSize + _arrowMargin;
            }
            else {
                _showTooltipBelow = false;
                direction.recommand.top = _targetRect.top - _arrowSize - _arrowMargin - _tooltipBoxRectHeight;
            }
        }
        else if (_targetBottomSpace > 0) {
            _showTooltipBelow = true;
            direction.recommand.top.top = _targetRect.bottom + _arrowSize + _arrowMargin;
        }
        else if (_targetTopSpace > 0) {
            _showTooltipBelow = false;
            direction.recommand.top = _targetRect.top - _arrowSize - _arrowMargin - _tooltipBoxRectHeight;
        }
        else {
            throw console.error('your tooltip is too heigh.');
        }

        if (_targetTopAndBottomLeftSpace < 0 && _targetTopAndBottomRightSpace < 0) {
            throw console.error('your tooltip is too long.');
        }

        if (_targetTopAndBottomLeftSpace > 0 && _targetTopAndBottomRightSpace > 0) {
            direction.recommand.left = _targetRect.left + _targetRectWidth / 2 - _tooltipBoxRectWidth / 2;
        }
        else if (_targetTopAndBottomLeftSpace < 0) {
            direction.recommand.left = _edgeMargin;
            document.querySelector('.v-tooltip-box').style.setProperty('--arrow-left', (_targetRect.left + _targetRectWidth / 2 - _arrowSize - _edgeMargin) + 'px');
        }
        else if (_targetTopAndBottomRightSpace < 0) {
            direction.recommand.left = _viewPortWidth - _tooltipBoxRectWidth - 4;
            document.querySelector('.v-tooltip-box').style.setProperty('--arrow-left', (_tooltipBoxRectWidth - _targetRectWidth / 2 - _arrowSize) + 'px');
        }

        direction.recommand.class = _showTooltipBelow ? 'down' : 'up';

        return direction;
    }
}



