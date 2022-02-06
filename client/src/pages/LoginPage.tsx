import { Button, Grid, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { baseUrl } from "../appConfig";
import * as utils from "../utils";

interface LoginPageState {
  name: string;
  password: string;
  error: string;
  success: boolean;
}

export default function LoginPage() {
  const dispatch = useDispatch();

  const [state, setState] = React.useState<LoginPageState>({
    name: "",
    password: "",
    error: "",
    success: false,
  });

  const loginUser = async (name: string, password: string) => {
    const user = { name, password };
    const response = await fetch(`${baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());

    window.sessionStorage.setItem("auth", response["token"]);

    //dispatch(fetchCourses());

    setState((state) => ({ ...state, success: true }));
  };

  return utils.authValid() ? (
    <Navigate to="/" />
  ) : state.success ? (
    <Navigate to="/my-grades" />
  ) : (
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
        <Typography variant="h6">Login</Typography>
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
          label="Password"
          type="password"
          value={state.password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setState((state) => ({ ...state, password: event.target.value }))
          }
        />
      </Grid>
      <Grid
        item
        sx={{
          margin: "10px 10px",
        }}
      >
        <Button variant="outlined" onClick={() => loginUser(state.name, state.password)}>
          Login
        </Button>
      </Grid>
    </Grid>
  );
}
