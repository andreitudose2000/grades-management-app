import * as React from "react";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { State, Year } from "../redux/interfaces";
import CoursesTable from "../components/base/CoursesTable";

export default function PublicConfigPage() {
  const years: Year[] = useSelector((state: State) => state.years);
  return (
    <>
      {years.map((year, yIdx) => (
        <>
          <Typography variant="h4">{`Anul ${yIdx}`}</Typography>
          {year.semesters.map((semester, sIdx) => (
            <>
              <Typography variant="h6">{`Semestrul ${sIdx}`}</Typography>
              <CoursesTable data={semester.courses} />
            </>
          ))}
        </>
      ))}
    </>
  );
}
