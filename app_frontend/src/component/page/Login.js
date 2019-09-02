import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import {Animated} from "react-animated-css";

import BigText from '../util/BigText';

import '../../static/page/Login.css';

import axios from "axios";

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
        return 0;
    }

    if(password == ''){
        this.setState({alertText: '비밀번호를 입력해주세요'});
        document.getElementById('login_password').focus();
        return 0;
    }

    var url = Config.backendUrl + '/api/loginUser';
    var param = {
      username: username,
      password: password,
    };
    axios.post(url, param).then(response => {
        if(response.data.result == Config.CODE_SUCCESS) {
            var jwt = response.data.token;
            console.log(response.data);
            localStorage.setItem('jwt', jwt);
        }
    });
  }


  render() {
    return (
      <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
      <div className='form-container'>
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
          <div className="form-button">
          <button onClick={() => this.sendLogin()} type="submit" className="btn btn-danger">로그인</button>
          </div>
            <div className='go-regist'><Link to="/regist/">아직 회원이 아니신가요...? 회원가입</Link></div>

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
