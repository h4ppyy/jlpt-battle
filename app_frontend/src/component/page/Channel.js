import React from 'react';
import axios from 'axios';
import { Animated } from "react-animated-css";
import { connect } from "react-redux";

import '../../static/page/Channel.css';


class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
  }

  componentWillMount = () => {

  }

  moveChannel = (level) =>{
    this.props.history.push('/' + level);
  }

  render() {
    return (
      <Animated animationIn="fadeIn" animationOut="fadeInUpBig" isVisible={true}>
      <div className='channel-box'>
        <div className='channel-title'>
          <img alt='rated' className='rank-top-img' src={process.env.PUBLIC_URL + '/channel/sea.png'}/>
          <div className='channel-txt'>난이도 선택</div>
        </div>
        <div className='card-box'>

          <div className='channel-card hvr-grow' onClick={() => this.moveChannel('n1')}>
            <div className='channel-card-img'>
              <img alt='rated' className='rank-top-img' src={process.env.PUBLIC_URL + '/channel/ghost.png'}/>
            </div>
            <div className='channel-card-title'>
              JLPT N1
            </div>
          </div>

          <div className='channel-card hvr-grow' onClick={() => this.moveChannel('n2')}>
            <div className='channel-card-img'>
              <img alt='rated' className='rank-top-img' src={process.env.PUBLIC_URL + '/channel/daruma.png'}/>
            </div>
            <div className='channel-card-title'>
              JLPT N2
            </div>
          </div>

          <div className='channel-card hvr-grow' onClick={() => this.moveChannel('n3')}>
            <div className='channel-card-img'>
              <img alt='rated' className='rank-top-img' src={process.env.PUBLIC_URL + '/channel/geisha.png'}/>
            </div>
            <div className='channel-card-title'>
              JLPT N3
            </div>
          </div>

        </div>
        <div className='card-box'>

          <div className='channel-card hvr-grow' onClick={() => this.moveChannel('n4')}>
            <div className='channel-card-img'>
              <img alt='rated' className='rank-top-img' src={process.env.PUBLIC_URL + '/channel/maneki-neko.png'}/>
            </div>
            <div className='channel-card-title'>
              JLPT N4
            </div>
          </div>

          <div className='channel-card hvr-grow' onClick={() => this.moveChannel('n5')}>
            <div className='channel-card-img'>
              <img alt='rated' className='rank-top-img' src={process.env.PUBLIC_URL + '/channel/noodles.png'}/>
            </div>
            <div className='channel-card-title'>
              JLPT N5
            </div>
          </div>

          <div className='channel-card hvr-grow' onClick={() => this.moveChannel('free')}>
            <div className='channel-card-img'>
              <img alt='rated' className='rank-top-img' src={process.env.PUBLIC_URL + '/channel/fan.png'}/>
            </div>
            <div className='channel-card-title'>
              자유
            </div>
          </div>

        </div>
      </div>
      </Animated>
    )
  }
}


export default Channel;
