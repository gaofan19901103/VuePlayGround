import Vue from 'vue';
import container from './reset-submission-view.vue'; 

describe('reset-submission-view component UT', () => {

    it('has a created hook', () => {
      let x = container;
      expect(typeof container.data).toBe('function')
    });

    it('mount', () => {
        let x = container;
        const vm = new Vue(container).$mount();
        expect(typeof container.data).toBe('function')
      });
});