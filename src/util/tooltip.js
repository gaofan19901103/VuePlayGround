import Vue from 'vue';
import tooltipComponent from '../components/tooltip/tooltip.component.vue';


Portal.Utils.getTooltipDirection = function (target, tooltipBox) {
    //constants
    const _arrowSize = 8;
    const _arrowMargin = 2;
    const _edgeMargin = 4;
    const orientations = ['up', 'down', 'left', 'right'];
    const tooltipBoxBaseClass = 'v-tooltip-box';
    const tooltipCustomVariable = '--arrow-left';

    //variables for calculation
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
    //let _targetRightSpace = _viewPortWidth - _targetRect.right - _arrowSize - _arrowMargin - _tooltipBoxRectWidth;  
    let _targetLeftAndRightTopSpace = _targetRect.top + _targetRectHeight / 2 - _tooltipBoxRectHeight / 2;
    //let _targetLeftAndRightBottomSpace = _targetRect.top + _targetRectHeight / 2 - _tooltipBoxRectHeight / 2;


    // position calculation
    if (_targetBottomSpace > 0 || _targetTopSpace > 0) {
        //object to return
        let direction = {
            up: { top: _targetTopSpace, left: _targetTopAndBottomLeftSpace, class: 'up' },
            down: { top: _targetRect.bottom + _arrowSize + _arrowMargin, left: _targetTopAndBottomLeftSpace, class: 'down' },
            left: { top: _targetLeftAndRightTopSpace, left: _targetLeftSpace, class: 'left' },
            right: { top: _targetLeftAndRightTopSpace, left: _targetRect.right + _arrowSize + _arrowMargin, class: 'right' },
            recommend: { top: 0, left: 0, class: '' }
        };

        //validate each orientation
        orientations.forEach(orientation => {
            if (direction[orientation].top > 0
                && direction[orientation].left > 0
                && _viewPortHeight > direction[orientation].top + _tooltipBoxRectHeight
                && _viewPortWidth > direction[orientation].left + _tooltipBoxRectWidth) {
                direction[orientation].valid = true;
            }
            else {
                direction[orientation].valid = false;
            }
        });

        // get recommend orientation
        let _showTooltipBelow;

        if (_targetBottomSpace > 0 && _targetTopSpace > 0) {
            if (_targetBottomSpace >= _targetTopSpace) {
                _showTooltipBelow = true;
                direction.recommend.top = _targetRect.bottom + _arrowSize + _arrowMargin;
            }
            else {
                _showTooltipBelow = false;
                direction.recommend.top = _targetRect.top - _arrowSize - _arrowMargin - _tooltipBoxRectHeight;
            }
        }
        else if (_targetBottomSpace > 0) {
            _showTooltipBelow = true;
            direction.recommend.top = _targetRect.bottom + _arrowSize + _arrowMargin;
        }
        else if (_targetTopSpace > 0) {
            _showTooltipBelow = false;
            direction.recommend.top = _targetRect.top - _arrowSize - _arrowMargin - _tooltipBoxRectHeight;
        }

        if (_targetTopAndBottomLeftSpace < 0 && _targetTopAndBottomRightSpace < 0) {
            throw (`there is not enough space to show this tooltip with width ${_tooltipBoxRectWidth}`);
        }

        if (_targetTopAndBottomLeftSpace > 0 && _targetTopAndBottomRightSpace > 0) {
            direction.recommend.left = _targetRect.left + _targetRectWidth / 2 - _tooltipBoxRectWidth / 2;
        }
        else if (_targetTopAndBottomLeftSpace < 0) {
            direction.recommend.left = _edgeMargin;
            document.querySelector(`.${tooltipBoxBaseClass}`).style.setProperty(tooltipCustomVariable, (_targetRect.left + _targetRectWidth / 2 - _arrowSize - _edgeMargin) + 'px');
        }
        else if (_targetTopAndBottomRightSpace < 0) {
            let tooltipBoxLeft = _viewPortWidth - _tooltipBoxRectWidth - _edgeMargin
            direction.recommend.left = tooltipBoxLeft;
            document.querySelector(`.${tooltipBoxBaseClass}`).style.setProperty(tooltipCustomVariable, (_targetRect.right - tooltipBoxLeft - _targetRectWidth / 2 - _arrowSize / 2) + 'px');
        }

        direction.recommend.class = _showTooltipBelow ? 'down' : 'up';
        direction.recommend.valid = true;

        return direction;
    }
    else {
        throw (`there is not enough space to show this tooltip with height ${_tooltipBoxRectHeight}`);
    }
};

Portal.Utils.createTooltip = function (target, orientation, componentProps) {
    let tooltipBox;
    let componentClass = Vue.extend(tooltipComponent)
    let instance = new componentClass({ propsData: componentProps });
    tooltipBox = instance.$mount().$el;
    tooltipBox = document.body.appendChild(tooltipBox);

    let direction = window.Portal.Utils.getTooltipDirection(target, tooltipBox);

    if (direction[orientation] && direction[orientation].valid) {
        tooltipBox.style.top = direction[orientation].top + 'px';
        tooltipBox.style.left = direction[orientation].left + 'px';
        tooltipBox.classList.add(direction[orientation].class);
    }
    else {
        console.debug(`not enough space to show the tooltip ${orientation}, change to recommend orientation`);
        tooltipBox.style.top = direction['recommend'].top + 'px';
        tooltipBox.style.left = direction['recommend'].left + 'px';
        tooltipBox.classList.add(direction['recommend'].class);
    }

    return tooltipBox;
};


