import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import {Animated} from "react-animated-css";

import BigText from '../util/BigText';

import '../../static/page/Regist.css';


class Regist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      passwordRe: "",
      jlptLevel: "",
      alertText: "",
    };
  }

  changeUsername = (event) =>{
    this.setState({username: event.target.value});
  }

  changePassword = (event) =>{
    this.setState({password: event.target.value});
  }

  changePasswordRe = (event) =>{
    this.setState({passwordRe: event.target.value});
  }

  changeJlptLevel = (event) =>{
    this.setState({jlptLevel: event.target.value});
  }

  sendRegist = () => {
    var username = this.state.username;
    var password = this.state.password;
    var passwordRe = this.state.passwordRe;
    var jlptLevel = this.state.jlptLevel;

    if(username == ''){
        this.setState({alertText: '아이디를 입력해주세요'});
        document.getElementById('regist_id').focus();
        return 0;
    }

    else if( !(username.length > 3 && username.length < 11) ){
        this.setState({alertText: '아이디는 4자 이상 10자 이하로 만들어주세요'});
        document.getElementById('regist_id').focus();
        return 0;
    }
    if(password == ''){
        this.setState({alertText: '비밀번호를 입력해주세요'});
        document.getElementById('regist_password').focus();
        return 0;
    }
    else if( !(password.length > 3 && password.length < 11) ){
        this.setState({alertText: '비밀번호는 4자 이상 10자 이하로 만들어주세요'});
        document.getElementById('regist_password').focus();
        return 0;
    }
    if(passwordRe == ''){
        this.setState({alertText: '비밀번호 확인을 입력해주세요'});
        document.getElementById('regist_repassword').focus();
        return 0;
    }
    else if(passwordRe != password){
        this.setState({alertText: '패스워드가 다릅니다 다시 입력해주세요.'});
        document.getElementById('regist_repassword').focus();
        return 0;
    }
    if(jlptLevel == ''){
        this.setState({alertText: 'JLPT레벨을 선택해주세요.'});
        document.getElementById('regist_level').focus();
        return 0;
    }


    console.log('username -> ', username);
    console.log('password -> ', password);
    console.log('passwordRe -> ', passwordRe);
    console.log('jlptLevel -> ', jlptLevel);

    var url = 'http://127.0.0.1:4000/api/createUser';
    var param = {
      username: username,
      password: password,
      passwordRe: passwordRe,
      jlptLevel: jlptLevel,
    };
    axios.post(url, param).then(response => {
      if(response.data.result == 200) {
        console.log('success');
        this.props.history.push('/login');
      } else if (response.data.result == 300) {
        this.setState({alertText: '이미 존재하는 아이디입니다. 다른 아이디로 가입해주세요!'});
      }
      else {
        this.setState({alertText: '회원가입 실패 : 서버에 오류가 발생했습니다'});
      }
    });
  }

  render() {
    return (
      <Animated animationIn="fadeIn" animationOut="fadeInUpBig" isVisible={true}>
      <div className='form-container'>
          <form>
            <div className="form-group">
              <label for="form-label">
                <i class="fas fa-user-shield mr8"></i>
                아이디
              </label>
              <input onChange={this.changeUsername.bind(this)} type="text" className="form-control input-control" id="regist_id" placeholder=""/>
              <label for="form-label">
                <i className="fas fa-unlock-alt mr8"></i>
                비밀번호
              </label>
              <input onChange={this.changePassword.bind(this)} type="password" className="form-control input-control" id="regist_password" placeholder=""/>
              <label for="form-label">
                <i className="fas fa-unlock-alt mr8"></i>
                비밀번호 확인
              </label>
              <input onChange={this.changePasswordRe.bind(this)} type="password" className="form-control input-control" id="regist_repassword" placeholder=""/>
              <label for="form-label">
                <i class="fas fa-star mr8"></i>
                레벨 선택
              </label>
              <select onChange={this.changeJlptLevel.bind(this)} className="regist-level" id="regist_level">
                  <option value='0' selected>본인의 JLPT 레벨을 선택하세요</option>
                  <option value='1'>N1</option>
                  <option value='2'>N2</option>
                  <option value='3'>N3</option>
                  <option value='4'>N4</option>
                  <option value='5'>N5</option>
              </select>
            </div>
          </form>

          <div className="form-button">
            <button onClick={() => this.sendRegist()} type="submit" className="btn btn-danger">회원가입</button>
          </div>
          <div className='go-regist'><Link to="/Login/">로그인 하시겠습니까...?</Link></div>
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


export default Regist;
