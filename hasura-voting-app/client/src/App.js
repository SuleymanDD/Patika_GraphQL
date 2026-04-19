import {Routes, Route, Link} from "react-router-dom"

import Questions from "./pages/Questions";
import NewQuestion from "./pages/New";
import Detail from "./pages/Detail";

function App() {
  return (
    <div className="App">

      <nav>
        <Link to="/">Questions</Link>
        <Link to="/new">New Questions</Link>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<Questions />}></Route>
        <Route path="new" element={<NewQuestion />}></Route>
        <Route path="q/:id" element={<Detail />}></Route>
      </Routes>
    </div>
  );
}

export default App;
