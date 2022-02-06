import { Button, Grid, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../redux/services/auth/reducer";
import * as utils from "../utils";
import NotFoundPage from "./NotFoundPage";

interface LoginPageState {
  name: string;
  password: string;
  error: string;
}

export default function RegisterPage() {
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
          <Typography variant="h6">Register</Typography>
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
            onClick={() => dispatch(registerUser(state.name, state.password))}
          >
            Register
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
