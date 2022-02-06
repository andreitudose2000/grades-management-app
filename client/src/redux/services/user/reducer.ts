import { Action, initialState, State } from "../../interfaces";
import * as actions from "./actions";

export default function userReducer(userState = initialState.user, action: Action) {
  switch (action.type) {
    case actions.USER_EDIT_NAME:
      return { ...userState, name: action.payload };

    default:
      return userState;
  }
}
