
const vueTooltip = {
    inserted: function (el, binding) {
        if (binding.value == false) return;
        //get args
        let text, component, props, classList;
        let orientation, pending;

        if (binding.arg == 'data') {
            component = binding.value.component;
            props = binding.value.props;
            classList = binding.value.classList;
            text = binding.value.text;
        }
        else {
            orientation = (binding.modifiers.up && 'up') || orientation;
            orientation = (binding.modifiers.down && 'down') || orientation;
            orientation = (binding.modifiers.right && 'right') || orientation;
            orientation = (binding.modifiers.left && 'left') || orientation;

            if (binding.modifiers.component)
                component = binding.value;
            else
                text = binding.value;
        }

        if (!orientation) {
            orientation = binding.value && binding.value.orientation;
            orientation = ['up', 'down', 'left', 'right'].includes(orientation) ? orientation : 'recommend';  
        }
        pending = binding.value.pending || 0;

        if (!text && !component) {
            console.debug("No valid tooltip data passed in, abort creating tooltipbox");
            return;
        }

        //event
        el.onmouseenter = function () {
            console.debug('v-tooltip mouse enter');

            el._toBeCleared = setTimeout(() => {               
                let componentProps = { text: text, component: component, props: props, classList: classList };
                el._tooltipBox = Portal.Utils.createTooltip(el, orientation, componentProps);
            }, pending);       
        }

        el.onmouseleave = function () {
            console.debug('v-tooltip mouse leave')

            clearTimeout(el._toBeCleared);
            if (el._tooltipBox) el._tooltipBox.remove();
        }
    },
    unbind: function (el) {
        if (el._tooltipBox) el._tooltipBox.remove();
    }
};

export default vueTooltip;
// TODO:GF - clear all other tooltips scattered in the app.
