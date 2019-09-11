import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import '../../static/common/Header.css';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuActive : false
    }
  }

  clickLogout = () => {
    localStorage.removeItem('jwt');
    this.props.logout();
    this.props.history.push('/login');
  }

  clickMenu = () => {
    if(this.state.menuActive == true){
      this.setState({menuActive: false});
    } else {
      this.setState({menuActive: true});
    }
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
          {
            this.props.loginStatus === 1
            ?
            <div className='header-flex-item h-menu mt15'>
              <Link to="/mypage/">내 정보</Link>
            </div>
            :
            <div></div>
          }
          {
            this.props.loginStatus === 0
            ?
            <div className='header-flex-item h-menu mt15'>
              <Link to="/login/">로그인</Link>
            </div>
            :
            <div className='header-flex-item h-menu mt15'>
              <a href="#" onClick={() => this.clickLogout()}>로그아웃</a>
            </div>
          }
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

        <nav className='mobile-header'>
          <div className='mobile-header-box'>
            <div className='header-flex-logo h-item mt15'>
              <Link to="/">JLPT BATTLE</Link>
              <i onClick={() => this.clickMenu()} className="fas fa-bars hamberger"></i>
            </div>
          </div>
          <div className='mobile-menu-box' style={{display: this.state.menuActive ? 'block' : 'none' }}>
            <div className='mobile-menu'>
              <Link to="/ranking/">
                <div className='mobile-menu-item'>
                  랭킹
                </div>
              </Link>
            </div>
            {
              this.props.loginStatus === 1
              ?
              <div className='mobile-menu'>
                <Link to="/mypage/">
                  <div className='mobile-menu-item'>
                    내정보
                  </div>
                </Link>
              </div>
              :
              <div></div>
            }
            <div className='mobile-menu'>
            {
              this.props.loginStatus === 0
              ?
              <Link to="/login/">
                <div className='mobile-menu-item'>
                  로그인
                </div>
              </Link>
              :
              <div className='mobile-menu-item' onClick={() => this.clickLogout()}>
                로그아웃
              </div>
            }
            </div>
          </div>

        </nav>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    loginStatus: state.loginStatus
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    login: () => dispatch({ type: 'LOGIN' }),
    logout: () => dispatch({ type: 'LOGOUT' }),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);
