import React from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { Animated } from "react-animated-css";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";

import '../../static/page/Main.css';
const Config = require('../config/config.js');


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kanji         : '',
      inputChat     : '',
      inputHiragana : '',
      chat          : [],
      history       : []
    };
    this.socket = socketIOClient(Config.backendUrl);
  }

  componentWillUnmount = () => {
    this.socket.emit('end');
  }

  componentWillMount = () => {

      // 채팅 기록 초기 로딩 (공통)
      var url = Config.backendUrl + '/api/getChatLog';
      axios.post(url).then(response => {
        this.setState({chat: response.data.result.reverse()});
        this.scrollToBottom();
      });

      // 레벨 분리
      var level = this.props.match.params.id
      var param = {
        'level': level
      }

      // 이력 기록 초기 로딩
      var url = Config.backendUrl + '/api/getHistoryLog'
      axios.post(url, param).then(response => {
        this.setState({history: response.data.result});
      });

      // 현재 한자 초기 로딩
      var url = Config.backendUrl + '/api/getCurrentKanji'
      axios.post(url, param).then(response => {
        this.setState({kanji: response.data.result[0]['kanji'] });
      });

      // 웹소켓 -> 채팅 리스너
      this.socket.on('chat', (data) => {
          const username = data.username;
          const content = data.content;
          const regist_date = data.regist_date;
          const ranking = data.ranking;
          const point = data.point;
          const jlpt_level = data.jlpt_level;
          var data = {
            username: username,
            content: content,
            regist_date: regist_date,
            rank: ranking,
            point: point,
            jlpt_level: jlpt_level,
          }
          var tmp = this.state.chat;
          tmp.push(data)
          this.setState(tmp);
          this.scrollToBottom();
      })

      // 웹소켓 -> 한자 리스너
      var channel_kanji = 'kanji_' + level;
      this.socket.on(channel_kanji, (kanji) => {
          this.setState({kanji: kanji});
      })

      // 웹소켓 -> 이력 리스너
      var channel_history = 'history_' + level;
      this.socket.on(channel_history, (history) => {
          console.log('INFO -> history : ', history);
          this.setState({history: history});
      })
  }

  // 채팅 입력 이벤트
  onChangeChat = (event) =>{
    this.setState({inputChat: event.target.value});
  }

  // 답안 입력 이벤트
  onChangeHiragana = (event) =>{
    this.setState({inputHiragana: event.target.value});
  }

  // 채팅 전송 이벤트
  sendChat = () => {
    const socket = socketIOClient(Config.backendUrl);
    const jwt = localStorage.getItem("jwt");
    const content = this.state.inputChat;
    const payload = {
      'chat': content,
      'jwt': jwt
    }
    if(content == ''){
      return false;
    }
    socket.emit('chat', payload);
    this.setState({inputChat: ''});
    socket.emit('end');
  }

  // 답안 전송 이벤트 (마지막 작업)
  sendHiragana = () => {
    var url = Config.backendUrl + '/api/sendHiragana'
    const jwt = localStorage.getItem("jwt");
    var hiragana = this.state.inputHiragana;
    var level = this.props.match.params.id
    const payload = {
      'hiragana': hiragana,
      'level': level
    }
    if(hiragana == ''){
      return false;
    }
    axios.defaults.headers.common['authorization'] = jwt
    axios.post(url, payload).then(response => {
      var result = response.data.result
      this.setState({inputHiragana: ''});
      console.log('result -> ', result);
    });
  }

  // 채팅 엔터키 이벤트
  handleKeyDownChat = (e) => {
    if (e.key === 'Enter') {
      this.sendChat();
    }
  }

  // 답안 엔터키 이벤트
  handleKeyDownHiragana = (e) => {
    if (e.key === 'Enter') {
      this.sendHiragana();
    }
  }

  // 채팅 스크롤 하단 이동
  scrollToBottom = () => {
    const {thing} = this.refs;
    try {
      thing.scrollTop = thing.scrollHeight - thing.clientHeight;
    } catch (e){
      console.log('e -> ', e);
    }
  }

  render() {
    return (
      <Animated animationIn="fadeIn" animationOut="fadeInUpBig" isVisible={true}>
      <div>
        <div className='main-container'>
          <div className='main-content'>
            <div className='hanja-container'>
              <div className='hanja-box'>
                {
                  this.state.kanji === ''
                  ?
                  <div>
                    <img className='kanji-null-img' src={process.env.PUBLIC_URL + '/move/move6.gif'}/>
                    <div className='kanji-null-ttt'>문제 준비 중입니다...</div>
                  </div>
                  :
                  this.state.kanji
                }
              </div>
            </div>
            <div className='sendbox-container'>
              {
                this.props.loginStatus === 0
                ?
                <input type="text" disabled className="form-control x nologin" placeholder="로그인 후 이용할 수 있습니다" value={this.state.inputHiragana} onKeyDown={this.handleKeyDownHiragana} onChange={this.onChangeHiragana.bind(this)}/>
                :
                <input type="text" className="form-control x" placeholder="" value={this.state.inputHiragana} onKeyDown={this.handleKeyDownHiragana} onChange={this.onChangeHiragana.bind(this)}/>

              }
              {
                this.props.loginStatus === 0
                ?
                <button disabled onClick={() => this.sendHiragana()} type="button" className="btn btn-success y">정답 제출</button>
                :
                <button onClick={() => this.sendHiragana()} type="button" className="btn btn-success y">정답 제출</button>

              }
            </div>
            <div className='chat-title'>
              <i className="far fa-comment-dots dotdot"></i>
              <span className='chat-title-font'>채팅방</span>
            </div>
            <div className='chat-content' ref={'thing'}>
              {this.state.chat.map((item, key) =>
                  <div className='c-row' key={key}>
                      <span className='c-name'>{item.username}</span>
                      <span className='c-rank'>랭킹 {item.rank}위</span>
                      <span className='c-jlpt'>JLPT N{item.jlpt_level}</span>
                      <span className='c-point'>{item.point} point</span>
                      <div className='c-content'>{item.content}</div>
                      <div className='c-date'>{item.regist_date}</div>
                  </div>
              )}
              {
                this.state.chat.length === 0?
                <div className='history-null'>
                  <div className='chat-null-txt'>
                     채팅내역이 존재하지 않습니다
                  </div>
                </div>
                :
                <div></div>
              }
            </div>
            <div className='sendbox-container'>
              {
                this.props.loginStatus === 0
                ?
                <input disabled value={this.state.inputChat} onKeyDown={this.handleKeyDownChat} onChange={this.onChangeChat.bind(this)} className='x' type="text" className="form-control nologin x" placeholder="로그인 후 이용할 수 있습니다"></input>
                :
                <input value={this.state.inputChat} onKeyDown={this.handleKeyDownChat} onChange={this.onChangeChat.bind(this)} className='x' type="text" className="form-control x" placeholder=""></input>
              }
              {
                this.props.loginStatus === 0
                ?
                <Button disabled onClick={() => this.sendChat() } className='y' variant="warning">전송</Button>
                :
                <Button onClick={() => this.sendChat() } className='y' variant="warning">전송</Button>
              }
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
                <div className='history-box' key={key}>
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
                  <div className='history-txt'>
                    {item.hangul}
                  </div>
                  <div className='history-time'>
                    {item.modify_date}
                  </div>
                </div>
              )}
              {
                this.state.history.length === 0
                ?
                <div className='history-null'>
                  <div className='history-null-txt'>
                    이력이 존재하지 않습니다
                  </div>
                </div>
                :
                <div></div>
              }

            </div>
          </div>
        </div>
      </div>
      </Animated>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    loginStatus: state.loginStatus
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    login: () => dispatch({ type: 'LOGIN' }),
    logout: () => dispatch({ type: 'LOGOUT' }),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);
// export default Main;
