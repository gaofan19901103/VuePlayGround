import Vue from 'vue';
import tooltipComponent from './tooltip.component.vue';

describe('tooltip component', () => {
   
    it('tooltip component - render plain text', () => {
        let tooltip = Vue.extend(tooltipComponent);
        let props = {
            text: 'hello, tooltip'
        };
        let vn = new tooltip({ propsData: props }).$mount();
        let element = vn.$el;

        expect(element.querySelector('span').textContent).toBe('hello, tooltip');
    });

    it('tooltip component - render text with custom class', () => {

        let tooltip = Vue.extend(tooltipComponent);
        let props = {
            text: 'hello, tooltip',
            classList: ['a', 'b']
        };
        let vn = new tooltip({ propsData: props }).$mount();
        let element = vn.$el;

        expect(element.classList.contains('a')).toBeTrue();
        expect(element.classList.contains('b')).toBeTrue();
    });

    it('tooltip component - render component', () => {
        Vue.component('xxx', { template: `<section>my content</section>` });

        let tooltip = Vue.extend(tooltipComponent);
        let props = {
            component: 'xxx'
        };
        let vn = new tooltip({ propsData: props }).$mount();
        let element = vn.$el;

        expect(element.querySelector('section').textContent).toBe('my content');
    });

    it('tooltip component - render component with props', () => {
        Vue.component('xxx', {
            template: `<section>{{myProp}}</section>`,
            props:['myProp']
        });

        let tooltip = Vue.extend(tooltipComponent);
        let props = {
            component: 'xxx',
            props: {myProp: 'passed prop'}
        };
        let vn = new tooltip({ propsData: props }).$mount();
        let element = vn.$el;

        expect(element.querySelector('section').textContent).toBe('passed prop');
    });
});
