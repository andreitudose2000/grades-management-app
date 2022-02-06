import * as React from "react";
import { Divider, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { State, Year, Course } from "../redux/interfaces";
import CoursesTable from "../components/business/CoursesTable";
import { fetchCourses } from "../redux/services/userCourses/reducer";
import Report from "../components/business/Report";
import Container from "@mui/material/Container";
import { Navigate } from "react-router-dom";
import * as utils from "../utils";

export default function MyPage() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchCourses());
  }, []);
  const years: Year[] = useSelector((state: State) => state.userCourses.years);

  return !utils.authValid() ? (
    <Navigate to="/" />
  ) : (
    <Container>
      {years &&
        years.map((year, yIdx) => (
          <>
            <Typography variant="h4">{`Anul ${year.id}`}</Typography>

            <div className="row">
              <div className="col-lg-9">
                {year.semesters.map((semester, idx) => (
                  <>
                    <Typography variant="h6" key={semester.id}>{`Semestrul ${semester.id}`}</Typography>
                    <div className="row">
                      <div className="col-lg-8">
                        <CoursesTable yearId={year.id} semesterId={semester.id} data={semester.courses} />
                      </div>
                      <div className="col-lg-4 d-inline-flex flex-column justify-content-center">
                        <span className="p-2">
                          <Report title={`Semestrul ${semester.id}`} courses={semester.courses} showCheckbox />
                        </span>
                      </div>
                    </div>
                    {idx !== year.semesters.length - 1 ? <Divider light sx={{ margin: "30px 20px" }} /> : null}
                  </>
                ))}
              </div>
              <div className="col-lg-3 d-inline-flex flex-column justify-content-center">
                <span className="p-2">
                  <Report
                    title={`Anul ${year.id}`}
                    courses={year.semesters.reduce((val, curr) => val.concat(...curr.courses), [])}
                  />
                </span>
              </div>
              {yIdx !== years.length - 1 ? <Divider sx={{ padding: "30px 20px" }} /> : null}
            </div>
          </>
        ))}
    </Container>
  );
}
