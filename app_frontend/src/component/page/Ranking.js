import React from 'react';

import BigText from '../util/BigText';

import '../../static/page/Ranking.css';

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

  render() {
    return (
      <div>
        <div className='ranking-box'>
          <div className='rank-top'>
            <img className='rank-top-img' src={process.env.PUBLIC_URL + '/top-rated.png'}/>
            <span className='rank-top-title'>순위표 TOP 100</span>
          </div>

          <table className='ranking-table'>
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
                    item.rank == '1' ?
                        <img className='rank-top-img' src={process.env.PUBLIC_URL + '/winner.png'}/>
                        :
                        item.rank &&
                    item.rank == '2' ?
                        <img className='rank-top-img' src={process.env.PUBLIC_URL + '/second.png'}/>
                        :
                        item.rank &&
                    item.rank == '3' ?
                        <img className='rank-top-img' src={process.env.PUBLIC_URL + '/third.png'}/>
                        :
                        item.rank
                  }
                  </td>
                  <td>{item.username}</td>
                  <td>{item.jlpt}</td>
                  <td>{item.point}</td>
                  <td>{item.registDate}</td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>
    )
  }
}


export default Ranking;
