import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import EditDetails from "./EditDetails";
// MUI
import Button from "@material-ui/core/Button";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
// Redux
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/userAction";
import { AppProfile } from "../AppProfile";
import { AppMenu } from "../AppMenu";

const styles = (theme) => ({
  paper: {
    padding: 20,
    color: "white",
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "80%",
        left: "70%",
      },
    },
    "& .profile-image": {
      width: 100,
      height: 100,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%",
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle",
      },
      "& a": {
        color: "theme.palette.primary.main",
      },
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0",
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px",
    },
  },
});

class Profile extends Component {
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
        label: "Sign Up",
        icon: "pi pi-fw pi-user-plus",
        command: () => {
          window.location = "#/signup";
          window.location.reload();
        },
      },
      {
        label: "Log In",
        icon: "pi pi-fw pi-sign-in",
        command: () => {
          window.location = "#/login";
          window.location.reload();
        },
      },
    ];
    this.menu2 = [
      {
        label: "Log out",
        icon: "pi pi-fw pi-sign-out",
        command: () => {
          window.onclick = this.handleLogout;
          window.location.reload();
        },
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
  handleImageChange = (event) => {
    const image = event.target.files[0];
    console.log(event.target);
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  handleLogout = () => {
    this.props.logoutUser();
  };
  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated,
      },
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <div>
          <div className={classes.paper}>
            <div className={classes.profile}>
              <div className="image-wrapper">
                <img src={imageUrl} alt="profile" className="profile-image" />
                <input
                  type="file"
                  id="imageInput"
                  hidden="hidden"
                  onChange={this.handleImageChange}
                />
                <Tooltip title="Edit profile picture" placement="right-start">
                  <IconButton
                    onClick={this.handleEditPicture}
                    className="button"
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
              <hr />
              <div className="profile-details">
                <MuiLink
                  component={Link}
                  to={`/users/${handle}`}
                  color="primary"
                  variant="body1"
                >
                  @{handle}
                </MuiLink>
                <hr />
                {bio && <Typography variant="body2">{bio}</Typography>}
                <hr />
                {location && (
                  <Fragment>
                    <LocationOn color="primary" variant="body2" />{" "}
                    <span>{location}</span>
                    <hr />
                  </Fragment>
                )}
                {website && (
                  <Fragment>
                    <a
                      href={website}
                      target="_blank"
                      variant="body2"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      {website}
                    </a>
                    <hr />
                  </Fragment>
                )}
                <CalendarToday color="primary" variant="body2" />{" "}
                <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
              </div>
              <div align="center">
                <EditDetails />
              </div>
            </div>
          </div>
          <AppMenu model={this.menu2} onMenuItemClick={this.onMenuItemClick} />
        </div>
      ) : (
        <div>
          <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
        </div>
      )
    ) : (
      <p>Loading...</p>
    );

    return profileMarkup;
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = { logoutUser, uploadImage };

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
