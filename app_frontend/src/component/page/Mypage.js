import React from 'react';
import {Animated} from "react-animated-css";

import BigText from '../util/BigText';

import '../../static/page/Mypage.css';

class Mypage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: "127.0.0.1:4000",
      progress_n1: 70,
      progress_n2: 20,
      progress_n3: 30,
      progress_n4: 60,
      progress_n5: 80,
    };
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
            <img className='mypage-img' src={process.env.PUBLIC_URL + '/teacher.png'}/>
          </div>
          <div>
            <table className='mypage-table'>
              <tr>
                <td>아이디</td>
                <td>운영자</td>
              </tr>

              <tr>
                <td>JLPT 수준</td>
                <td>N3</td>
              </tr>

              <tr>
                <td>보유 포인트</td>
                <td>42,000</td>
              </tr>

              <tr>
                <td>가입일</td>
                <td>2019-01-01 00:00:00</td>
              </tr>

              <tr>
                <td>JLPT N1 제출 수</td>
                <td>
                  <div>
                    <div className="progress progress-left">
                      <div style={progress_n1} className="progress-bar progress-bar-striped bg-danger progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className='progress-txt'>
                      <span>1,002,300</span> 회
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
                    <span>6,002,300</span> 회
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
                    <span>502,300</span> 회
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
                    <span>22,300</span> 회
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
                    <span>2,300</span> 회
                  </div>
                </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      </Animated>
    )
  }
}


export default Mypage;
