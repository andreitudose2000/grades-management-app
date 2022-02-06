import { Button, Grid, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import * as utils from "../utils";
import * as userActions from "../redux/services/user/actions";
import { baseUrl } from "../appConfig";

interface RegisterPageState {
  name: string;
  password: string;
  error: string;
  yearsOfStudy: number;
  semestersPerYear: number;
  success: boolean;
}

export default function RegisterPage() {
  const dispatch = useDispatch();

  const [state, setState] = React.useState<RegisterPageState>({
    name: "",
    password: "",
    error: "",
    yearsOfStudy: 0,
    semestersPerYear: 0,
    success: false,
  });

  const registerUser = async (name: string, password: string, yearsOfStudy: number, semestersPerYear: number) => {
    const user = { name, password, yearsOfStudy, semestersPerYear };
    const response = await fetch(`${baseUrl}/register`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());

    setState((state) => ({ ...state, success: true }));
  };

  return utils.authValid() ? (
    <Navigate to="/" />
  ) : state.success ? (
    <Navigate to="/login" />
  ) : (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "50vh" }}
      >
        <Grid
          item
          sx={{
            margin: "10px 10px",
          }}
        >
          <Typography variant="h6">Inregistrare</Typography>
        </Grid>
        <Grid
          sx={{
            margin: "10px 10px",
          }}
        >
          <TextField
            variant="outlined"
            label="Username"
            value={state.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setState((state) => ({ ...state, name: event.target.value }))
            }
          />
        </Grid>
        <Grid
          item
          sx={{
            margin: "10px 10px",
          }}
        >
          <TextField
            variant="outlined"
            label="Parola"
            type="password"
            value={state.password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setState((state) => ({ ...state, password: event.target.value }))
            }
          />
        </Grid>
        <Grid
          sx={{
            margin: "10px 10px",
          }}
        >
          <TextField
            variant="outlined"
            type="number"
            label="Ani de studiu"
            value={state.yearsOfStudy}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setState((state) => ({ ...state, yearsOfStudy: Number(event.target.value) }))
            }
          />
        </Grid>
        <Grid
          sx={{
            margin: "10px 10px",
          }}
        >
          <TextField
            variant="outlined"
            type="number"
            label="Semestre pe an"
            value={state.semestersPerYear}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setState((state) => ({ ...state, semestersPerYear: Number(event.target.value) }))
            }
          />
        </Grid>
        <Grid
          item
          sx={{
            margin: "10px 10px",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => registerUser(state.name, state.password, state.yearsOfStudy, state.semestersPerYear)}
          >
            Inregistrare
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
