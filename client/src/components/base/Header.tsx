import LoginIcon from "@mui/icons-material/Login";
import RegisterIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { Link } from "react-router-dom";
import * as utils from "../../utils";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/services/auth/reducer";

export default function Header() {
  const dispatch = useDispatch();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Link to="/my-grades">
              <Button sx={{ my: 2, color: "white", display: "block" }}>Notele Mele</Button>
            </Link>
            <Link to="/browse">
              <Button sx={{ my: 2, color: "white", display: "block" }}>Cauta Cataloage</Button>
            </Link>
            <Link to="/feedback">
              <Button sx={{ my: 2, color: "white", display: "block" }}>Feedback</Button>
            </Link>
          </Box>
          {utils.authValid() ? (
            <Button color="inherit" onClick={() => dispatch(logoutUser())}>
              <LogoutIcon />
            </Button>
          ) : (
            <>
              <Button color="inherit">
                <Link to="/login">
                  <LoginIcon />
                </Link>
              </Button>
              <Button color="inherit">
                <Link to="/register">
                  <RegisterIcon />
                </Link>
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
