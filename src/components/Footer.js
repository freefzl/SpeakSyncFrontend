import React from "react";
import { Box, Typography, Link, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    marginTop: "5%",
    width: "100%",
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  container: {
    maxWidth: 800,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0, 2),
    },
  },
  links: {
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(3),
    marginBottom: theme.spacing(2),
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      gap: theme.spacing(2),
    },
  },
  copyright: {
    color: theme.palette.text.secondary,
  },
}));

const Footer = () => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        
        <Typography
          variant="body2"
          align="center"
          className={classes.copyright}
        >
          © {currentYear} Multilingual Speak Sync Voice Chat SpeakSyncs.com. All rights reserved. If you have any suggestions, send me an email:fengemma9@gmail.com
        </Typography>
      </div>
    </footer>
  );
};

export default Footer;
