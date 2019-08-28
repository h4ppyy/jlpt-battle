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
            <Link to="/ranking/">Ranking</Link>
          </div>
          <div className='header-flex-item h-menu mt15'>
            <Link to="/study/">Study</Link>
          </div>
          <div className='header-flex-item h-menu mt15'>
            <Link to="/mypage/">MyPage</Link>
          </div>
          <div className='header-flex-item h-menu mt15'>
            <Link to="/login/">Login/Regist</Link>
          </div>
          <div className='header-flex-item h-sub mt15'>
              <span className='header-subinfo-version'>
                v0.0.0
              </span>
              <span className='header-subinfo-github'>
                <Link to="/github/">GitHub</Link>
              </span>
          </div>

        </nav>
      </div>
    )
  }
}


export default Header;
