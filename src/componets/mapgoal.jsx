import React, { Component } from 'react';
import Config from "../data/config";
import { Button } from "react-bootstrap";
import { v4 as uuid4 } from 'uuid';
import ls from 'local-storage';
class MapGoal extends Component {
    state = {
        connected: false,
        ros: null,
        isMap: false,
        goal_list : [ ],
        goalid_list : [ ],
        
    }
    componentDidMount() {
        this.init_connection();
        let goals = ls.get('goal_list');
        let newGoals = [];
        try {
            for(var i=0; i < goals.length; i++){
                try {
                    var test = goals[i].id;
                    if(typeof test != "undefined"){
                    newGoals.push(goals[i]);}
                } catch (error) {
                    
                }
            }
        } catch (error) {
            
        }
        if( newGoals.length === 0){
            ls.set('goal_list' , []   );
            ls.set('goalid_list' , [] );
        }
        this.setState({
            goal_list: newGoals,
            goalid_list: ls.get('goalid_list') || [],
          });
    }

    updateStorage(){
       ls.set('goal_list' , this.state.goal_list   );
        ls.set('goalid_list' , this.state.goalid_list );
    }

    constructor() {
        super();
        this.updateStorage = this.updateStorage.bind(this);
        this.setGoal = this.setGoal.bind(this);
        this.cancelGoal = this.cancelGoal.bind(this);
        this.deleteGoal = this.deleteGoal.bind(this);
        this.newLocation = this.newLocation.bind(this);
        this.addNewLocation = this.addNewLocation.bind(this);
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
            console.log("[Map Goal]Connection established successfully");
            this.setState({ connected: true });

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
    
    
    setGoal(id) {
        var goal_data = null;
        var goal_list = this.state.goal_list;
        for(var i=0; i < goal_list.length; i++){
            if (goal_list[i].id === id ){
                goal_data = goal_list[i].pose;
            }
        }
        if(goal_data === null){
            return 0;
        }
        console.log("Navigating");
        var goal = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.GOAL_TOPIC,
            messageType: "geometry_msgs/PoseStamped",
        });
        var goal_msg = new window.ROSLIB.Message(goal_data);
        goal.publish(goal_msg);
    }

    deleteGoal(id){
        try {
            for(var i=0; i < this.state.goal_list.length; i++){
                try {
                    if (this.state.goal_list[i].id === id ){
                        console.log(i);
                        delete this.state.goal_list[i];
                        break;
                    }
                    
                } catch (error) {
                    
                }
                
            }
            this.setState({goal_list : this.state.goal_list});
            this.updateStorage();
            
        } catch (error) {
            
        }
    }

    newLocation() {
        
        var name = window.prompt("Enter location name");
        try {
            
            if(name.length > 0){
                this.addNewLocation(name);
            }
        } catch (error) {
            return "";
        }
        return "";
    }

    cancelGoal() {

        var odom = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: "/odom", 
            messageType: "nav_msgs/Odometry",
        });
        var added = false;
        var newgoal = null;
        odom.subscribe((msg) =>{
            if(added === false){
                added = true;
                newgoal =  {
                        pose : {
                            header: {
                                
                                frame_id: "map",
                            },
                            pose: msg.pose.pose,
                        }
                    };
                    var goal = new window.ROSLIB.Topic({
                        ros: this.state.ros,
                        name: Config.GOAL_TOPIC,
                        messageType: "geometry_msgs/PoseStamped",
                    });
                    var goal_msg = new window.ROSLIB.Message(newgoal.pose);
                    goal.publish(goal_msg);

                    
           
        }
            odom.unsubscribe();
        });
        
        this.setState();

    }


    addNewLocation(goalname) {
        var id = uuid4();

        var odom = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: "/odom", 
            messageType: "nav_msgs/Odometry",
        });
        var added = false;
        var newgoal = null;
        odom.subscribe((msg) =>{
            if(added === false){
                added = true;
                newgoal =  {
                        id : id,
                        name : goalname,
                        pose : {
                            header: {
                                
                                frame_id: "map",
                            },
                            pose: msg.pose.pose,
                        }
                    };
                    if(this.state.goalid_list.includes(id) === false){
                        console.log(this.state.goalid_list.includes(id))
                            this.state.goal_list.push(newgoal);
                            this.state.goalid_list.push(id);
                            this.setState({goal_list : this.state.goal_list});
                            this.updateStorage();

                    }
                    
           
        }
            console.log(this.state.goal_list);
            console.log(msg);
            odom.unsubscribe();
        });
        
        this.setState();

    }
    render() {
        return (<div>
            <h3>Navigation Menu</h3>
            <p>
            </p>
            <ul>
                <span style={{width : "50px"}}></span><Button className="ml-3" onClick={this.newLocation} variant="outline-success">Add Current Location</Button>
                
                <Button style={{marginLeft : "50px"}} className="ml-10" onClick={this.cancelGoal} variant="outline-danger">Cancel Navigation</Button>
            {this.state.goal_list.map((goal) => (
                <li>  <Button className="mt-3"  onClick={()=>{ this.setGoal(goal.id) }} variant="outline-primary">{goal.name}</Button> <Button className="mt-3"  onClick={()=>{ this.deleteGoal(goal.id) }} variant="outline-danger">Delete</Button></li>
                ))
                }
            </ul>
        </div>);
    }

        
}

export default MapGoal;