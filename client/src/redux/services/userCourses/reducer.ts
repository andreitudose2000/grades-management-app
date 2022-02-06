import { Action, initialState, State } from "../../interfaces";
import * as actions from "./actions";
import { baseUrl } from "../../../appConfig";
import { serverPost } from "../../../utils";
import { cloneDeep } from "lodash";
import * as utils from "../../../utils";

interface AddCourseActionPayload {
  yearId: number;
  semesterId: number;
}

interface EditCourseActionPayload {
  yearId: number;
  semesterId: number;
  courseId: number;
  name?: string;
  grade?: number;
  credits?: number;
}

interface RemoveCourseActionPayload {
  yearId: number;
  semesterId: number;
  courseId: number;
}

export default function userCoursesReducer(state = initialState.userCourses, action: Action) {
  switch (action.type) {
    case actions.ADD_SUBJECT:
      const addPayload = action.payload as AddCourseActionPayload;
      return {
        ...state,
        years: state.years.map((year, yIdx) =>
          yIdx === addPayload.yearId
            ? {
                ...year,
                semesters: year.semesters.map((semester, sIdx) =>
                  sIdx === addPayload.semesterId
                    ? {
                        ...semester,
                        courses: semester.courses.concat({
                          id: semester.courses[semester.courses.length - 1]?.id ?? 0 + 1,
                          name: "",
                          grade: null,
                          credits: null,
                        }),
                      }
                    : { ...semester }
                ),
              }
            : { ...year }
        ),
      };

    // case actions.EDIT_SUBJECT:
    //   const editPayload = action.payload as EditCourseActionPayload;
    //   return state.map((year, yIdx) =>
    //     yIdx === editPayload.yearId
    //       ? {
    //           ...year,
    //           semesters: year.semesters.map((semester, sIdx) =>
    //             sIdx === editPayload.semesterId
    //               ? {
    //                   ...semester,
    //                   courses: semester.courses.map((course) => ({
    //                     ...course,
    //                     name: editPayload.name ?? course.name,
    //                     grade: editPayload.grade ?? course.grade,
    //                     credits: editPayload.credits ?? course.credits,
    //                   })),
    //                 }
    //               : { ...semester }
    //           ),
    //         }
    //       : { ...year }
    //   );

    case actions.EDIT_SUBJECT_NAME:
      console.log(action.payload.name);
      const editPayload = action.payload as EditCourseActionPayload;
      let newState = state;
      newState = cloneDeep(state);
      newState.years
        .find((y) => y.id === action.payload.yearId)
        .semesters.find((s) => s.id === action.payload.semesterId)
        .courses.find((c) => c.id === editPayload.courseId).name = action.payload.name;
      return newState;

    case actions.REMOVE_SUBJECT:
      const removePayload = action.payload as RemoveCourseActionPayload;
      return {
        ...state,
        years: state.years.map((year, yIdx) =>
          yIdx === removePayload.yearId
            ? {
                ...year,
                semesters: year.semesters.map((semester, sIdx) =>
                  sIdx === removePayload.semesterId
                    ? {
                        ...semester,
                        courses: semester.courses
                          .filter((course) => course.id !== removePayload.courseId)
                          .map((course, idx) => ({ ...course, id: idx + 1 })),
                      }
                    : semester
                ),
              }
            : year
        ),
      };

    case actions.COURSES_REMOVE_DATA:
      return [];

    default:
      return state;
  }
}

export const editUserCourses = (payload: EditCourseActionPayload) => async (dispatch, getState) => {
  dispatch({ type: actions.EDIT_SUBJECT_NAME, payload });
  const response = serverPost(`${baseUrl}/editCourses`, getState().years);
};

export const editSubjectName = (yearId, semesterId, courseId, value) => async (dispatch, getState) => {
  console.log("edited");
  dispatch({
    type: actions.EDIT_SUBJECT_NAME,
    payload: {
      yearId: yearId,
      semesterId: semesterId,
      courseId: courseId,
      name: value,
    },
  });

  const response = await utils.serverPost(`${baseUrl}/postData`, JSON.stringify(getState()));
};
