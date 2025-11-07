import React from "react";
import { Row, Col } from "antd";
import {Routes, Route} from "react-router-dom";
import styles from "./styles.module.css"

// Pages
import Home from "pages/Home";
import Event from "pages/Event";

function App() {
    return (
        <div className={styles.container}>
            <Row justify={"center"}>
                <Col span={14} className={styles.col}>
                    <div className={styles.content}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/event/:id" element={<Event />} />
                        </Routes>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
export default App