import React from 'react';
import axios from 'axios';
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
      kanji: '',
      inputChat: '',
      inputHiragana: '',
      chat: [],
      history: [],
      progress: 100,
    };
  }

  scrollToBottom() {
    const {thing} = this.refs;
    try {
      thing.scrollTop = thing.scrollHeight - thing.clientHeight;
    } catch (e){
      console.log('e -> ', e);
    }
  }

  componentDidMount = () => {
      var self = this;

      var countup = function(){
        console.log('progress -> ', self.state.progress);
        self.setState({progress: self.state.progress - 1});
      }
      setInterval(countup, 1000);

      this.setState({progress: 0});
      /*
      var url = 'http://127.0.0.1:4000/api/getProgress'
      axios.post(url).then(response => {
        console.log('progress -> ', response.data.result);
      });
      */

      var url = 'http://127.0.0.1:4000/api/getChatLog'
      axios.post(url).then(response => {
        this.setState({chat: response.data.result.reverse()});
      });

      var url = 'http://127.0.0.1:4000/api/getHistoryLog'
      axios.post(url).then(response => {
        response.data.result.shift();
        this.setState({history: response.data.result});
      });

      var url = 'http://127.0.0.1:4000/api/getCurrentKanji'
      axios.post(url).then(response => {
        this.setState({kanji: response.data.result[0]['kanji'] });
      });

      const socket = socketIOClient(this.state.endpoint);
      socket.on('chat', (chat) => {
          var tmp = this.state.chat;
          tmp.push({"id":"0", "username":"운영자", "content":chat})
          this.setState(tmp);
          this.scrollToBottom();
      })

      socket.on('kanji', (kanji) => {
          this.setState({kanji: kanji});
      })

      socket.on('history', (history) => {
          console.log('INFO -> history : ', history);
          history.shift();
          this.setState({history: history});
          this.setState({progress: 100});
      })
  }

  onChangeChat = (event) =>{
    this.setState({inputChat: event.target.value});
  }

  onChangeHiragana = (event) =>{
    this.setState({inputHiragana: event.target.value});
  }

  sendChat = () => {
    const socket = socketIOClient(this.state.endpoint);
    var content = this.state.inputChat;
    socket.emit('chat', content);
    this.setState({inputChat: ''});
  }

  sendHiragana = () => {
    var content = this.state.inputHiragana;
    var url = 'http://127.0.0.1:4000/api/sendHiragana'
    this.setState({inputHiragana: ''});
    axios.post(url, {content: content}).then(response => {
      console.log(response.data);
    });
  }

  handleKeyDownChat = (e) => {
    if (e.key === 'Enter') {
      this.sendChat();
    }
  }

  handleKeyDownHiragana = (e) => {
    if (e.key === 'Enter') {
      this.sendHiragana();
    }
  }
  render() {
    const progress = {
      width: String(this.state.progress) + '%'
    };
    return (
      <div>
        <div className='main-container'>
          <div className='main-content'>
            <div className='hanja-container'>
              <div className='hanja-box'>
                {this.state.kanji}
              </div>
            </div>
            <div className="progress-container">
              <div className="progress">
                <div style={progress} className="progress-bar progress-bar-striped bg-danger" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <div className='sendbox-container'>
              <Form.Control tabIndex="0" value={this.state.inputHiragana} onKeyDown={this.handleKeyDownHiragana} onChange={this.onChangeHiragana.bind(this)} className='x' type="text" placeholder="" />
              <Button onClick={() => this.sendHiragana() } className='y' variant="success">정답 제출</Button>
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
              <Form.Control tabIndex="0" value={this.state.inputChat} onKeyDown={this.handleKeyDownChat} onChange={this.onChangeChat.bind(this)} className='x' type="text" placeholder="" />
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
                      {item.kanji}
                    </div>
                    <div className='flex-default'>
                      {item.hiragana}
                    </div>
                  </div>
                  <div className='history-time'>
                    {item.modify_date}
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
