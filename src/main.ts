// import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType
} from "@heygen/streaming-avatar";


import { OpenAIAssistant } from "./openai-assistant";

import { AudioRecorder } from './audio-handler';

let openaiAssistant: OpenAIAssistant | null = null;


// DOM elements
const videoElement = document.getElementById("avatarVideo") as HTMLVideoElement;
const startButton = document.getElementById(
  "startSession"
) as HTMLButtonElement;
const endButton = document.getElementById("endSession") as HTMLButtonElement;
const speakButton = document.getElementById("speakButton") as HTMLButtonElement;
const userInput = document.getElementById("userInput") as HTMLInputElement;

const recordButton = document.getElementById("recordButton") as HTMLButtonElement;
const recordingStatus = document.getElementById("recordingStatus") as HTMLParagraphElement;

const textModeBtn = document.getElementById("textModeBtn") as HTMLButtonElement;
const voiceModeBtn = document.getElementById("voiceModeBtn") as HTMLButtonElement;
const textModeControls = document.getElementById("textModeControls") as HTMLElement;
const voiceModeControls = document.getElementById("voiceModeControls") as HTMLElement;
const voiceStatus = document.getElementById("voiceStatus") as HTMLElement;

let avatar: StreamingAvatar | null = null;
let sessionData: any = null;

let audioRecorder: AudioRecorder | null = null;
let isRecording = false;

let currentMode: "text" | "voice" = "text";

// Helper function to fetch access token
async function fetchAccessToken(): Promise<string> {
  const apiKey = import.meta.env.VITE_HEYGEN_API_KEY;
  const response = await fetch(
    "https://api.heygen.com/v1/streaming.create_token",
    {
      method: "POST",
      headers: { "x-api-key": apiKey },
    }
  );

  const { data } = await response.json();
  return data.token;
}

async function speakText(text: string) {
    if (avatar && text) {
        await avatar.speak({
            text: text,
        });
    }
}

function initializeAudioRecorder() {
    audioRecorder = new AudioRecorder(
        (status) => {
            recordingStatus.textContent = status;
        },
        (text) => {
            speakText(text);
        }
    );
}

async function toggleRecording() {
    if (!audioRecorder) {
        initializeAudioRecorder();
    }

    if (!isRecording) {
        recordButton.textContent = "Stop Recording";
        await audioRecorder?.startRecording();
        isRecording = true;
    } else {
        recordButton.textContent = "Start Recording";
        audioRecorder?.stopRecording();
        isRecording = false;
    }
}

// // Initialize streaming avatar session
// async function initializeAvatarSession() {
//   const token = await fetchAccessToken();
//   avatar = new StreamingAvatar({ token });

//   avatar.on(StreamingEvents.STREAM_READY, handleStreamReady);
//   avatar.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected);
  
//   sessionData = await avatar.createStartAvatar({
//     quality: AvatarQuality.High,
//     avatarName: "Wayne_20240711",
//   });

//   console.log("Session data:", sessionData);

//   // Enable end button and disable start button
//   endButton.disabled = false;
//   startButton.disabled = true;
// }
// Initialize streaming avatar session
async function initializeAvatarSession() {
  // Disable start button immediately to prevent double clicks
  startButton.disabled = true;

  try {
    const token = await fetchAccessToken();
    avatar = new StreamingAvatar({ token });

    // Initialize OpenAI Assistant
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    openaiAssistant = new OpenAIAssistant(openaiApiKey);
    await openaiAssistant.initialize();
    
    avatar.on(StreamingEvents.STREAM_READY, handleStreamReady);
    avatar.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected);
    
    sessionData = await avatar.createStartAvatar({
      quality: AvatarQuality.Medium,
      // avatarName: "Wayne_20240711",
      avatarName: "Dexter_Doctor_Standing2_public",
      language: "en",
      // disableIdleTimeout: true,
    });

    // avatar.on(StreamingEvents.USER_START, () => {
    //   voiceStatus.textContent = "Listening...";
    // });
    // avatar.on(StreamingEvents.USER_STOP, () => {
    //   voiceStatus.textContent = "Processing...";
    // });
    // avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
    //   voiceStatus.textContent = "Avatar is speaking...";
    // });
    // avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
    //   voiceStatus.textContent = "Waiting for you to speak...";
    // });

    console.log("Session data:", sessionData);

    // Enable end button
    endButton.disabled = false;

  } catch (error) {
    console.error("Failed to initialize avatar session:", error);
    // Re-enable start button if initialization fails
    startButton.disabled = false;
  }
}



// Handle when avatar stream is ready
function handleStreamReady(event: any) {
  if (event.detail && videoElement) {
    videoElement.srcObject = event.detail;
    videoElement.onloadedmetadata = () => {
      videoElement.play().catch(console.error);
    };
    voiceModeBtn.disabled = false;
  } else {
    console.error("Stream is not available");
  }
}

// Handle stream disconnection
function handleStreamDisconnected() {
  console.log("Stream disconnected");
  if (videoElement) {
    videoElement.srcObject = null;
  }

  // Enable start button and disable end button
  startButton.disabled = false;
  endButton.disabled = true;
}

// End the avatar session
async function terminateAvatarSession() {
  if (!avatar || !sessionData) return;

  await avatar.stopAvatar();
  videoElement.srcObject = null;
  avatar = null;
}

// Handle speaking event
// async function handleSpeak() {
//   if (avatar && userInput.value) {
//     await avatar.speak({
//       text: userInput.value,
//     });
//     userInput.value = ""; // Clear input after speaking
//   }
// }

// Handle speaking event
async function handleSpeak() {
  if (avatar && openaiAssistant && userInput.value) {
    try {
      const response = await openaiAssistant.getResponse(userInput.value);
      await avatar.speak({
        text: response,
        taskType: TaskType.REPEAT,
      });
    } catch (error) {
      console.error("Error getting response:", error);
    }
    userInput.value = ""; // Clear input after speaking
  }
}

async function startVoiceChat() {
  if (!avatar) return;
  
  try {
    await avatar.startVoiceChat({
      useSilencePrompt: false
    });
    voiceStatus.textContent = "Waiting for you to speak...";
  } catch (error) {
    console.error("Error starting voice chat:", error);
    voiceStatus.textContent = "Error starting voice chat";
  }
}

async function switchMode(mode: "text" | "voice") {
  if (currentMode === mode) return;
  
  currentMode = mode;
  
  if (mode === "text") {
    textModeBtn.classList.add("active");
    voiceModeBtn.classList.remove("active");
    textModeControls.style.display = "block";
    voiceModeControls.style.display = "none";
    if (avatar) {
      await avatar.closeVoiceChat();
    }
  } else {
    textModeBtn.classList.remove("active");
    voiceModeBtn.classList.add("active");
    textModeControls.style.display = "none";
    voiceModeControls.style.display = "block";
    if (avatar) {
      await startVoiceChat();
    }
  }
}



// Event listeners for buttons
startButton.addEventListener("click", initializeAvatarSession);
endButton.addEventListener("click", terminateAvatarSession);
speakButton.addEventListener("click", handleSpeak);
recordButton.addEventListener("click", toggleRecording);
textModeBtn.addEventListener("click", () => switchMode("text"));
voiceModeBtn.addEventListener("click", () => switchMode("voice"));