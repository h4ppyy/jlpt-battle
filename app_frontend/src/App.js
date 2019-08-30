import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Header from './component/common/Header';
import Footer from './component/common/Footer';

import Main from './component/page/Main'
import Mypage from './component/page/Mypage'
import Ranking from './component/page/Ranking'
import Login from './component/page/Login';
import Regist from './component/page/Regist';


function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Route path="/" exact component={Main} />
        <Route path="/mypage/" component={Mypage} />
        <Route path="/ranking/" component={Ranking} />
        <Route path="/login/" component={Login} />
        <Route path="/Regist/" component={Regist} />
        <Route path='/github' component={() => { window.location = 'https://github.com/h4ppyy/jlpt-battle'; return null;} }/>
        <Footer/>
      </Router>
    </div>
  );
}


export default App;
