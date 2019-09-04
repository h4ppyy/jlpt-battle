import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from './component/common/Header';
import Footer from './component/common/Footer';

import Main from './component/page/Main'
import Mypage from './component/page/Mypage'
import Ranking from './component/page/Ranking'
import Login from './component/page/Login';
import Regist from './component/page/Regist';
import Channel from './component/page/Channel';

import TestRedux1 from './sample/TestRedux1';
import TestRedux2 from './sample/TestRedux2';
import TestReduxClass1 from './sample/TestReduxClass1';
import TestReduxClass2 from './sample/TestReduxClass2';


const App = () => {
  return (
    <div className="App">
      <Router>
        <Route component={Header} />
        <Route path="/" exact component={Channel} />
        <Route path="/:id(n1|n2|n3|n4|n5|free)" component={Main} />
        <Route path="/mypage/" component={Mypage} />
        <Route path="/ranking/" component={Ranking} />
        <Route path="/login/" component={Login} />
        <Route path="/Regist/" component={Regist} />

        <Route path="/test/" component={TestRedux1} />
        <Route path="/test/" component={TestRedux2} />
        <Route path="/testclass/" component={TestReduxClass1} />
        <Route path="/testclass/" component={TestReduxClass2} />
        <Route component={Footer} />
      </Router>
    </div>
  );
}


export default App;
