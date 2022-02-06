import { combineReducers } from "redux";
import userReducer from "./services/user/reducer";
import userCoursesReducer from "./services/userCourses/reducer";

const reducers = combineReducers({
  user: userReducer,
  years: userCoursesReducer,
});

export default reducers;
