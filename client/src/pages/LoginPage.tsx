import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import Box from "@mui/system/Box";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { State, Year } from "../redux/interfaces";
import { baseUrl } from "../appConfig";
import * as utils from "../utils";
import NotFoundPage from "./NotFoundPage";
import { loginUser } from "../redux/services/auth/reducer";

interface LoginPageState {
  name: string;
  password: string;
  error: string;
}

export default function LoginPage() {
  const dispatch = useDispatch();

  const [state, setState] = React.useState<LoginPageState>({
    name: "",
    password: "",
    error: "",
  });

  const cookie = utils.parseCookie(document.cookie);
  if (cookie["auth"]) {
    return <NotFoundPage />;
  }
  return (
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
          <Button
            variant="outlined"
            onClick={() => dispatch(loginUser(state.name, state.password))}
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
