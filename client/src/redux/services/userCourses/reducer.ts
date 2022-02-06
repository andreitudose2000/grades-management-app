import { Action, initialState, State } from "../../interfaces";
import * as actions from "./actions";
import { baseUrl } from "../../../appConfig";
import { serverPost } from "../../../utils";

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

export default function userCoursesReducer(stateYears = initialState.years, action: Action) {
  switch (action.type) {
    case actions.ADD_SUBJECT:
      const addPayload = action.payload as AddCourseActionPayload;
      return stateYears.map((year, yIdx) =>
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
                  : semester
              ),
            }
          : year
      );

    case actions.EDIT_SUBJECT:
      const editPayload = action.payload as EditCourseActionPayload;
      return stateYears.map((year, yIdx) =>
        yIdx === editPayload.yearId
          ? {
              ...year,
              semesters: year.semesters.map((semester, sIdx) =>
                sIdx === editPayload.semesterId
                  ? {
                      ...semester,
                      courses: semester.courses.map((course) =>
                        course.id === editPayload.courseId
                          ? {
                              ...course,
                              name: editPayload.name ?? course.name,
                              grade: editPayload.grade ?? course.grade,
                              credits: editPayload.credits ?? course.credits,
                            }
                          : course
                      ),
                    }
                  : semester
              ),
            }
          : year
      );

    case actions.REMOVE_SUBJECT:
      const removePayload = action.payload as RemoveCourseActionPayload;
      return stateYears.map((year, yIdx) =>
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
      );

    default:
      return stateYears;
  }
}

export const editUserCourses = (payload: EditCourseActionPayload) => async (dispatch, getState) => {
  dispatch({ type: actions.EDIT_SUBJECT, payload });
  const response = serverPost(`${baseUrl}/editCourses`, getState().years);
};
