import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Course } from "../../redux/interfaces";
import CustomTextField from "../base/CustomTextField";
import { useDispatch } from "react-redux";
import * as actions from "../../redux/services/userCourses/actions";
import { addCourse, editCourse, removeCourse } from "../../redux/services/userCourses/reducer";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface CoursesTableProps {
  yearId: number;
  semesterId: number;
  data: Course[];
}

export default function CoursesTable(props: CoursesTableProps) {
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
              key={course.name + course.grade + course.credits}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <RemoveIcon
                  fontSize="small"
                  onClick={() => dispatch(removeCourse(props.yearId, props.semesterId, course.id))}
                />
                <CustomTextField
                  type="string"
                  value={course.name ?? ""}
                  setValue={(value) => dispatch(editCourse(props.yearId, props.semesterId, course.id, { name: value }))}
                />
              </TableCell>
              <TableCell align="right">
                <CustomTextField
                  type="number"
                  value={course.grade ?? "-"}
                  setValue={(value) =>
                    dispatch(
                      editCourse(props.yearId, props.semesterId, course.id, {
                        grade: value !== "" ? Number(value) : null,
                      })
                    )
                  }
                />
              </TableCell>
              <TableCell align="right">
                <CustomTextField
                  type="number"
                  value={course.credits ?? "-"}
                  setValue={(value) =>
                    dispatch(
                      editCourse(props.yearId, props.semesterId, course.id, {
                        credits: value !== "" ? Number(value) : null,
                      })
                    )
                  }
                />
              </TableCell>

              <TableCell align="right">{course.grade * course.credits}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <span onClick={() => dispatch(addCourse(props.yearId, props.semesterId))}>
                <AddIcon fontSize="small" />
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
