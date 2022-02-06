export interface Course {
  id: number;
  name: string;
  grade: number | null;
  credits: number | null;
}

export interface Semester {
  id: number;
  courses: Course[];
}

export interface Year {
  id: number;
  semesters: Semester[];
}

export interface State {
  user: User;
  years: Year[];
}

export interface User {
  name: string;
  yearsOfStudy: number;
  semestersPerYear: number;
}

export const initialState: State = {
  user: {
    name: "Andrei",
    yearsOfStudy: 3,
    semestersPerYear: 2,
  },
  years: [
    {
      id: 1,
      semesters: [
        {
          id: 1,
          courses: [
            {
              id: 1,
              name: "Curs1",
              grade: 8,
              credits: 4,
            },
            {
              id: 1,
              name: "Curs1",
              grade: 6,
              credits: 5,
            },
          ],
        },
        {
          id: 2,
          courses: [
            {
              id: 1,
              name: "Curs2",
              grade: 6,
              credits: 5,
            },
          ],
        },
      ],
    },
  ],
};

export interface Action {
  type: string;
  payload: any;
}
