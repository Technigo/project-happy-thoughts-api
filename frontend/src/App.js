import React from "react";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Thoughts from "./components/Thoughts";

import thoughts from "./reducers/thoughts";

const reducer = combineReducers({
  thoughts: thoughts.reducer,
});

const store = configureStore({ reducer });

export const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Switch>
          <Route exact path="/" component={Thoughts} />
        </Switch>
      </Provider>
    </BrowserRouter>
  );
};
