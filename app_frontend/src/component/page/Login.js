import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import {Animated} from "react-animated-css";

import BigText from '../util/BigText';

import '../../static/page/Login.css';


class Login extends React.Component {
  constructor(props) {
    super(props);
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
              <input type="email" className="form-control input-control" id="exampleInputID" placeholder=""/>
              <label for="form-label">
                <i className="fas fa-unlock-alt mr8"></i>
                비밀번호
              </label>
              <input type="password" className="form-control input-control" id="exampleInputPassword" placeholder=""/>
            </div>
            <div className="form-button">
              <button type="submit" className="btn btn-danger">로그인</button>
            </div>
            <div className='go-regist'><Link to="/regist/">아직 회원이 아니신가요...? 회원가입</Link></div>
          </form>
      </div>
      </Animated>
    )
  }
}


export default Login;
