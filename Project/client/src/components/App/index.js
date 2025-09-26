import { Row, Col } from "antd";
import { Routes, Route} from "react-router-dom"
import styles from "./styles.module.css"
import HeaderMenu from "./HeaderMenu";

// Pages
import Home from "pages/Home"
import NewPost from "pages/NewPost";
import Post from "pages/Post";

function App() {
  return (
    <div className={styles.container}>
      <Row justify={"center"}>
        <Col span={14}>
          <HeaderMenu />
          <div className={styles.content}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<NewPost />} />
              <Route path="/post/:id" element={<Post />} />
            </Routes>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
