import React from 'react';
import axios from "axios";
import '../../static/page/Ranking.css';
const Config = require('../config/config.js');

class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rankList: [],
    };
  }

    componentWillMount = () => {
      var url = Config.backendUrl + '/api/getUserRank';
      axios.post(url).then(response => {
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
