import React, { useState } from "react";
import { Helmet } from "react-helmet"; // 需要先安装 react-helmet
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
    <>
      <Helmet>
        <title>Multilingual Voice Chat | Real-Time AI-Powered Voice Translation</title>
        <meta 
          name="description" 
          content="Join our AI-powered multilingual voice chat and break language barriers in real-time. Connect with anyone, anywhere!" 
        />
        <meta name="keywords" content="multilingual voice chat, real-time translation, AI voice translation, language barriers, online voice chat" />
        <meta property="og:title" content="Multilingual Voice Chat - Break Language Barriers with AI" />
        <meta property="og:description" content="Experience seamless multilingual communication with our AI-powered voice chat. Real-time translation for multiple languages." />
        <link rel="canonical" href="https://speaksyncs.com/" />
      </Helmet>

      <Paper className={classes.root} component="main">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <header>
              <h1 className={classes.heading}>
                Multilingual Voice Chat – Real-Time AI-Powered Communication
              </h1>

              <Typography component="p" variant="h2" className={classes.subheading}>
                Break Language Barriers with AI Voice Translation
              </Typography>

              <Typography component="div" className={classes.introduction}>
                Connect instantly with anyone, anywhere through our AI-powered voice chat. 
                Speak in your language while others hear in theirs - perfect for gaming, 
                business meetings, or making global connections.
              </Typography>
            </header>
          </Grid>

          {/* Form Section */}
          <Grid item xs={12} component="section">
            <h2>Start Your Multilingual Conversation</h2>
            <form className={classes.form} onSubmit={handleSubmit} role="form">
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

          {/* Features Section */}
          <Grid item xs={12} className={classes.features} component="section">
            <h2>Why Choose Our Voice Chat Platform?</h2>
            <List className={classes.featureList}>
              <ListItem>
                <ListItemText
                  primary={<h3>Real-time Voice Translation</h3>}
                  secondary="Break down language barriers instantly with our innovative real-time voice translation feature. Speak in your native language while our advanced technology translates your voice into multiple languages on the fly, ensuring seamless communication."
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={<h3>Comprehensive Language Support</h3>}
                  secondary="Our platform supports a wide array of languages, including English, Chinese, Japanese, Russian, French, German, Spanish, and many more. No matter where your friends are from, communicate effortlessly with SpeakSync."
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={<h3>Natural Voice Synthesis</h3>}
                  secondary="Experience conversations that sound real with our high-quality voice synthesis. The natural-sounding audio output in target languages enhances your chat experience, making interactions feel more personal and engaging."
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={<h3>Effortless Room Creation</h3>}
                  secondary="Join the conversation quickly with our user-friendly room creation feature. Simply enter a custom room ID to start chatting with friends in seconds, allowing for easy and instant connection on our platform."
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={<h3>User-Friendly Interface</h3>}
                  secondary="Navigate our chat room smoothly with an intuitive interface designed for users of all ages. Enjoy hassle-free access to voice translation, language selection, and room management, making conversation as easy as pie."
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={<h3>Secure Communication</h3>}
                  secondary="Prioritize your privacy and security while chatting with friends. Our platform ensures safe and encrypted conversations, allowing you to share ideas and connect across borders with peace of mind."
                />
              </ListItem>
            </List>
          </Grid>

          {/* FAQ Section with Schema.org markup */}
          <Grid item xs={12} className={classes.faq} component="section">
            <h2>Common Questions About Our Voice Chat</h2>
            <Accordion className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">What is SpeakSync?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                SpeakSync is a real-time voice chat platform that allows people to communicate in different languages. It translates your voice instantly so that you can talk to friends who speak other languages without any problem.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                How do I join a chat room?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                Joining a chat room is easy! You just need to enter a room ID that your friends have shared with you. Once you enter the same room ID, you will be able to chat with your friends.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                Can I use my own language?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                Yes! When you enter a room, you can choose the language you want to speak. The system will automatically translate what others say into your chosen language, so everyone understands each other.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                What languages can I use?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                SpeakSync supports many languages including English, Chinese, Japanese, Russian, French, German, Spanish, and more. You can choose one of these languages to communicate.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                Is the voice translation accurate?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                Yes, the voice translation aims to be very accurate and natural-sounding. This means that when you speak, you'll hear the translated version in a clear and understandable way.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                Do I need to download anything to use SpeakSync?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                No, you don’t need to download anything! You can use SpeakSync directly from the website. Just visit the site, enter a room ID, and start chatting!
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                What if my friends speak different languages?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                No problem! SpeakSync will automatically translate what each person says into the language you have chosen, so everyone can understand and enjoy the conversation.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                How can I create a chat room?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                Creating a chat room is simple! You just need to choose a unique room ID, set it up on the platform, and share it with your friends so they can join.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                Is SpeakSync suitable for kids and elderly users?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                Absolutely! SpeakSync is designed to be user-friendly, making it easy for both kids and elderly users to join chats and communicate with others across different languages.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion className={classes.accordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                What can I do if I have trouble using SpeakSync?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                If you encounter any difficulties, there will usually be help available on the website. You can often find FAQs or support options to get assistance quickly.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Box mt={4} textAlign="center" component="section">
              <h2>Ready to Break Language Barriers?</h2>
              <Typography variant="body1">
                Join thousands of users who are already communicating globally 
                with our AI-powered voice translation technology.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

// Schema.org 标记
const schema = {
  "@context": "https://speaksyncs.com/",
  "@type": "WebApplication",
  "name": "Multilingual Voice Chat",
  "applicationCategory": "CommunicationApplication",
  "description": "Real-time AI-powered voice translation chat platform",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Real-time voice translation",
    "Multiple language support",
    "High-quality voice synthesis",
    "Secure communication"
  ]
};

// 删除这里重复的 Home 组件声明，保留上面的那个
// const Home = () => { ... }  // 删除这部分重复代码

export default Home;
