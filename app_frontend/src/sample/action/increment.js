export function increment(state){
    var result = state.counter + 1
    var resultState = {
      counter: result,
      text: state.text
    };
    return resultState;
}
