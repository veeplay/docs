import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DocsMainPage from './pages/DocsMainPage';
import Header from './components/Header';
import Footer from './components/Footer';
import VideoApi from './pages/VideoApi';

function App() {
  return (
    <Router>
      <div>
        <div id="container">
          <Header />
          <div id="main-content">
            <Switch>
              <Route exact path="/" component={DocsMainPage} />
              <Route exact path="/video-api" component={VideoApi} />
            </Switch>
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
