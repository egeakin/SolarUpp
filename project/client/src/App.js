import React, { Component } from "react";
import classNames from "classnames";
import { AppTopbar } from "./AppTopbar";
import { AppFooter } from "./AppFooter";
import { AppMenu } from "./AppMenu";
import { AppProfile } from "./AppProfile";
import { Dashboard } from "./components/Dashboard";
import { FormsDemo } from "./components/FormsDemo";
import { SampleDemo } from "./components/SampleDemo";
import { DataDemo } from "./components/DataDemo";
import { PanelsDemo } from "./components/PanelsDemo";
import FindAddress  from "./components/FindAddress";
import { MenusDemo } from "./components/MenusDemo";
import { MessagesDemo } from "./components/MessagesDemo";
import { ChartsDemo } from "./components/ChartsDemo";
import { MiscDemo } from "./components/MiscDemo";
import { EmptyPage } from "./components/EmptyPage";
import { Documentation } from "./components/Documentation";
import { Feasibility } from "./components/Feasibility";
import { SolarPlans } from "./components/SolarPlans";
import { ComparePlans } from "./components/ComparePlans";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "./layout/layout.scss";
import "./App.scss";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./util/theme";
import jwtDecode from "jwt-decode";
import axios from "axios";
// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userAction";
// Components
import AuthRoute from "./util/AuthRoute";
import Profile from "./components/Profile";
// Pages
import signup from "./pages/signup";
import login from "./pages/login";

const theme = createMuiTheme(themeFile);

let authenticated = false;

