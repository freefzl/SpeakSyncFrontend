import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
} from "react";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Snackbar,
  Paper,
  makeStyles,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  statusPaper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  button: {
    margin: theme.spacing(1),
  },
  audioStatus: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.contrastText,
    borderRadius: theme.shape.borderRadius,
  },
}));

const Alert = forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const CustomSnackbar = forwardRef(
  ({ open, onClose, severity, message }, ref) => (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose} ref={ref}>
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  )
);

const Room = () => {
  const classes = useStyles();
  const location = useLocation();
  const roomId = location.pathname.split("/")[2] || "";
  const searchParams = new URLSearchParams(location.search);
  const language = searchParams.get("language") || "en";

  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [audioActivity, setAudioActivity] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [audioLogs, setAudioLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(true);
  const [receivedChunkCounter, setReceivedChunkCounter] = useState(0);
  const [roomMembers, setRoomMembers] = useState(0);
  const [translatedText, setTranslatedText] = useState("");

  const websocketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const snackbarRef = useRef(null);

  const addLog = useCallback((message) => {
    setAudioLogs((prevLogs) => {
      const newLogs = [
        ...prevLogs,
        {
          time: new Date().toLocaleTimeString(),
          message,
        },
      ];
      return newLogs.slice(-10);
    });
  }, []);

  const showNotification = useCallback((message, severity) => {
    setError(message);
    setAlertSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      addLog("Cleanup: Closing audio stream");
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      addLog("Cleanup: Stopping recorder");
    }
    if (websocketRef.current) {
      websocketRef.current.close();
      addLog("Cleanup: Closing WebSocket connection");
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      addLog("Cleanup: Closing audio context");
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setReceivedChunkCounter(0);
  }, [addLog]);

  const playAudio = useCallback(
    async (audioBlob) => {
      try {
        setAudioActivity(true);
        addLog(`Preparing to play audio data (size: ${audioBlob.size} bytes)`);

        if (audioBlob.size === 0) {
          addLog("Warning: Received empty audio data");
          setAudioActivity(false);
          return;
        }

        // Create or restore AudioContext
        if (
          !audioContextRef.current ||
          audioContextRef.current.state === "closed"
        ) {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
          addLog("Created new AudioContext");
        }

        // Try to automatically restore audio context
        if (audioContextRef.current.state === "suspended") {
          try {
            await audioContextRef.current.resume();
            addLog("Automatic audio context restoration successful");
          } catch (err) {
            addLog(
              `Automatic audio context restoration failed: ${err.message}`
            );
            showNotification(
              "Please click the page to enable audio playback",
              "info"
            );
          }
        }

        // Play audio directly
        const audio = new Audio();
        const url = URL.createObjectURL(audioBlob);
        audio.src = url;

        // Listen for errors
        audio.onerror = (e) => {
          addLog(`Audio load error: ${e.target.error}`);
          setAudioActivity(false);
          URL.revokeObjectURL(url);

          // If direct playback fails, try using AudioContext to decode
          fallbackAudioPlay(audioBlob);
        };

        // Listen for playback end
        audio.onended = () => {
          setAudioActivity(false);
          URL.revokeObjectURL(url);
          addLog("Audio playback completed");
        };

        // Start playback
        try {
          await audio.play();
          addLog("Starting audio playback");
        } catch (playError) {
          addLog(
            `Direct playback failed, trying fallback: ${playError.message}`
          );
          URL.revokeObjectURL(url);
          await fallbackAudioPlay(audioBlob);
        }

        setReceivedChunkCounter((prev) => prev + 1);
      } catch (err) {
        console.error("Audio playback failed:", err);
        setAudioActivity(false);
        addLog(`Audio playback failed: ${err.message}`);
        showNotification(
          "Audio playback error, trying to restore...",
          "warning"
        );
      }
    },
    [addLog, showNotification]
  );

  // Fallback audio playback method
  const fallbackAudioPlay = async (audioBlob) => {
    try {
      addLog("Using fallback to play audio");

      // Ensure AudioContext is available
      if (
        !audioContextRef.current ||
        audioContextRef.current.state === "closed"
      ) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      // Read audio data
      const arrayBuffer = await audioBlob.arrayBuffer();

      // Try to decode
      try {
        const audioBuffer = await audioContextRef.current.decodeAudioData(
          arrayBuffer
        );
        addLog(
          `Audio decoding successful: ${audioBuffer.duration.toFixed(
            2
          )} seconds`
        );

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);

        source.onended = () => {
          setAudioActivity(false);
          addLog("Fallback playback completed");
        };

        source.start(0);
        addLog("Fallback playback started");
      } catch (decodeError) {
        addLog(`Audio decoding failed: ${decodeError.message}`);
        throw decodeError;
      }
    } catch (error) {
      addLog(`Fallback playback failed: ${error.message}`);
      setAudioActivity(false);
      showNotification("Audio playback failed", "error");
    }
  };

  const handleAudioChunks = async (chunks) => {
    let audioContext = null;
    let offlineContext = null;

    try {
      addLog(`Starting to process audio data chunks: ${chunks.length} chunks`);
      const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
      addLog(`Created Blob: ${blob.size} bytes, type: ${blob.type}`);

      if (blob.size === 0) {
        addLog("Warning: Audio data is empty");
        return;
      }

      const arrayBuffer = await blob.arrayBuffer();
      addLog(`Converted to ArrayBuffer: ${arrayBuffer.byteLength} bytes`);

      // Create new AudioContext
      audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000,
      });

      // Decode audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      addLog(
        `Decoded audio data: Duration ${audioBuffer.duration.toFixed(
          2
        )} seconds, Sample Rate ${audioBuffer.sampleRate}Hz`
      );

      // Resample to 16kHz mono
      offlineContext = new OfflineAudioContext(
        1,
        Math.ceil(audioBuffer.duration * 16000),
        16000
      );
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();

      const resampledBuffer = await offlineContext.startRendering();
      addLog(`Resampling completed: ${resampledBuffer.length} samples`);

      // Convert to 16-bit PCM
      const pcmData = new Float32Array(resampledBuffer.length);
      resampledBuffer.copyFromChannel(pcmData, 0);

      const intData = new Int16Array(pcmData.length);
      const blockSize = 1024;

      for (let offset = 0; offset < pcmData.length; offset += blockSize) {
        const end = Math.min(offset + blockSize, pcmData.length);
        for (let i = offset; i < end; i++) {
          const s = Math.max(-1, Math.min(1, pcmData[i]));
          intData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
      }

      // Use a more efficient Base64 conversion method
      const buffer = intData.buffer;
      const bytes = new Uint8Array(buffer);
      let binary = "";
      const chunkSize = 1024;

      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk);
      }

      const base64Data = btoa(binary);
      addLog(`Converted to Base64: ${base64Data.length} characters`);

      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        const audioMessage = {
          type: "audio",
          room_id: roomId,
          language: language,
          audio_data: base64Data,
          format: "pcm",
          codec: "pcm",
          sample_rate: 16000,
          channels: 1,
          bits_per_sample: 16,
        };

        addLog(
          `Preparing to send audio message: ${JSON.stringify({
            ...audioMessage,
            audio_data: `[${base64Data.length} bytes]`,
          })}`
        );

        websocketRef.current.send(JSON.stringify(audioMessage));
        addLog(`Sent audio data: ${buffer.byteLength} bytes`);
      } else {
        addLog(
          `WebSocket not connected, current status: ${
            websocketRef.current
              ? ["CONNECTING", "OPEN", "CLOSING", "CLOSED"][
                  websocketRef.current.readyState
                ]
              : "Not initialized"
          }`
        );
      }
    } catch (err) {
      addLog(`Audio processing error: ${err.message}\n${err.stack}`);
      console.error("Audio processing error:", err);
    } finally {
      // Clean up resources
      if (audioContext) {
        try {
          await audioContext.close();
        } catch (err) {
          addLog(`Error closing AudioContext: ${err.message}`);
        }
      }
    }
  };

  const startRecording = async () => {
    try {
      addLog("Starting recording initialization...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;
      addLog("Successfully obtained microphone permission");

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 16000,
      });

      mediaRecorderRef.current = mediaRecorder;
      addLog("MediaRecorder initialization successful");

      let audioChunks = [];
      let isCollecting = false;
      let silenceTimeout = null;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
          addLog(`Received audio data chunk: ${event.data.size} bytes`);

          if (!isCollecting) {
            isCollecting = true;
            addLog("Starting to collect audio data");
          }

          // Reset silence timeout
          if (silenceTimeout) {
            clearTimeout(silenceTimeout);
          }

          // Set new silence timeout
          silenceTimeout = setTimeout(() => {
            if (audioChunks.length > 0) {
              addLog(
                `Preparing to process audio data: ${audioChunks.length} chunks`
              );
              handleAudioChunks([...audioChunks]);
              audioChunks = [];
              isCollecting = false;
            }
          }, 500);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      addLog("Starting recording");
      showNotification("Starting recording", "info");
    } catch (err) {
      console.error("Recording error:", err);
      setError("Microphone access failed");
      addLog(`Recording error: ${err.message}`);
      showNotification("Microphone access failed", "error");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      addLog("Stopped recording");
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      addLog("Closed audio stream");
    }
    setIsRecording(false);
    showNotification("Stopped recording", "info");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const connectWebSocket = useCallback(() => {
    if (!roomId) {
      setError("Please enter Room ID");
      setConnectionStatus("error");
      addLog("Error: Room ID not provided");
      return;
    }

    try {
      setConnectionStatus("connecting");
      addLog("Connecting WebSocket...");

      const wsUrl = `wss://ws.url-to-mp3-converter.com/ws/${roomId}?language=${language}`;
      addLog(`Connecting WebSocket: ${wsUrl}`);

      const ws = new WebSocket(wsUrl);
      websocketRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus("connected");
        showNotification("Connected to chat room", "success");
        addLog("WebSocket connection successful");

        // Send join room message
        const joinMessage = {
          type: "join",
          room_id: roomId,
          language: language,
          client_id: Math.random().toString(36).substring(7),
        };
        ws.send(JSON.stringify(joinMessage));
        addLog(`Sent join room message: ${JSON.stringify(joinMessage)}`);
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          addLog(`Received message type: ${data.type}`);

          switch (data.type) {
            case "audio":
              try {
                if (!data.audio_data) {
                  addLog("Warning: Received empty audio data");
                  return;
                }

                // Decode Base64 audio data
                const binaryString = atob(data.audio_data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }

                // Create audio Blob, note here we use mp3 format
                const audioBlob = new Blob([bytes.buffer], {
                  type: "audio/mp3",
                });
                addLog(`Created audio Blob: ${audioBlob.size} bytes`);

                if (audioBlob.size > 0) {
                  await playAudio(audioBlob);
                } else {
                  addLog("Warning: Generated audio Blob is empty");
                }
              } catch (err) {
                addLog(`Audio data processing error: ${err.message}`);
              }
              break;

            case "text":
              setTranslatedText(data.content);
              addLog(`Received translation text: ${data.content}`);
              break;

            case "room_info":
              setRoomMembers(data.members_count);
              addLog(`Room member count updated: ${data.members_count}`);
              break;

            case "error":
              addLog(`Received error message: ${data.message}`);
              showNotification(data.message, "error");
              break;

            default:
              addLog(`Received unknown type message: ${data.type}`);
          }
        } catch (err) {
          addLog(`Error processing message: ${err.message}\n${err.stack}`);
          console.error("Message processing error:", err);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection error");
        setConnectionStatus("error");
        showNotification("Connection error", "error");
        addLog(`WebSocket error: ${error.message || "Unknown error"}`);
      };

      ws.onclose = (event) => {
        setConnectionStatus("disconnected");
        showNotification("Connection closed", "warning");
        addLog(`WebSocket connection closed (code: ${event.code})`);
        setReceivedChunkCounter(0);

        // Try to reconnect
        setTimeout(() => {
          if (event.code !== 1000) {
            addLog("Trying to reconnect...");
            connectWebSocket();
          }
        }, 3000);
      };
    } catch (err) {
      console.error("Connection error:", err);
      setError("Connection error");
      setConnectionStatus("error");
      addLog(`Connection error: ${err.message}\n${err.stack}`);
    }
  }, [roomId, language, showNotification, playAudio, addLog]);

  useEffect(() => {
    if (roomId) {
      connectWebSocket();
    }
    return cleanup;
  }, [connectWebSocket, cleanup, roomId]);

  useEffect(() => {
    // Add user interaction event listener to lift audio playback restriction
    const handleUserInteraction = async () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state === "suspended"
      ) {
        await audioContextRef.current.resume();
        addLog("Lifted audio context restriction through user interaction");
      }
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [addLog]);

  return (
    <Grid container spacing={2} direction="column" alignItems="center">
      <Paper className={classes.root}>
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Room: {roomId || "Please enter Room ID in URL"}
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="body1" gutterBottom>
            Current Language: {language}
          </Typography>
        </Grid>

        <Paper className={classes.statusPaper}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="body2">
                Status: {!roomId ? "Waiting for Room ID" : connectionStatus}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                Current Members: {roomMembers}
              </Typography>
            </Grid>
            <Grid item>
              {connectionStatus === "connecting" && (
                <CircularProgress size={20} />
              )}
            </Grid>
          </Grid>
        </Paper>

        <Grid item>
          <Button
            variant="contained"
            color={isRecording ? "secondary" : "primary"}
            onClick={isRecording ? stopRecording : startRecording}
            className={classes.button}
            disabled={!roomId || connectionStatus !== "connected"}
          >
            {isRecording ? "Stop Speaking" : "Start Speaking"}
          </Button>
        </Grid>

        {audioActivity && (
          <div className={classes.audioStatus}>
            <Typography variant="body2" align="center">
              Receiving audio...
            </Typography>
          </div>
        )}

        {translatedText && (
          <div className={classes.audioStatus}>
            <Typography variant="body2" align="center">
              Translation: {translatedText}
            </Typography>
          </div>
        )}

        {showLogs && (
          <Paper className={classes.statusPaper} style={{ marginTop: "20px" }}>
            <Grid container direction="column" spacing={1}>
              <Grid
                item
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {language === "zh" ? "Sending" : "Receiving"} Logs
                  {receivedChunkCounter > 0 &&
                    language !== "zh" &&
                    ` (Received ${receivedChunkCounter} chunks)`}
                </Typography>
                <Button
                  size="small"
                  onClick={() => setShowLogs(false)}
                  variant="outlined"
                >
                  Hide Logs
                </Button>
              </Grid>
              {audioLogs.map((log, index) => (
                <Grid item key={index}>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "monospace",
                      color: log.message.includes("error")
                        ? "#f44336"
                        : log.message.includes("success")
                        ? "#4caf50"
                        : "inherit",
                    }}
                  >
                    [{log.time}] {log.message}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {!showLogs && (
          <Button
            size="small"
            onClick={() => setShowLogs(true)}
            variant="outlined"
            style={{ marginTop: "20px" }}
          >
            Show Logs
          </Button>
        )}
      </Paper>

      <CustomSnackbar
        ref={snackbarRef}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        severity={alertSeverity}
        message={error}
      />
    </Grid>
  );
};

export default Room;
