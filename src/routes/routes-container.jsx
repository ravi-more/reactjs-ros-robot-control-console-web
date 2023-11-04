import React , { Component } from "react";
import { Container } from 'react-bootstrap';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Home from "../pages/home";
class RoutesContainer extends Component {
    state = {  }
    render() { 
        return ( 
            <Container>
                <Router>
                    <Switch>
                        <Route path="/" exact component={Home} ></Route>
                    </Switch>
                </Router>
            </Container>
         );
    }
}
 
export default RoutesContainer;