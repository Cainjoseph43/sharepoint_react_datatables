import React, { Component } from "react";
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SPList from './SPList';



const styles = {
    app: {
        fontFamily: "Roboto, Sans-serif",
        border: "1px solid #eee",
        borderRadius: "5px",
        padding: "15px",
        textAlign: "center",
    }
}

export default class App extends Component {

    // Arrow function
    foo = () => {
        console.log("arrow functions!")
    }

    render() {
        this.foo();

        return (
          <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
            <SPList listName={'Data%20Source%20Connection%20Info'} />
          </MuiThemeProvider>
        )
    }
}
