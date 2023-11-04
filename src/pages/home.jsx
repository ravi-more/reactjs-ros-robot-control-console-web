import React, { Component } from "react";
import Connection from "../componets/connection";
import Teleoperation from "../componets/teleoperation";
import VideoStreamView from "../componets/videostreamview";
import MapView from "../componets/mapview"
import MapGoal from "../componets/mapgoal"
import RobotStatistics from "../componets/robotstatistics";
import { Row, Col } from "react-bootstrap";
class Home extends Component {
    state = {

    }

    render() {
        return (
            <div>
                <Row className="nomargin  nopadding">
                    <Col className="nomargin nopadding box-border">
                        <Connection />
                    </Col>
                </Row>
                <Row  className="nomargin nopadding">
                    <Col className="nomargin nopadding box-border">
                        <VideoStreamView className="box-border" />
                        <RobotStatistics className="nomargin box-border"  />
                        <MapGoal />

                    </Col>
                    <Col   className="nomargin nopadding box-border ">
                        <MapView   />

                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Teleoperation  />
                    </Col>
                </Row>
                
            </div>

        );
    }
}

export default Home;