const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp < Date.now() / 1000) {
    store.dispatch(logoutUser());
    //window.location.href = "#/login";
    authenticated = false;
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
    authenticated = true;
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      layoutMode: "static",
      layoutColorMode: "dark",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
    };

    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSidebarClick = this.onSidebarClick.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.createMenu();
  }

  onWrapperClick(event) {
    if (!this.menuClick) {
      this.setState({
        overlayMenuActive: false,
        mobileMenuActive: false,
      });
    }

    this.menuClick = false;
  }

  onToggleMenu(event) {
    this.menuClick = true;

    if (this.isDesktop()) {
      if (this.state.layoutMode === "overlay") {
        this.setState({
          overlayMenuActive: !this.state.overlayMenuActive,
        });
      } else if (this.state.layoutMode === "static") {
        this.setState({
          staticMenuInactive: !this.state.staticMenuInactive,
        });
      }
    } else {
      const mobileMenuActive = this.state.mobileMenuActive;
      this.setState({
        mobileMenuActive: !mobileMenuActive,
      });
    }

    event.preventDefault();
  }

  onSidebarClick(event) {
    this.menuClick = true;
  }

  onMenuItemClick(event) {
    if (!event.item.items) {
      this.setState({
        overlayMenuActive: false,
        mobileMenuActive: false,
      });
    }
  }

  createMenu() {
    this.menu = [
      {
        label: "Dashboard",
        icon: "pi pi-fw pi-home",
        command: () => {
          window.location = "/";
        },
      },
      {
        label: "Menu Modes",
        icon: "pi pi-fw pi-cog",
        items: [
          {
            label: "Static Menu",
            icon: "pi pi-fw pi-bars",
            command: () => this.setState({ layoutMode: "static" }),
          },
          {
            label: "Overlay Menu",
            icon: "pi pi-fw pi-bars",
            command: () => this.setState({ layoutMode: "overlay" }),
          },
        ],
      },
      {
        label: "Menu Colors",
        icon: "pi pi-fw pi-align-left",
        items: [
          {
            label: "Dark",
            icon: "pi pi-fw pi-bars",
            command: () => this.setState({ layoutColorMode: "dark" }),
          },
          {
            label: "Light",
            icon: "pi pi-fw pi-bars",
            command: () => this.setState({ layoutColorMode: "light" }),
          },
        ],
      },
      {
        label: "Components",
        icon: "pi pi-fw pi-globe",
        badge: "9",
        items: [
          {
            label: "Sample Page",
            icon: "pi pi-fw pi-th-large",
            to: "/sample",
          },
          { label: "Forms", icon: "pi pi-fw pi-file", to: "/forms" },
          { label: "Data", icon: "pi pi-fw pi-table", to: "/data" },
          { label: "Panels", icon: "pi pi-fw pi-list", to: "/panels" },
          { label: "Menus", icon: "pi pi-fw pi-plus", to: "/menus" },
          { label: "Messages", icon: "pi pi-fw pi-spinner", to: "/messages" },
          { label: "Charts", icon: "pi pi-fw pi-chart-bar", to: "/charts" },
          { label: "Misc", icon: "pi pi-fw pi-upload", to: "/misc" },
        ],
      },
      {
        label: "Template Pages",
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Empty Page",
            icon: "pi pi-fw pi-circle-off",
            to: "/empty",
          },
          {
            label: "Find Address",
            icon: "pi pi-fw pi-circle-off",
            to: "/findAddress",
          },
          {
            label: "Feasibility Study",
            icon: "pi pi-fw pi-circle-off",
            to: "/feasibility",
          },
          {
            label: "See Solar Plans",
            icon: "pi pi-fw pi-circle-off",
            to: "/solarPlans",
          },
          {
            label: "Compare Plans",
            icon: "pi pi-fw pi-sort-alt",
            to: "/comparePlans",
          },
        ],
      },
      {
        label: "Menu Hierarchy",
        icon: "pi pi-fw pi-search",
        items: [
          {
            label: "Submenu 1",
            icon: "pi pi-fw pi-bookmark",
            items: [
              {
                label: "Submenu 1.1",
                icon: "pi pi-fw pi-bookmark",
                items: [
                  { label: "Submenu 1.1.1", icon: "pi pi-fw pi-bookmark" },
                  { label: "Submenu 1.1.2", icon: "pi pi-fw pi-bookmark" },
                  { label: "Submenu 1.1.3", icon: "pi pi-fw pi-bookmark" },
                ],
              },
              {
                label: "Submenu 1.2",
                icon: "pi pi-fw pi-bookmark",
                items: [
                  { label: "Submenu 1.2.1", icon: "pi pi-fw pi-bookmark" },
                  { label: "Submenu 1.2.2", icon: "pi pi-fw pi-bookmark" },
                ],
              },
            ],
          },
          {
            label: "Submenu 2",
            icon: "pi pi-fw pi-bookmark",
            items: [
              {
                label: "Submenu 2.1",
                icon: "pi pi-fw pi-bookmark",
                items: [
                  { label: "Submenu 2.1.1", icon: "pi pi-fw pi-bookmark" },
                  { label: "Submenu 2.1.2", icon: "pi pi-fw pi-bookmark" },
                  { label: "Submenu 2.1.3", icon: "pi pi-fw pi-bookmark" },
                ],
              },
              {
                label: "Submenu 2.2",
                icon: "pi pi-fw pi-bookmark",
                items: [
                  { label: "Submenu 2.2.1", icon: "pi pi-fw pi-bookmark" },
                  { label: "Submenu 2.2.2", icon: "pi pi-fw pi-bookmark" },
                ],
              },
            ],
          },
        ],
      },
    ];
  }

  addClass(element, className) {
    if (element.classList) element.classList.add(className);
    else element.className += " " + className;
  }

  removeClass(element, className) {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  componentDidUpdate() {
    if (this.state.mobileMenuActive)
      this.addClass(document.body, "body-overflow-hidden");
    else this.removeClass(document.body, "body-overflow-hidden");
  }

  render() {
    const logo =
      this.state.layoutColorMode === "dark"
        ? "assets/layout/images/icon.png"
        : "assets/layout/images/icon.png";

    const wrapperClass = classNames("layout-wrapper", {
      "layout-overlay": this.state.layoutMode === "overlay",
      "layout-static": this.state.layoutMode === "static",
      "layout-static-sidebar-inactive":
        this.state.staticMenuInactive && this.state.layoutMode === "static",
      "layout-overlay-sidebar-active":
        this.state.overlayMenuActive && this.state.layoutMode === "overlay",
      "layout-mobile-sidebar-active": this.state.mobileMenuActive,
    });

    const sidebarClassName = classNames("layout-sidebar", {
      "layout-sidebar-dark": this.state.layoutColorMode === "dark",
      "layout-sidebar-light": this.state.layoutColorMode === "light",
    });

    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <div className={wrapperClass} onClick={this.onWrapperClick}>
            <AppTopbar onToggleMenu={this.onToggleMenu} />
            <div
              ref={(el) => (this.sidebar = el)}
              className={sidebarClassName}
              onClick={this.onSidebarClick}
            >
              <div className="layout-logo">
                <img alt="Logo" src={logo} width="100" height="100" />
              </div>
              <Profile />
              <AppMenu
                model={this.menu}
                onMenuItemClick={this.onMenuItemClick}
              />
            </div>
            <div className="layout-main">
              <Route path="/" exact component={Dashboard} />
              <Route path="/forms" component={FormsDemo} />
              <Route path="/sample" component={SampleDemo} />
              <Route path="/data" component={DataDemo} />
              <Route path="/panels" component={PanelsDemo} />
              <Route path="/findAddress" component={FindAddress} />
              <Route path="/menus" component={MenusDemo} />
              <Route path="/messages" component={MessagesDemo} />
              <Route path="/charts" component={ChartsDemo} />
              <Route path="/misc" component={MiscDemo} />
              <Route path="/empty" component={EmptyPage} />
              <Route path="/feasibility" component={Feasibility} />
              <Route path="/solarPlans" component={SolarPlans} />
              <Route path="/documentation" component={Documentation} />
              <Route path="/ComparePlans" component={ComparePlans} />

              <Route>
                <AuthRoute exact path="/signup" component={signup} />
              </Route>
              <Route>
                <AuthRoute exact path="/Login" component={login} />
              </Route>
            </div>
          </div>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
