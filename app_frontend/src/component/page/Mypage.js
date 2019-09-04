import React from 'react';
import axios from 'axios';
import {Animated} from "react-animated-css";
import { connect } from "react-redux";

import '../../static/page/Mypage.css';


class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      jlpt_level: '',
      point: '',
      regist_date: '',
      progress_n1: 50,
      progress_n2: 50,
      progress_n3: 50,
      progress_n4: 50,
      progress_n5: 50,
      solve_n1: '',
      solve_n2: '',
      solve_n3: '',
      solve_n4: '',
      solve_n5: '',
    };
  }

  componentWillMount = () => {
    var loginStatus = this.props.loginStatus;
    if(loginStatus == 0) {
      this.props.history.push('/login');
    }

    var jwt = localStorage.getItem("jwt");
    var url = 'http://127.0.0.1:4000/api/getMypageInfo'
    axios.defaults.headers.common['authorization'] = jwt
    axios.post(url).then(response => {
      if(response.data.result == 200){
        var userInfo = response.data.userInfo
        var problemSolve = response.data.problemSolve

        var username = userInfo.username;
        var jlpt_level = userInfo.jlpt_level;
        var point = userInfo.point;
        var regist_date = userInfo.regist_date;

        var solve_n1 = problemSolve.n1;
        var solve_n2 = problemSolve.n2;
        var solve_n3 = problemSolve.n3;
        var solve_n4 = problemSolve.n4;
        var solve_n5 = problemSolve.n5;

        var progress_n1 = problemSolve.progress_n1;
        var progress_n2 = problemSolve.progress_n2;
        var progress_n3 = problemSolve.progress_n3;
        var progress_n4 = problemSolve.progress_n4;
        var progress_n5 = problemSolve.progress_n5;

        this.setState({username: username});
        this.setState({jlpt_level: 'N' + jlpt_level});
        this.setState({point: point});
        this.setState({regist_date: regist_date});

        this.setState({solve_n1: solve_n1});
        this.setState({solve_n2: solve_n2});
        this.setState({solve_n3: solve_n3});
        this.setState({solve_n4: solve_n4});
        this.setState({solve_n5: solve_n5});

        this.setState({progress_n1: progress_n1});
        this.setState({progress_n2: progress_n2});
        this.setState({progress_n3: progress_n3});
        this.setState({progress_n4: progress_n4});
        this.setState({progress_n5: progress_n5});
      }
    });
  }

  render() {
    const progress_n1 = {
      width: String(this.state.progress_n1) + '%'
    };
    const progress_n2 = {
      width: String(this.state.progress_n2) + '%'
    };
    const progress_n3 = {
      width: String(this.state.progress_n3) + '%'
    };
    const progress_n4 = {
      width: String(this.state.progress_n4) + '%'
    };
    const progress_n5 = {
      width: String(this.state.progress_n5) + '%'
    };
    return (
      <Animated animationIn="fadeIn" animationOut="fadeInUpBig" isVisible={true}>
      <div>
        <div className='mypage-box'>
          <div className='mypage-con'>
            <img alt='teacher' className='mypage-img' src={process.env.PUBLIC_URL + '/mypage/teacher.png'}/>
          </div>
          <div>
            <table className='mypage-table'>
              <thead>
              </thead>
              <tbody>
                  <tr>
                    <td>아이디</td>
                    <td>{this.state.username}</td>
                  </tr>

                  <tr>
                    <td>JLPT 수준</td>
                    <td>{this.state.jlpt_level}</td>
                  </tr>

                  <tr>
                    <td>보유 포인트</td>
                    <td>{this.state.point}</td>
                  </tr>

                  <tr>
                    <td>가입일</td>
                    <td>{this.state.regist_date}</td>
                  </tr>

                  <tr>
                    <td>JLPT N1 제출 수</td>
                    <td>
                      <div>
                        <div className="progress progress-left">
                          <div style={progress_n1} className="progress-bar progress-bar-striped bg-danger progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div className='progress-txt'>
                          <span>{this.state.solve_n1}</span> 회
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>JLPT N2 제출 수</td>
                    <td>
                    <div>
                      <div className="progress progress-left">
                        <div style={progress_n2} className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <div className='progress-txt'>
                        <span>{this.state.solve_n2}</span> 회
                      </div>
                    </div>
                    </td>
                  </tr>

                  <tr>
                    <td>JLPT N3 제출 수</td>
                    <td>
                    <div>
                      <div className="progress progress-left">
                        <div style={progress_n3} className="progress-bar progress-bar-striped bg-success progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <div className='progress-txt'>
                        <span>{this.state.solve_n3}</span> 회
                      </div>
                    </div>
                    </td>
                  </tr>

                  <tr>
                    <td>JLPT N4 제출 수</td>
                    <td>
                    <div>
                      <div className="progress progress-left">
                        <div style={progress_n4} className="progress-bar progress-bar-striped bg-info progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <div className='progress-txt'>
                        <span>{this.state.solve_n4}</span> 회
                      </div>
                    </div>
                    </td>
                  </tr>

                  <tr>
                    <td>JLPT N5 제출 수</td>
                    <td>
                    <div>
                      <div className="progress progress-left">
                        <div style={progress_n5} className="progress-bar progress-bar-striped bg-warning progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <div className='progress-txt'>
                        <span>{this.state.solve_n5}</span> 회
                      </div>
                    </div>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </Animated>
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


export default connect(mapStateToProps, mapDispatchToProps)(Mypage);
