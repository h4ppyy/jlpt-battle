var initialState = {
  counter: 5,
  text: 'world'
};

function counter(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      console.log('call INCREMENT');
      return {
        counter: state.counter + 1,
        text: state.text
      }
    case 'DECREMENT':
      console.log('call DECREMENT');
      return {
        counter: state.counter - 1,
        text: state.text
      }
    default:
      return state;
  }
}

export default counter;
