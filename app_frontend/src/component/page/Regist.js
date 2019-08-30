import React from 'react';
import '../../static/page/Regist.css';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import BigText from '../util/BigText';


class Regist extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='form-container'>
          <form>
            <div className="form-group">
              <label for="form-label">아이디</label>
              <input type="email" className="form-control input-control" id="regist_id" placeholder="Enter ID"/>
              <label for="form-label">비밀번호</label>
              <input type="password" className="form-control input-control" id="regist_password" placeholder="Password"/>
              <label for="form-label">비밀번호 확인</label>
              <input type="password" className="form-control input-control" id="regist_repassword" placeholder="Re password"/>
              <label for="form-label">레벨 선택</label>
              <select className="regist-level">
                  <option value='' selected>Level Select</option>
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
    )
  }
}


export default Regist;
