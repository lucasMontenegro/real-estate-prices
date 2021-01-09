import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import cover from "./cover.jpg";
import logo from "./logo.svg";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import PropTypes from "prop-types";
const useStyles = makeStyles(
  (theme) => ({
    root: {
      backgroundColor: "#f0f2f5",
      minWidth: "20rem",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    permDrawer: {
      marginLeft: "20rem",
    },
    header: {
      backgroundColor: "white",
      alignItems: "center",
    },
    coverRow: {
      width: "100%",
      overflow: "hidden",
      background:
        "linear-gradient(180deg, rgba(143,188,241,1) 0%, rgba(255,255,255,1) 70%)",
      display: "flex",
      justifyContent: "center",
    },
    cover: {
      width: "100%",
      maxWidth: "60rem",
      minHeight: "16rem",
      objectFit: "cover",
      margin: "0 0.25rem",
      borderBottomLeftRadius: "0.5rem",
      borderBottomRightRadius: "0.5rem",
    },
    responsiveCover1: {
      [theme.breakpoints.down("md")]: {
        margin: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
    responsiveCover2: {
      [theme.breakpoints.down("sm")]: {
        margin: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
    logoRow: {
      width: "100%",
      maxWidth: "60rem",
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down("xs")]: {
        position: "relative",
        bottom: "1rem",
        padding: "0 1rem",
        flexDirection: "column",
      },
    },
    logoMargin: {
      position: "relative",
      bottom: "1rem",
      backgroundColor: "white",
      borderRadius: "50%",
      padding: "0.3rem",
      display: "flex",
      [theme.breakpoints.down("xs")]: {
        position: "static",
      },
    },
    logoBorder: {
      display: "flex",
      border: "0.0625rem solid rgba(0, 0, 0, 0.1)",
      borderRadius: "50%",
    },
    logo: {
      width: "8rem",
      height: "8rem",
    },
    titleColumn: {
      marginLeft: "1rem",
      [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
    },
  }),
  { name: "Page" }
);
function Page(props) {
  const classes = useStyles();
  let rootClass = classes.root,
    coverClass = classes.cover;
  if (props.permDrawer) {
    rootClass += " " + classes.permDrawer;
    coverClass += " " + classes.responsiveCover1;
  } else {
    coverClass += " " + classes.responsiveCover2;
  }
  return (
    <div className={rootClass}>
      <AppBar
        className={classes.header}
        position="static"
        color="default"
        elevation={1}
      >
        <div className={classes.coverRow}>
          <img className={coverClass} src={cover} alt="Imagen de portada" />
        </div>
        <div className={classes.logoRow}>
          <div className={classes.logoMargin}>
            <div className={classes.logoBorder}>
              <img className={classes.logo} src={logo} alt="Logo" />
            </div>
          </div>
          <div className={classes.titleColumn}>
            <Typography variant="h4" component="h1" color="textPrimary">
              Terrenos Charata
            </Typography>
            <Typography variant="h6" component="h2" color="textSecondary">
              <Link
                color="textSecondary"
                href="https://www.facebook.com/terrenos.charata"
                target="_blank"
                rel="noopener noreferrer"
              >
                @terrenos.charata
              </Link>
            </Typography>
          </div>
        </div>
      </AppBar>
      {props.children}
    </div>
  );
}
Page.propTypes = {
  permDrawer: PropTypes.bool,
  children: PropTypes.node,
};
export default Page;
