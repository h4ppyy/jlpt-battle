import React from 'react';
import '../../static/page/Login.css';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import BigText from '../util/BigText';


class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='form-container'>
          <form>
            <div className="form-group">
              <label for="form-label">아이디</label>
              <input type="email" className="form-control input-control" id="exampleInputID" placeholder="Enter ID"/>
              <label for="form-label">비밀번호</label>
              <input type="password" className="form-control input-control" id="exampleInputPassword" placeholder="Password"/>
            </div>
            <div className="form-button">
              <button type="submit" className="btn btn-danger">로그인</button>
            </div>
            <div className='go-regist'><Link to="/regist/">아직 회원이 아니신가요...?</Link></div>
          </form>
      </div>
    )
  }
}


export default Login;
