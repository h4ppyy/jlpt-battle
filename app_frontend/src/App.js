import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Header from './component/common/Header';
import Footer from './component/common/Footer';

import Main from './component/page/Main'
import Mypage from './component/page/Mypage'
import Ranking from './component/page/Ranking'
import Login from './component/page/Login';
import Regist from './component/page/Regist';
import TestRedux1 from './sample/TestRedux1';
import TestRedux2 from './sample/TestRedux2';


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
        <Route path="/test/" component={TestRedux1} />
        <Route path="/test/" component={TestRedux2} />
        <Footer/>
      </Router>
    </div>
  );
}


export default App;
