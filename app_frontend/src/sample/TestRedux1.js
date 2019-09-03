import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { connect } from "react-redux";


//class TestRedux2 extends React.Component {
const TestRedux1 = ({count, text, increment, decrement}) => {
    return (
      <div>
        <div className='debug-text'>{text}</div>
        <div className='debug-count'>{count}</div>
        <div className='debug-box'>
          <button onClick={increment} type="button" className="btn btn-success mrl5">Increse</button>
          <button onClick={decrement} type="button" className="btn btn-danger mrl5">Decrese</button>
        </div>
      </div>
    );
}


const mapStateToProps = (state) => {
  console.log('state -> ', state);
  console.log('state.counter -> ', state.counter);
  console.log('state.text -> ', state.text);
  return {
    count: state.counter,
    text: state.text
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(TestRedux1);
