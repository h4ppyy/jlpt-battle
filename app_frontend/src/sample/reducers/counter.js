import { increment } from '../action/increment.js'

var initialState = {
  counter: 5,
  text: 'world'
};

function counter(state = initialState, action) {
    switch (action.type) {
        case 'INCREMENT':
            return increment(state);
        case 'DECREMENT':
            return increment(state);
        default:
            return state;
    }
}

export default counter;
