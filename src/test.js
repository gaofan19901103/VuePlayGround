require('./main.js');
import Vue from 'vue';
import container from './container.vue'; 

describe('Test',function(){
    beforeEach(function(){
        console.log('Test beforeEach');
    });

    it('a test it', function(){
        let result = 1 + 1;
        expect(result).toBe(2);
    });
});


describe('container component', () => {

    it('has a created hook', () => {
      expect(typeof container.data).toBe('function')
    });
});