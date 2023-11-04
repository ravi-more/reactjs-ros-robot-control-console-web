import React, { Component } from 'react';
import Config from "../data/config";
import { Col,Row } from "react-bootstrap";
import * as Three from "three";
class RobotStatistics extends Component {
    state = {
        connected: false,
        ros: null,
        isMap: false,
        x:0,
        y:0,
        z:0,
        orientation:0,
        linearVelocity:0,
        angularVelocity:0,
    }

    constructor() {
        super();
        this.getStatistics = this.getStatistics.bind(this);
        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);
    }
    reconnect() {
        if (this.state.connected === false) {
            console.log(this.state.connected);
            console.log('Reconnecting');
            try {
                try {
                    try {
                        this.state.ros.connect(`ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}`).onerror(function (e) {
                            console.log("Error caught by connect: ");
                            console.log(e);
                        });
                    } catch (error) {
                        console.log("Connection problem");
                    }
                } catch (error) {
                    console.log("Timesout Error");
                }
            } catch (error) {
                console.log("Error");
            }

        }
    }
    init_connection() {
        window.onerror = function (e) {
            console.log("error handled", e.type);
            console.log("error handled", e);
        };

        setInterval(() => {
            this.reconnect();
        }, 5000);

        this.state.ros.on("connection", () => {
            console.log("[Statitics]]Connection established successfully");
            this.setState({ connected: true });
            this.getStatistics();

        });
        this.state.ros.on("close", (error) => {
            console.log(error);
            console.log("Connection closed");
            this.setState({ connected: false });
        });

        try {
            this.state.ros.connect(`ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}`).onerror(function (e) {
                console.log("Error caught by connect: ");
                console.log(e);
            });
        } catch (error) {
            console.log("Connection problem");
        }

    }
    componentDidMount() {
        this.init_connection();
    }
    

    getStatistics() {
        console.log("getting Statistics");
        var pose = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: "/amcl_pose", 
            messageType: "geometry_msgs/PoseWithCovarianceStamped",
        });
        pose.subscribe((msg) =>{
            this.setState({
                y : msg.pose.pose.position.y.toFixed(2),
                x : msg.pose.pose.position.x.toFixed(2),
                z : msg.pose.pose.position.z.toFixed(2),
                orientation : this.getOrientationFromQuaternion(msg.pose.pose.orientation).toFixed(3),
            })
        });

        var odom = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: "/odom", 
            messageType: "nav_msgs/Odometry",
        });
        odom.subscribe((msg) =>{

            this.setState({
                linearVelocity : msg.twist.twist.linear.x.toFixed(2),
                angularVelocity : msg.twist.twist.angular.z.toFixed(2),
            })
        });
    }

    

    getOrientationFromQuaternion(orientation_in_q){
        var q = new Three.Quaternion(
            orientation_in_q.x,
            orientation_in_q.y,
            orientation_in_q.z,
            orientation_in_q.w,
            );
        // roll , pitch , yaw
        var rpy = new Three.Euler().setFromQuaternion(q);
        return rpy["_z"] *(180 / Math.PI) ;
    }
   


    render() {
        return (<div>
            <Row className="nomargin  box-border">
                <Col className=" box-border">
                <h4 className="mt-4">Position</h4>
                <p className="mt-0">x: {this.state.x}</p>
                <p className="mt-0">y: {this.state.y}</p>
                <p className="mt-0">z: {this.state.z}</p>
                <p className="mt-0">Orientation: {this.state.orientation}</p>
                </Col>
                <Col>
                    <h4 className="mt-4">Velocities</h4>
                    <p className="mt-0">Linear:  {this.state.linearVelocity}</p>
                    <p className="mt-0">Angular: {this.state.angularVelocity}</p>
                </Col>
            </Row>

            
           

        </div>);
    }
}

export default RobotStatistics;