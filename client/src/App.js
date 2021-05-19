import './App.scss';
import { BrowserRouter, Route } from "react-router-dom";
import Nav from './components/Navbar.js'
import Home from './pages/Home'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Nav/>
      <Route exact path="/">
      <Home />
      </Route>
      </BrowserRouter>
    </div>
  );
}

export default App;
