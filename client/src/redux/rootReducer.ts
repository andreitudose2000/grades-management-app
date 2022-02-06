import { combineReducers } from "redux";
import userReducer from "./services/user/reducer";
import userCoursesReducer from "./services/userCourses/reducer";

const rootReducer = combineReducers({
  user: userReducer,
  userCourses: userCoursesReducer,
});

export default rootReducer;
