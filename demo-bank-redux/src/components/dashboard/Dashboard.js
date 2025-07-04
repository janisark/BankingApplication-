import * as React from "react";
import { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems, secondaryListItems } from "./listItems";
import Chart from "./Chart";
import TotalAccountBalance from "./TotalAccountBalance";
import Accounts from "./Accounts";
import axios from "axios";
import Button from "@mui/material/Button";
import alertify from "alertifyjs";
import { useNavigate } from "react-router-dom";
import AddAccount from "./AddAccount";
import TransactionHistory from "./TransactionHistory";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Beko's Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function Dashboard() {
  // Create a single theme instance
  const theme = createTheme();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSignOut = async (event) => {
    event.preventDefault();
    try {
      const apiUrl = "http://127.0.0.1:8070/logout";
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const accessToken = userInfo.access_token;
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.get(apiUrl, { headers });
      if (response.status === 200) {
        localStorage.clear();
        alertify.success("Logout successful.");
        navigate("/");
      }
    } catch (error) {
      alertify.error("Logout failed.");
      console.error("Logout error:", error);
    }
  };

  const handleSaveAccount = (accountInfo) => {
    console.log("New account info:", accountInfo);
    
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="absolute" open={open} sx={{ backgroundColor: "#E69081" }}>
        <Toolbar sx={{ pr: "24px" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{ marginRight: "36px", ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Beko Bank
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button color="inherit" onClick={handleSignOut}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", px: [1] }}>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems}
          <Divider sx={{ my: 1 }} />
          {secondaryListItems}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 500 }}>
                <Chart />
              </Paper>
            </Grid>
            {/* Balance */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}>
                <TotalAccountBalance />
              </Paper>
            </Grid>
            {/* Accounts Table */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Accounts />
              </Paper>
            </Grid>
            {/* Add Account Button */}
            <Grid item xs={12} container justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{ backgroundColor: "#EB3D13" }}
                onClick={() => setIsFormOpen(true)}
              >
                Add Account
              </Button>
              <AddAccount open={isFormOpen} onClose={() => setIsFormOpen(false)} onSaveAccount={handleSaveAccount} />
            </Grid>
          </Grid>
          {/* Transaction History */}
          <Grid sx={{ mt: 2 }}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <TransactionHistory />
            </Paper>
          </Grid>
          {/* Footer */}
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
