import Vue from 'vue';
import tooltipComponent from '../components/tooltip-content.vue';

Vue.directive('tooltip', {

  inserted: function (el, binding, vnode) {
    if (binding.value == false) return;
    //get args
    let text, component, props, classList;

    if (binding.arg == 'data') {
        component = binding.value.component;
        props = binding.value.props;
        classList = binding.value.classList;
    }
    else if (binding.arg == 'component') {
        component = binding.value;
    }
    else {
        text = binding.value;
    }



        //element
        //let tooltipBox;
        let tooltipBox1;
        let tooltipBox2;
        let tooltipBox3;
        let tooltipBox4;

        //event
        el.onmouseenter = function () {
            console.log('v-tooltip mouse enter');

            //let componentClass = Vue.extend(tooltipComponent)
            //let instance = new componentClass({ propsData: { text: text, component: component, props: props, classList: classList } });
            //tooltipBox = instance.$mount().$el;
            //document.body.appendChild(tooltipBox);

            let componentClass1 = Vue.extend(tooltipComponent)
            let instance1 = new componentClass1({ propsData: { text: text, component: component, props: props, classList: classList } });
            tooltipBox1 = instance1.$mount().$el;

            let componentClass2 = Vue.extend(tooltipComponent)
            let instance2 = new componentClass2({ propsData: { text: text, component: component, props: props, classList: classList } });
            tooltipBox2 = instance2.$mount().$el;

            let componentClass3 = Vue.extend(tooltipComponent)
            let instance3 = new componentClass3({ propsData: { text: text, component: component, props: props, classList: classList } });
            tooltipBox3 = instance3.$mount().$el;

            let componentClass4 = Vue.extend(tooltipComponent)
            let instance4 = new componentClass4({ propsData: { text: text, component: component, props: props, classList: classList } });
            tooltipBox4 = instance4.$mount().$el;

            tooltipBox1 = document.body.appendChild(tooltipBox1);
            tooltipBox2 = document.body.appendChild(tooltipBox2);
            tooltipBox3 = document.body.appendChild(tooltipBox3);
            tooltipBox4 = document.body.appendChild(tooltipBox4);


            //let direction = window.Portal.Utils.getTooltipPositionv2(el, tooltipBox);

            let direction = window.Portal.Utils.getTooltipPositionv2(el, tooltipBox1);

            //tooltipBox.style.top = direction.recommand.top + 'px';
            //tooltipBox.style.left = direction.recommand.left + 'px';
            //tooltipBox.classList.add(direction.recommand.class);

            //tooltipBox.style.top = direction.up.top + 'px';
            //tooltipBox.style.left = direction.up.left + 'px';
            //tooltipBox.classList.add(direction.up.class);

            //tooltipBox.style.top = direction.left.top + 'px';
            //tooltipBox.style.left = direction.left.left + 'px';
            //tooltipBox.classList.add(direction.left.class);

            //tooltipBox.style.top = direction.right.top + 'px';
            //tooltipBox.style.left = direction.right.left + 'px';
            //tooltipBox.classList.add(direction.right.class);

            tooltipBox1.style.top = direction.recommand.top + 'px';
            tooltipBox1.style.left = direction.recommand.left + 'px';
            tooltipBox1.classList.add(direction.recommand.class);

            tooltipBox2.style.top = direction.up.top + 'px';
            tooltipBox2.style.left = direction.up.left + 'px';
            tooltipBox2.classList.add(direction.up.class);

            tooltipBox3.style.top = direction.left.top + 'px';
            tooltipBox3.style.left = direction.left.left + 'px';
            tooltipBox3.classList.add(direction.left.class);

            tooltipBox4.style.top = direction.right.top + 'px';
            tooltipBox4.style.left = direction.right.left + 'px';
            tooltipBox4.classList.add(direction.right.class);

            //tooltipBox.classList.toggle('show');

            tooltipBox1.classList.toggle('show');
            tooltipBox2.classList.toggle('show');
            tooltipBox3.classList.toggle('show');
            tooltipBox4.classList.toggle('show');
        }

        el.onmouseleave = function () {
            console.log('v-tooltip mouse leave')
            //document.body.removeChild(tooltipBox);
        }
  }
})