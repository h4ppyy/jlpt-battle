import React from 'react';
import { Button, Form } from 'react-bootstrap';
import socketIOClient from "socket.io-client";
import ScrollableFeed from 'react-scrollable-feed'

import BigText from '../util/BigText';

import '../../static/page/Main.css';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: "127.0.0.1:4000",
      kanji: '愛想',
      inputChat: '',
      chat: [
        {"id":"1", "username":"hackx", "content":"안녕하세요 이거 어떻게 하는건가요...?"},
        {"id":"2", "username":"hackx", "content":"정답 제출 누르면 되는건가요?"},
        {"id":"3", "username":"93immm", "content":"남들 보다 빨리 제출하면 포인트 획득하는거에요!"},
      ],
      history: [
        {"id":"1", "username":"hackx", "content":"こいする", "time":"2019-01-01 00:00:00"},
        {"id":"2", "username":"93immm", "content":"げんてん", "time":"2019-01-01 00:00:00"},
        {"id":"3", "username":"ququ3434", "content":"けんりょく", "time":"2019-01-01 00:00:00"},
        {"id":"4", "username":"back02", "content":"カテゴリー", "time":"2019-01-01 00:00:00"},
        {"id":"5", "username":"Damnald", "content":"こうげん", "time":"2019-01-01 00:00:00"},
        {"id":"6", "username":"Eallaun", "content":"かなわない", "time":"2019-01-01 00:00:00"},
        {"id":"7", "username":"Iseticus", "content":"おさえる", "time":"2019-01-01 00:00:00"},
        {"id":"8", "username":"Jennia", "content":"いなびかり", "time":"2019-01-01 00:00:00"},
        {"id":"9", "username":"Wilbehrt", "content":"インフォメーション", "time":"2019-01-01 00:00:00"},
        {"id":"10", "username":"Xippille", "content":"こうしゅう", "time":"2019-01-01 00:00:00"},
      ]
    };
  }

  scrollToBottom() {
    const {thing} = this.refs;
    thing.scrollTop = thing.scrollHeight - thing.clientHeight;
  }

  componentDidMount = () => {
     const socket = socketIOClient(this.state.endpoint);

     socket.on('chat', (chat) => {
       //console.log('chat -> ', chat);
       var tmp = this.state.chat;
       tmp.push({"id":"4", "username":"anonymous", "content":chat})
       this.setState(tmp);
       this.scrollToBottom();
     })

     socket.on('kanji', (kanji) => {
       //console.log('kanji -> ', kanji);
       this.setState({kanji: kanji});
     })
  }

  onChange = (event) =>{
    //console.log('event.target.value -> ', event.target.value);
    this.setState({inputChat: event.target.value});
  }

  sendChat = () => {
    //console.log('sendChat');
    const socket = socketIOClient(this.state.endpoint);
    var content = this.state.inputChat;
    socket.emit('chat', content);
    this.setState({inputChat: ''});
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      //console.log('enter event');
      this.sendChat();
    }
  }

  render() {
    return (
      <div>

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
            <div className='chat-content' ref={'thing'}>
              {this.state.chat.map((item, key) =>
                  <div key={key}>{item.username} : {item.content}</div>
              )}
            </div>
            <div className='sendbox-container'>
              <Form.Control tabIndex="0" value={this.state.inputChat} onKeyDown={this.handleKeyDown} onChange={this.onChange.bind(this)} className='x' type="text" placeholder="" />
              <Button onClick={() => this.sendChat() } className='y' variant="warning">전송</Button>
            </div>
          </div>
          <div className='main-history'>
            <div className='history-title'>
              <i className="fas fa-check green"></i>
              <span className='check-title'>
              정답 이력
              </span>
            </div>
            <div className='support-text'>
            최근 제출 이력 10개를 보여줍니다
            </div>
            <div className='history-content'>

              {this.state.history.map((item, key) =>
                <div className='history-box'>
                  <div className='flex'>
                    <div className='flex-default'>
                      {item.username}
                    </div>
                    <div className='flex-default'>
                      {item.content}
                    </div>
                  </div>
                  <div className='history-time'>
                    {item.time}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default Main;
