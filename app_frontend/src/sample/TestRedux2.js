import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { connect } from "react-redux";


class TestRedux2 extends React.Component {

  clickInc = () => {
    //
  }

  clickDec = () => {
    //
  }

  render() {
    return (
      <div>
        <div className='debug-text'>{this.props.text}</div>
        <div className='debug-count'>{this.props.count}</div>
        <div className='debug-box'>
          <button onClick={() => this.clickInc()} type="button" className="btn btn-success mrl5">Increse</button>
          <button onClick={() => this.clickDec()} type="button" className="btn btn-danger mrl5">Decrese</button>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  console.log('state -> ', state);
  console.log('state.counter -> ', state.counter);
  console.log('state.text -> ', state.text);
  return {
    count: state.counter,
    text: state.text
  };
}


export default connect(mapStateToProps, null)(TestRedux2);
