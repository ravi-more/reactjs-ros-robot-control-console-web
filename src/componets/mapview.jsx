import React, { Component } from 'react';
import Config from "../data/config"


class MapView extends Component {
    state = {
        connected: false,
        ros: null,
        isMap: false,
        navigator: null,
        viewer2: null,
        nav : null,
    } 

    constructor() {
        super();
        this.mapView = this.mapView.bind(this);
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
            this.reconnect();
        }, 5000);

        this.state.ros.on("connection", () => {
            console.log("[map]Connection established successfully");
            this.setState({ connected: true });
            this.mapView();

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

    mapView(){
        if(this.state.connected === true){
                try {
                    this.viewer2 = new window.ROS2D.Viewer({
                               divID : 'nav',
                               width : 750,
                               height : 550
                             });
                    // eslint-disable-next-line
                    this.state.nav = window.NAV2D.OccupancyGridClientNav({
                        ros : this.state.ros,
                        rootObject : this.viewer2.scene,
                        viewer : this.viewer2,
                        serverName : '/move_base',
                        topic : "/map"
                        });
                    
                   
                    console.log("Nav setup complete")
                } catch (error) {
                    console.log("Nav error");
                    console.log(error);
                }
            
    }
   
    }
    
    render() { 
        return ( <div>
            <h3>Navigation Map</h3>
            <div id='nav'>
            </div>
            {
            }
        </div> );
    }
}
 
export default MapView;