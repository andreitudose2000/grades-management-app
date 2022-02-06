import { createStore, applyMiddleware } from "redux";
import rootReducer from "./rootReducer";
import { State } from "./interfaces";
import { composeWithDevTools } from "@redux-devtools/extension";
import thunk from "redux-thunk";

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
