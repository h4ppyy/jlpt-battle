import React from 'react';


import '../../static/page/Ranking.css';
import axios from "axios";
import socketIOClient from "socket.io-client";

class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: "127.0.0.1:4000",
      rankList: [
        {"rank":"1", "username":"h4ppyy", "jlpt":"N1", "point":"460000000", "registDate":"2019-01-01 00:00:00"},
        {"rank":"2", "username":"david", "jlpt":"N1", "point":"32000", "registDate":"2019-01-01 00:00:00"},
        {"rank":"3", "username":"hackx", "jlpt":"N2", "point":"24000", "registDate":"2019-01-01 00:00:00"},
        {"rank":"4", "username":"gmail123", "jlpt":"N2", "point":"12000", "registDate":"2019-01-01 00:00:00"},
        {"rank":"5", "username":"naver34", "jlpt":"N2", "point":"6000", "registDate":"2019-01-01 00:00:00"},
        {"rank":"6", "username":"lafaf", "jlpt":"N3", "point":"3000", "registDate":"2019-01-01 00:00:00"},
        {"rank":"7", "username":"coolguy", "jlpt":"N5", "point":"2000", "registDate":"2019-01-01 00:00:00"},
        {"rank":"8", "username":"naver34", "jlpt":"N2", "point":"6000", "registDate":"2019-01-01 00:00:00"},
        {"rank":"9", "username":"lafaf", "jlpt":"N3", "point":"3000", "registDate":"2019-01-01 00:00:00"},
        {"rank":"10", "username":"coolguy", "jlpt":"N5", "point":"2000", "registDate":"2019-01-01 00:00:00"},
      ],
    };
  }

    componentWillMount = () => {
      console.log('componentwillmount good')
      var url = 'http://127.0.0.1:4000/api/getUserRank';
      axios.post(url).then(response => {
          console.log('asdasd==>', response.data.result);
        this.setState({rankList: response.data.result});
      });
  }

  render() {
    return (
      <div>
        <div className='ranking-box'>
          <div className='rank-top'>
            <img alt='rated' className='rank-top-img' src={process.env.PUBLIC_URL + '/ranking/top-rated.png'}/>
            <span className='rank-top-title'>명예의 전당 TOP 100</span>
          </div>

          <table className='ranking-table table'>
            <thead>
              <tr>
                <td>순위</td>
                <td>아이디</td>
                <td>JLPT 수준</td>
                <td>포인트</td>
                <td>가입일</td>
              </tr>
            </thead>
            <tbody>
              {this.state.rankList.map((item, key) =>
                    <tr key={key}>
                      <td>
                      {
                        item.rank === 1 ?
                            <img alt='winner' className='rank-top-img' src={process.env.PUBLIC_URL + '/ranking/winner.png'}/>
                            :
                            item.rank &&
                        item.rank === 2 ?
                            <img alt='second' className='rank-top-img' src={process.env.PUBLIC_URL + '/ranking/second.png'}/>
                            :
                            item.rank &&
                        item.rank === 3 ?
                            <img alt='third' className='rank-top-img' src={process.env.PUBLIC_URL + '/ranking/third.png'}/>
                            :
                            item.rank
                      }
                      </td>
                      <td>{item.username}</td>
                      <td>{item.jlpt_level}</td>
                      <td>{item.point}</td>
                      <td>{item.regist_date}</td>
                </tr>
              )}
            </tbody>
          </table>
          {
              this.state.rankList.length === 0
              ?
              <div className='ranking-null'>
                <img alt='lurker' className='rank-null-img' src={process.env.PUBLIC_URL + '/ranking/lurker.png'}/>
                <div>현재 명예의 전당에 등록된 사용자가 없습니다</div>
              </div>
              :
              <div></div>
          }

        </div>
      </div>
    )
  }
}


export default Ranking;
