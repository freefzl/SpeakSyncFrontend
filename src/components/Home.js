import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
    maxWidth: 800,
    margin: "0 auto",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    width: "100%",
  },
  heading: {
    marginBottom: theme.spacing(3),
  },
  features: {
    marginTop: theme.spacing(4),
  },
  faq: {
    marginTop: theme.spacing(4),
  },
  accordion: {
    marginBottom: theme.spacing(1),
  },
  featureList: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
  },
}));

const Home = () => {
  const classes = useStyles();
  const history = useHistory();
  const [roomId, setRoomId] = useState("");
  const [language, setLanguage] = useState("en");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      history.push(`/room/${roomId}?language=${language}`);
    }
  };

  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            className={classes.heading}
          >
            Real-time Multilingual Speak Sync Voice Chat Room
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            Break language barriers with real-time voice translation in multiple
            languages
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            Enter a custom room ID and share it with your friends. If they enter the same room ID, they will join the same room and be able to communicate with each other.

Selecting a language means choosing the language you will be using. If others select a different language, the system will automatically translate their speech into your chosen language and play it as audio.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  variant="outlined"
                  placeholder="Enter room ID or create a new room"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Select Language</InputLabel>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    label="Select Language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="zh">Chinese</MenuItem>
                    <MenuItem value="ja">Japanese</MenuItem>
                    <MenuItem value="ru">Russian</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="pt">Portuguese</MenuItem>
                    <MenuItem value="it">Italian</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Join Room
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>

        <Grid item xs={12} className={classes.features}>
          <Typography variant="h5" gutterBottom>
            Key Features
          </Typography>
          <List className={classes.featureList}>
            <ListItem>
              <ListItemText
                primary="Real-time Voice Translation"
                secondary="Instantly translate your voice into multiple languages"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Multiple Language Support"
                secondary="Support for English, Chinese, Japanese, Russian, French, German, Spanish, and more"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="High-Quality Voice Synthesis"
                secondary="Natural-sounding voice output in target languages"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Easy Room Creation"
                secondary="Create or join rooms with simple room IDs"
              />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12} className={classes.faq}>
          <Typography variant="h5" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Accordion className={classes.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">How does it work?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The system uses advanced speech recognition to convert your
                voice into text, translates it into the target language, and
                then converts it back to speech in real-time. All participants
                in the room can hear the conversation in their chosen language.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion className={classes.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                Is my conversation secure?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                All voice data is processed in real-time and is not stored on
                our servers. The communication is handled through secure
                WebSocket connections.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion className={classes.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                What devices are supported?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The system works on any modern web browser that supports WebRTC
                and microphone access. This includes Chrome, Firefox, Safari,
                and Edge on both desktop and mobile devices.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion className={classes.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                How many people can join a room?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Multiple users can join the same room and communicate in
                different languages simultaneously. Each user can select their
                preferred language for both speaking and listening.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Start breaking language barriers today with our real-time voice
              translation technology.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Home;
