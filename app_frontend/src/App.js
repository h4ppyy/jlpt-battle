import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Header from './components/common/Header';
import Footer from './components/common/Footer';

import Main from './components/page/Main'
import Mypage from './components/page/Mypage'
import Ranking from './components/page/Ranking'
import Study from './components/page/Study';


function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Route path="/" exact component={Main} />
        <Route path="/mypage/" component={Mypage} />
        <Route path="/ranking/" component={Ranking} />
        <Route path="/study/" component={Study} />
        <Footer/>
      </Router>
    </div>
  );
}


export default App;
