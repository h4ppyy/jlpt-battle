var initialState = {
  counter: 5,
  text: 'world'
};

function counter(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state.counter + 1;
    case 'DECREMENT':
      return state.counter - 1;
    default:
      return state;
  }
}

export default counter;
