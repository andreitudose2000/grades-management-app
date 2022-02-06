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
import { authValid } from "../../utils";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            LOGO
          </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Link to="/my-grades">
              <Button sx={{ my: 2, color: "white", display: "block" }}>Note</Button>
            </Link>
            <Link to="/browse">
              <Button sx={{ my: 2, color: "white", display: "block" }}>Cauta</Button>
            </Link>
            <Link to="/feedback">
              <Button sx={{ my: 2, color: "white", display: "block" }}>Feedback</Button>
            </Link>
          </Box>
          {authValid() ? (
            <Button
              color="inherit"
              onClick={() => {
                window.sessionStorage.removeItem("auth");
              }}
            >
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
