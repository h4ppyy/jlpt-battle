import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/mypage/">mypage</Link>
            </li>
            <li>
              <Link to="/ranking/">ranking</Link>
            </li>
            <li>
              <Link to="/study/">study</Link>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}


export default Header;
