import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import {Animated} from "react-animated-css";

import BigText from '../util/BigText';

import '../../static/page/Regist.css';


class Regist extends React.Component {
  constructor(props) {
    super(props);
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
              <input type="email" className="form-control input-control" id="regist_id" placeholder=""/>
              <label for="form-label">
                <i className="fas fa-unlock-alt mr8"></i>
                비밀번호
              </label>
              <input type="password" className="form-control input-control" id="regist_password" placeholder=""/>
              <label for="form-label">
                <i className="fas fa-unlock-alt mr8"></i>
                비밀번호 확인
              </label>
              <input type="password" className="form-control input-control" id="regist_repassword" placeholder=""/>
              <label for="form-label">
                <i class="fas fa-star mr8"></i>
                레벨 선택
              </label>
              <select className="regist-level">
                  <option value='' selected>본인의 JLPT 레벨을 선택하세요</option>
                  <option value='N1'>N1</option>
                  <option value='N2'>N2</option>
                  <option value='N3'>N3</option>
                  <option value='N4'>N4</option>
                  <option value='N5'>N5</option>
              </select>
            </div>
          </form>

          <div className="form-button">
            <button type="submit" className="btn btn-danger">회원가입</button>
          </div>
          <div className='go-regist'><Link to="/Login/">로그인 하시겠습니까...?</Link></div>
      </div>
      </Animated>
    )
  }
}


export default Regist;
