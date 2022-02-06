import { baseUrl } from "../../../appConfig";
import { serverPost } from "../../../utils";
import * as userActions from "../user/actions";
import * as userCoursesActions from "../userCourses/actions";

export const loginUser = (name: string, password: string) => async (dispatch, getState) => {
  const user = { name, password };
  const respons = await fetch(`${baseUrl}/login`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  console.log(respons);
  window.sessionStorage.setItem("auth", respons["token"]);

  // const { user: userData, userCourses: userCoursesData } = await serverPost(`${baseUrl}/getData`);
  // dispatch({ type: userActions.USER_FETCH_DATA, payload: userData });
  // dispatch({ type: userCoursesActions.COURSES_FETCH_DATA, payload: userCoursesData });
};

export const registerUser = (name: string, password: string) => async (dispatch, getState) => {
  const user = { name, password };
  await fetch(`${baseUrl}/register`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const logoutUser = () => async (dispatch, getState) => {
  window.sessionStorage.removeItem("auth");

  dispatch({ type: userActions.USER_LOGOUT });
  dispatch({ type: userCoursesActions.COURSES_REMOVE_DATA });
};
