import React from 'react';
import { Button, Form } from 'react-bootstrap';
import Websocket from 'react-websocket';

import BigText from '../util/BigText';

import '../../static/page/Main.css';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kanji: '愛想'
    };
  }

  handleData(data) {
    let result = JSON.parse(data);
    this.setState({kanji: result.movement});
  }

  render() {
    return (
      <div>
        <Websocket url='ws://localhost:8888/live/product/12345/' onMessage={this.handleData.bind(this)}/>

        <div className='main-container'>
          <div className='main-content'>
            <div className='hanja-container'>
              <div className='hanja-box'>
                {this.state.kanji}
              </div>
            </div>
            <div className='sendbox-container'>
              <Form.Control className='x' type="text" placeholder="" />
              <Button className='y' variant="success">정답 제출</Button>
            </div>
            <div className='chat-title'>
              <i class="far fa-comment-dots dotdot"></i>
              <span class='chat-title-font'>채팅방</span>
            </div>
            <div className='chat-content'>
              <div>admin : aaaaaaaaaaaaaaa</div>
              <div>admin : aaaaaaaaaaaaaaa</div>
              <div>admin : aaaaaaaaaaaaaaa</div>
              <div>admin : aaaaaaaaaaaaaaa</div>
            </div>
            <div className='sendbox-container'>
              <Form.Control className='x' type="text" placeholder="" />
              <Button className='y' variant="warning">전송</Button>
            </div>
          </div>
          <div className='main-history'>
            <div className='history-title'>
              <i className="fas fa-check green"></i>
              <span className='check-title'>
              정답 이력
              </span>
            </div>
            <div className='history-content'>

              <div className='history-box'>
                <div className='flex'>
                  <div className='flex-default'>
                    hackx
                  </div>
                  <div className='flex-default'>
                    愛想
                  </div>
                </div>
                <div className='history-time'>
                  2019-01-01 00:00:00
                </div>
              </div>

              <div className='history-box'>
                <div className='flex'>
                  <div className='flex-default'>
                    93immm
                  </div>
                  <div className='flex-default'>
                    合間
                  </div>
                </div>
                <div className='history-time'>
                  2019-01-01 00:00:00
                </div>
              </div>

              <div className='history-box'>
                <div className='flex'>
                  <div className='flex-default'>
                    ququ3434
                  </div>
                  <div className='flex-default'>
                    間柄
                  </div>
                </div>
                <div className='history-time'>
                  2019-01-01 00:00:00
                </div>
              </div>

              <div className='history-box'>
                <div className='flex'>
                  <div className='flex-default'>
                    back02
                  </div>
                  <div className='flex-default'>
                    敢えて
                  </div>
                </div>
                <div className='history-time'>
                  2019-01-01 00:00:00
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default Main;
