import { Action, initialState } from "../../interfaces";
import * as actions from "./actions";

export default function userReducer(userState = initialState.user, action: Action) {
  switch (action.type) {
    case actions.USER_FETCH_DATA:
      return action.payload;

    case actions.USER_EDIT_NAME:
      return { ...userState, name: action.payload };

    case actions.USER_LOGOUT:
      return null;

    default:
      return userState;
  }
}
