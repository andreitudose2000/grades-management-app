import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Course } from "../../redux/interfaces";
import CustomTextField from "./CustomTextField";
import { useDispatch } from "react-redux";
import * as actions from "../../redux/services/userCourses/actions";

interface TableProps {
  yearId: number;
  semesterId: number;
  data: Course[];
}

export default function CoursesTable(props: TableProps) {
  const columnNames = ["Materie", "Nota", "Credite", "Puncte credit"];

  const dispatch = useDispatch();
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 550 }} aria-label="simple table">
        <colgroup>
          <col style={{ width: "50%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <TableHead>
          <TableRow>
            {columnNames.map((colName, idx) => (
              <TableCell size="small" align={idx === 0 ? undefined : "right"}>
                {colName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((course) => (
            <TableRow
              key={course.name + course.grade.toString() + course.credits.toString()}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <CustomTextField
                  type="string"
                  value={course.name}
                  setValue={(value) =>
                    dispatch({
                      type: actions.EDIT_SUBJECT,
                      payload: {
                        yearId: props.yearId,
                        semesterId: props.semesterId,
                        courseId: course.id,
                        name: value,
                      },
                    })
                  }
                />
              </TableCell>
              <TableCell align="right">{course.grade}</TableCell>
              <TableCell align="right">{course.credits}</TableCell>
              <TableCell align="right">{course.grade * course.credits}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
