import { Action, Course, initialState, State } from "../../interfaces";
import * as actions from "./actions";
import { baseUrl } from "../../../appConfig";
import { serverPost } from "../../../utils";
import { cloneDeep, last } from "lodash";
import * as utils from "../../../utils";

interface AddCourseActionPayload {
  yearId: number;
  semesterId: number;
  course: Course;
}

interface EditCourseActionPayload {
  yearId: number;
  semesterId: number;
  courseId: number;
  course: Course;
}

interface RemoveCourseActionPayload {
  yearId: number;
  semesterId: number;
  courseId: number;
}

export default function userCoursesReducer(state: typeof initialState.userCourses = { years: [] }, action: Action) {
  let newState;
  let course;
  let semester;
  switch (action.type) {
    case actions.ADD_COURSE:
      const addPayload = action.payload as AddCourseActionPayload;
      newState = cloneDeep(state);
      semester = newState.years
        .find((y) => y.id === addPayload.yearId)
        .semesters.find((s) => s.id === addPayload.semesterId);
      const lastId = semester.courses[semester.courses.length - 1]?.id ?? 0;
      semester.courses.push({
        id: lastId + 1,
        name: null,
        grade: null,
        credits: null,
      } as Course);
      return newState;

    case actions.EDIT_COURSE:
      const editPayload = action.payload as EditCourseActionPayload;
      newState = cloneDeep(state);
      course = newState.years
        .find((y) => y.id === editPayload.yearId)
        .semesters.find((s) => s.id === editPayload.semesterId)
        .courses.find((c) => c.id === editPayload.courseId);
      Object.assign(course, editPayload.course);
      return newState;

    case actions.REMOVE_COURSE:
      const removePayload = action.payload as RemoveCourseActionPayload;
      newState = cloneDeep(state);
      semester = newState.years
        .find((y) => y.id === removePayload.yearId)
        .semesters.find((s) => s.id === removePayload.semesterId);
      semester.courses.splice(
        semester.courses.findIndex((c) => c.id === removePayload.courseId),
        1
      );
      return newState;

    case actions.COURSES_FETCH_DATA:
      return { ...state, years: JSON.parse(action.payload).years };

    case actions.COURSES_FETCH_DATA:
      return { ...state, years: JSON.parse(action.payload).years };

    default:
      return state;
  }
}

export const fetchCourses = () => async (dispatch, getState) => {
  const coursesData = await utils.serverGet(`${baseUrl}/getData`);

  dispatch({
    type: actions.COURSES_FETCH_DATA,
    payload: coursesData["grades_json"],
  });
};

export const fetchConfigs = () => async (dispatch, getState) => {
  const coursesData = await utils.serverGet(`${baseUrl}/getData`);

  dispatch({
    type: actions.CONFIGS_FETCH_DATA,
    payload: coursesData,
  });
};

export const addCourse = (yearId, semesterId) => async (dispatch, getState) => {
  dispatch({
    type: actions.ADD_COURSE,
    payload: {
      yearId: yearId,
      semesterId: semesterId,
    },
  });

  const response = await utils.serverPost(`${baseUrl}/postData`, JSON.stringify(getState().userCourses));
};

export const editCourse = (yearId, semesterId, courseId, course) => async (dispatch, getState) => {
  dispatch({
    type: actions.EDIT_COURSE,
    payload: {
      yearId: yearId,
      semesterId: semesterId,
      courseId: courseId,
      course: course,
    },
  });

  const response = await utils.serverPost(`${baseUrl}/postData`, JSON.stringify(getState().userCourses));
};

export const removeCourse = (yearId, semesterId, courseId) => async (dispatch, getState) => {
  dispatch({
    type: actions.REMOVE_COURSE,
    payload: {
      yearId: yearId,
      semesterId: semesterId,
      courseId: courseId,
    },
  });

  const response = await utils.serverPost(`${baseUrl}/postData`, JSON.stringify(getState().userCourses));
};
