import { Divider, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import * as React from "react";
import { baseUrl } from "../appConfig";
import CoursesTable from "../components/business/CoursesTable";
import Report from "../components/business/Report";
import { Config } from "../redux/interfaces";
import * as utils from "../utils";

interface ConfigsPageState {
  configs: Config[];
}

export default function ConfigsPage() {
  const [state, setState] = React.useState<ConfigsPageState>();

  React.useEffect(() => {
    async function getData() {
      const response = await utils.serverGet(`${baseUrl}/getConfigs`);
      setState((state) => ({ ...state, configs: response }));
    }

    getData();
  }, []);

  // React.useEffect(() => {
  //   dispatch(fetchCourses());
  // }, []);

  return (
    <>
      {state.configs.map((config) =>
        config.years.map((year, yIdx) => (
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
              {yIdx !== config.years.length - 1 ? <Divider sx={{ padding: "30px 20px" }} /> : null}
            </div>
          </>
        ))
      )}
    </>
  );
}
