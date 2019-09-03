import React from 'react';
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import {Animated} from "react-animated-css";

import BigText from '../util/BigText';
import '../../static/page/Login.css';
const Config = require('../config/config.js');


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username    : "",
      password    : "",
      alertText   : "",
    };
  }

  changeUsername = (event) =>{
    this.setState({username: event.target.value});
  }

  changePassword = (event) =>{
    this.setState({password: event.target.value});
  }

  sendLogin = () => {
    var username = this.state.username;
    var password = this.state.password;

    if(username == ''){
        this.setState({alertText: '아이디를 입력해주세요'});
        document.getElementById('login_id').focus();
        return false;
    } else if(password == ''){
        this.setState({alertText: '비밀번호를 입력해주세요'});
        document.getElementById('login_password').focus();
        return false;
    }

    var url = Config.backendUrl + '/api/loginUser';
    var param = {
      username: username,
      password: password,
    };
    axios.post(url, param).then(response => {
      console.log('response.data.result -> ', response.data.result);
      var reponseCode = response.data.result;
      if(reponseCode == Config.CODE_SUCCESS) {
          var token = response.data.token;
          localStorage.setItem('jwt', token);
      } else if(reponseCode == Config.CODE_ID_NOT_ALLOW || reponseCode == Config.CODE_PW_NOT_ALLOW) {
          this.setState({alertText: '허용하지 않는 문자가 입력되었습니다'});
      }
      else {
          this.setState({alertText: '아이디 또는 비밀번호가 일치하지 않습니다'});
      }
    });
  }


  render() {
    return (
      <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
      <div className='form-container'>
          <form>
            <div className="form-group">
              <label for="form-label">
                <i class="fas fa-user-shield mr8"></i>
                아이디
              </label>
              <input onChange={this.changeUsername.bind(this)} type="email" className="form-control input-control" id="login_id" placeholder=""/>
              <label for="form-label">
                <i className="fas fa-unlock-alt mr8"></i>
                비밀번호
              </label>
              <input onChange={this.changePassword.bind(this)} type="password" className="form-control input-control" id="login_password" placeholder=""/>
            </div>
          </form>
          <div className="form-button">
          <button onClick={() => this.sendLogin()} type="submit" className="btn btn-danger">로그인</button>
          </div>
      </div>
      {
        this.state.alertText == '' ?
        <div></div> :
        <Animated animationIn="fadeIn" animationOut="fadeInUpBig" isVisible={true}>
          <div className="alert alert-danger regist-info" role="alert">{this.state.alertText}</div>
        </Animated>
      }
      </Animated>
    )
  }
}


export default Login;
