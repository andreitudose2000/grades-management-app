import * as React from "react";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { State, Year, Course } from "../redux/interfaces";
import CoursesTable from "../components/base/CoursesTable";

const calculateGradeAverage = (courses: Course[]) => {
  const totalCredits = courses.reduce((val, curr) => val + curr.credits, 0);
  const credits = courses.reduce((val, curr) => val + curr.credits * curr.grade, 0);
  return {
    totalCredits,
    credits,
    average: (credits / totalCredits).toFixed(2),
  };
};

export default function MyPage() {
  const years: Year[] = useSelector((state: State) => state.years);

  return (
    <>
      {years.map((year) => (
        <>
          <Typography variant="h4">{`Anul ${year.id}`}</Typography>
          {year.semesters.map((semester) => (
            <>
              <Typography variant="h6">{`Semestrul ${semester.id}`}</Typography>
              <div className="row">
                <div className="col-lg-6">
                  <CoursesTable yearId={year.id} semesterId={semester.id} data={semester.courses} />
                </div>
                <div className="col-lg-6">{calculateGradeAverage(semester.courses).average}</div>
              </div>
            </>
          ))}
        </>
      ))}
    </>
  );
}
