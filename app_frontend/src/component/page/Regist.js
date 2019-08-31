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
      console.log(response.data);
      this.setState({alertText: '333'});
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
              <select onChange={this.changeJlptLevel.bind(this)} className="regist-level">
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
        <div className="alert alert-danger regist-info" role="alert">{this.state.alertText}</div>
      }
      </Animated>
    )
  }
}


export default Regist;
