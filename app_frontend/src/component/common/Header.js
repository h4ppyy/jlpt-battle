import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import '../../static/common/Header.css';


class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <nav className='header-container'>
          <div className='header-flex-logo h-item mt15'>
            <Link to="/">JLPT BATTLE</Link>
          </div>
          <div className='header-flex-item h-menu mt15'>
            <Link to="/ranking/">랭킹</Link>
          </div>
          <div className='header-flex-item h-menu mt15'>
            <Link to="/mypage/">내 정보</Link>
          </div>
          <div className='header-flex-item h-menu mt15'>
            <Link to="/login/">로그인</Link>
          </div>
          <div className='header-flex-item h-sub mt15'>
              <span className='header-subinfo-version'>
                v0.0.0
              </span>
              <span className='header-subinfo-github'>
                <i className="fab fa-github"></i>
                <a href="https://github.com/h4ppyy/jlpt-battle" target="_blank">GitHub</a>
              </span>
              <span className='header-subinfo-github'>
                <a href="https://ja.dict.naver.com/jlpt/level-5/parts-0/p1.nhn" target="_blank">
                  <img className='naver-img' src={process.env.PUBLIC_URL + '/header/naver.png'}/>
                  <span className='study'>학습하기</span>
                </a>
              </span>
          </div>

        </nav>
      </div>
    )
  }
}


export default Header;
