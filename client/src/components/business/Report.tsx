import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Course, Semester } from "../../redux/interfaces";

interface ReportProps {
  title: string;
  courses: Course[];
  showCheckbox?: boolean;
}

const calculateCreditPoints = (courses: Course[]) => {
  const creditPoints = courses.reduce(
    (creditPoints, curr) => creditPoints + (curr.credits ?? 0) * (curr.grade && curr.grade >= 5 ? curr.grade : 0),
    0
  );

  return creditPoints;
};

const calculateCreditTotal = (courses: Course[]) => {
  const creditCount = courses.reduce((creditCount, curr) => creditCount + curr.credits ?? 0, 0);

  return creditCount;
};

const calculateGradeAverage = (courses: Course[]) => {
  const [creditPoints, creditCount] = courses.reduce(
    ([creditPoints, creditCount], curr) => [
      creditPoints + (curr.credits ?? 0) * (curr.grade && curr.grade >= 5 ? curr.grade : 0),
      creditCount + (curr.grade === null ? 0 : curr.credits ?? 0),
    ],
    [0, 0]
  );

  return creditCount === 0 ? "-" : (creditPoints / creditCount).toFixed(2);
};

export default function Report(props: ReportProps) {
  return (
    <>
      <Typography variant="h5">{props.title}</Typography>

      <Typography variant="h6">Media</Typography>
      {calculateGradeAverage(props.courses)}

      <Typography variant="h6">Total puncte credit</Typography>
      {calculateCreditPoints(props.courses)}

      <Typography variant="h6">Credite pe semestru</Typography>
      {calculateCreditTotal(props.courses)}

      {props.showCheckbox ? (
        <FormGroup>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Materiile fara nota conteaza la medie" />
        </FormGroup>
      ) : null}
    </>
  );
}
