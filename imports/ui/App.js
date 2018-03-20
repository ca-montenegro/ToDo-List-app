import React, {Component} from "react";
import ReactDOM from "react-dom"

import {withTracker} from "meteor/react-meteor-data";
import {Tasks} from "../api/tasks.js";
import Task from "./Task.js";
import AccountsUIWrapper from "./AccountsUIWrapper.js";
import { Meteor } from "meteor/meteor";

class App extends Component {


    constructor(props){
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    handleSubmit(event){
        event.preventDefault();

        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Tasks.insert({
            text,
            createdAt: new Date(),
            owner : Meteor.userId(),
            username: Meteor.user().username,
        });

        ReactDOM.findDOMNode(this.refs.textInput).value="";
    }

    toggleHideCompleted(){
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }
    renderTasks() {
        let filteredTasks = this.props.tasks;
        if(this.state.hideCompleted){
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map((task) => (
            <Task key={task._id} task={task}/>
        ));
    }



    render() {
        return (
            <div className="container">
                <header>
                    <h1>Todo list ({this.props.incompleteCount})</h1>
                    <label className="hide-completed">
                        <input type="checkbox"
                        readOnly
                        checked = {this.state.hideCompleted}
                        onClick = {this.toggleHideCompleted.bind(this)}
                        />
                        Hide Completed Tasks
                    </label>

                    <AccountsUIWrapper/>
                    {this.props.currentUser ?
                        <form onSubmit={this.handleSubmit.bind(this)} className="new-task">
                            <input type="text" ref="textInput" placeholder="Type to add new task"/>
                        </form> : ""
                    }
                </header>
                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        );
    }

}

export default withTracker(() => {
    return {
        tasks: Tasks.find({}, {sort:{createdAt:-1}}).fetch(),
        incompleteCount : Tasks.find({checked: {$ne:true}}).count(),
        currentUser:Meteor.user(),
    };
})(App);