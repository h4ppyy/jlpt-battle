import React from 'react';
import { connect } from "react-redux";


class TestReduxClass1 extends React.Component {
    render() {
        return (
          <div>
            <div className='debug-text'>{this.props.text}</div>
            <div className='debug-count'>{this.props.count}</div>
            <div className='debug-box'>
              <button onClick={this.props.increment} type="button" className="btn btn-success mrl5">Increse</button>
              <button onClick={this.props.decrement} type="button" className="btn btn-danger mrl5">Decrese</button>
            </div>
          </div>
        );
    }
}


const mapStateToProps = (state) => {
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


export default connect(mapStateToProps, mapDispatchToProps)(TestReduxClass1);
