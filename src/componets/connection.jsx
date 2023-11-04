import React, { Component } from 'react';
import Alert from "react-bootstrap/Alert"
import Config from "../data/config"
class Connection extends Component {
    state = {
        connected: false,
        ros: null,
    }

    constructor() {
        super();
        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);
    }
    reconnect(){
        if(this.state.connected === false){
            console.log(this.state.connected);
            console.log('Reconnecting');
            try {
                try{
                    try {
                        this.state.ros.connect(`ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}`).onerror( function ( e){
                            console.log("Error caught by connect: ");
                            console.log(e);
                        });
                    } catch (error) {
                        console.log("Connection problem");
                    }
                   }catch(error){
                       console.log("Timesout Error");
                   }
            } catch (error) {
                console.log("Error");
            }
            
        }
    }
    init_connection() {
        window.onerror = function(e) {  
             console.log("error handled", e.type);
             console.log("error handled", e);
            };
        

        setInterval(() => {
            this.reconnect()
        }, 5000);
        this.state.ros.on("connection", () => {
            console.log("Connection established successfully");
            this.setState({ connected: true });
        });
        this.state.ros.on("close", (error) => {
            console.log(error);
            console.log("Connection closed");
            this.setState({ connected: false });
        });
        
        try {
            this.state.ros.connect(`ws://${Config.ROSBRIDGE_SERVER_IP}:${Config.ROSBRIDGE_SERVER_PORT}`).onerror( function ( e){
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
    render() {
        return (
            <div>
                <Alert className="text-center m-3 nomargin nopadding  box-border" variant={this.state.connected ? "success" : "danger"}>
                <h3>  {this.state.connected ? "Online" : "Offline"} </h3>
                </Alert>
            </div>
        );
    }
}

export default Connection;