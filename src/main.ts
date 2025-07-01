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


// import StreamingAvatar, {
//   AvatarQuality,
//   StreamingEvents,
//   TaskType
// } from "@heygen/streaming-avatar";


// import { OpenAIAssistant } from "./openai-assistant";

// import { AudioRecorder } from './audio-handler';

// let openaiAssistant: OpenAIAssistant | null = null;


// // DOM elements
// const videoElement = document.getElementById("avatarVideo") as HTMLVideoElement;
// const startButton = document.getElementById(
//   "startSession"
// ) as HTMLButtonElement;
// const endButton = document.getElementById("endSession") as HTMLButtonElement;
// const speakButton = document.getElementById("speakButton") as HTMLButtonElement;
// const userInput = document.getElementById("userInput") as HTMLInputElement;

// const recordButton = document.getElementById("recordButton") as HTMLButtonElement;
// const recordingStatus = document.getElementById("recordingStatus") as HTMLParagraphElement;

// const textModeBtn = document.getElementById("textModeBtn") as HTMLButtonElement;
// const voiceModeBtn = document.getElementById("voiceModeBtn") as HTMLButtonElement;
// const textModeControls = document.getElementById("textModeControls") as HTMLElement;
// const voiceModeControls = document.getElementById("voiceModeControls") as HTMLElement;
// const voiceStatus = document.getElementById("voiceStatus") as HTMLElement;

// let avatar: StreamingAvatar | null = null;
// let sessionData: any = null;

// let audioRecorder: AudioRecorder | null = null;
// let isRecording = false;

// let currentMode: "text" | "voice" = "text";

// // Helper function to fetch access token
// async function fetchAccessToken(): Promise<string> {
//   const apiKey = import.meta.env.VITE_HEYGEN_API_KEY;
//   const response = await fetch(
//     "https://api.heygen.com/v1/streaming.create_token",
//     {
//       method: "POST",
//       headers: { "x-api-key": apiKey },
//     }
//   );

//   const { data } = await response.json();
//   return data.token;
// }

// async function speakText(text: string) {
//     if (avatar && text) {
//         await avatar.speak({
//             text: text,
//         });
//     }
// }

// function initializeAudioRecorder() {
//     audioRecorder = new AudioRecorder(
//         (status) => {
//             recordingStatus.textContent = status;
//         },
//         (text) => {
//             speakText(text);
//         }
//     );
// }

// async function toggleRecording() {
//     if (!audioRecorder) {
//         initializeAudioRecorder();
//     }

//     if (!isRecording) {
//         recordButton.textContent = "Stop Recording";
//         await audioRecorder?.startRecording();
//         isRecording = true;
//     } else {
//         recordButton.textContent = "Start Recording";
//         audioRecorder?.stopRecording();
//         isRecording = false;
//     }
// }

// // // Initialize streaming avatar session
// // async function initializeAvatarSession() {
// //   const token = await fetchAccessToken();
// //   avatar = new StreamingAvatar({ token });

// //   avatar.on(StreamingEvents.STREAM_READY, handleStreamReady);
// //   avatar.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected);
  
// //   sessionData = await avatar.createStartAvatar({
// //     quality: AvatarQuality.High,
// //     avatarName: "Wayne_20240711",
// //   });

// //   console.log("Session data:", sessionData);

// //   // Enable end button and disable start button
// //   endButton.disabled = false;
// //   startButton.disabled = true;
// // }
// // Initialize streaming avatar session
// async function initializeAvatarSession() {
//   // Disable start button immediately to prevent double clicks
//   startButton.disabled = true;

//   try {
//     const token = await fetchAccessToken();
//     avatar = new StreamingAvatar({ token });

//     // Initialize OpenAI Assistant
//     const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
//     openaiAssistant = new OpenAIAssistant(openaiApiKey);
//     await openaiAssistant.initialize();
    
//     avatar.on(StreamingEvents.STREAM_READY, handleStreamReady);
//     avatar.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected);
    
//     sessionData = await avatar.createStartAvatar({
//       quality: AvatarQuality.Medium,
//       // avatarName: "Wayne_20240711",
//       avatarName: "Dexter_Doctor_Standing2_public",
//       language: "en",
//       // disableIdleTimeout: true,
//     });

//     // avatar.on(StreamingEvents.USER_START, () => {
//     //   voiceStatus.textContent = "Listening...";
//     // });
//     // avatar.on(StreamingEvents.USER_STOP, () => {
//     //   voiceStatus.textContent = "Processing...";
//     // });
//     // avatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
//     //   voiceStatus.textContent = "Avatar is speaking...";
//     // });
//     // avatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
//     //   voiceStatus.textContent = "Waiting for you to speak...";
//     // });

//     console.log("Session data:", sessionData);

//     // Enable end button
//     endButton.disabled = false;

//   } catch (error) {
//     console.error("Failed to initialize avatar session:", error);
//     // Re-enable start button if initialization fails
//     startButton.disabled = false;
//   }
// }



// // Handle when avatar stream is ready
// function handleStreamReady(event: any) {
//   if (event.detail && videoElement) {
//     videoElement.srcObject = event.detail;
//     videoElement.onloadedmetadata = () => {
//       videoElement.play().catch(console.error);
//     };
//     voiceModeBtn.disabled = false;
//   } else {
//     console.error("Stream is not available");
//   }
// }

// // Handle stream disconnection
// function handleStreamDisconnected() {
//   console.log("Stream disconnected");
//   if (videoElement) {
//     videoElement.srcObject = null;
//   }

//   // Enable start button and disable end button
//   startButton.disabled = false;
//   endButton.disabled = true;
// }

// // End the avatar session
// async function terminateAvatarSession() {
//   if (!avatar || !sessionData) return;

//   await avatar.stopAvatar();
//   videoElement.srcObject = null;
//   avatar = null;
// }

// // Handle speaking event
// // async function handleSpeak() {
// //   if (avatar && userInput.value) {
// //     await avatar.speak({
// //       text: userInput.value,
// //     });
// //     userInput.value = ""; // Clear input after speaking
// //   }
// // }

// // Handle speaking event
// async function handleSpeak() {
//   if (avatar && openaiAssistant && userInput.value) {
//     try {
//       const response = await openaiAssistant.getResponse(userInput.value);
//       await avatar.speak({
//         text: response,
//         taskType: TaskType.REPEAT,
//       });
//     } catch (error) {
//       console.error("Error getting response:", error);
//     }
//     userInput.value = ""; // Clear input after speaking
//   }
// }

// async function startVoiceChat() {
//   if (!avatar) return;
  
//   try {
//     await avatar.startVoiceChat({
//       useSilencePrompt: false
//     });
//     voiceStatus.textContent = "Waiting for you to speak...";
//   } catch (error) {
//     console.error("Error starting voice chat:", error);
//     voiceStatus.textContent = "Error starting voice chat";
//   }
// }

// async function switchMode(mode: "text" | "voice") {
//   if (currentMode === mode) return;
  
//   currentMode = mode;
  
//   if (mode === "text") {
//     textModeBtn.classList.add("active");
//     voiceModeBtn.classList.remove("active");
//     textModeControls.style.display = "block";
//     voiceModeControls.style.display = "none";
//     if (avatar) {
//       await avatar.closeVoiceChat();
//     }
//   } else {
//     textModeBtn.classList.remove("active");
//     voiceModeBtn.classList.add("active");
//     textModeControls.style.display = "none";
//     voiceModeControls.style.display = "block";
//     if (avatar) {
//       await startVoiceChat();
//     }
//   }
// }



// // Event listeners for buttons
// startButton.addEventListener("click", initializeAvatarSession);
// endButton.addEventListener("click", terminateAvatarSession);
// speakButton.addEventListener("click", handleSpeak);
// recordButton.addEventListener("click", toggleRecording);
// textModeBtn.addEventListener("click", () => switchMode("text"));
// voiceModeBtn.addEventListener("click", () => switchMode("voice"));


// src/main.ts
// src/main.ts


// import StreamingAvatar, {
//   AvatarQuality,
//   StreamingEvents,
// } from "@heygen/streaming-avatar";
// import OpenAI from "openai";

// // Initialize OpenAI
// const openai = new OpenAI({ 
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true 
// });

// // Global variables
// let avatar: StreamingAvatar | null = null;
// let sessionData: any = null;
// let mediaRecorder: MediaRecorder | null = null;
// let audioChunks: Blob[] = [];
// let conversationHistory: Array<{role: string, content: string}> = [];

// // DOM elements
// const videoEl = document.getElementById("avatarVideo") as HTMLVideoElement;
// const placeholderEl = document.getElementById("placeholder") as HTMLDivElement;
// const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
// const endBtn = document.getElementById("endBtn") as HTMLButtonElement;
// const textInput = document.getElementById("textInput") as HTMLInputElement;
// const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
// const voiceBtn = document.getElementById("voiceBtn") as HTMLButtonElement;
// const statusEl = document.getElementById("status") as HTMLParagraphElement;
// const responseEl = document.getElementById("responseText") as HTMLDivElement;
// const chatMessagesEl = document.getElementById("chatMessages") as HTMLDivElement;

// // Get HeyGen access token
// async function getAccessToken(): Promise<string> {
//   const apiKey = import.meta.env.VITE_HEYGEN_API_KEY;
//   const response = await fetch(
//     "https://api.heygen.com/v1/streaming.create_token",
//     {
//       method: "POST",
//       headers: { "x-api-key": apiKey },
//     }
//   );
//   const { data } = await response.json();
//   return data.token;
// }

// // Get AI response
// async function getAIResponse(message: string): Promise<string> {
//   try {
//     // Build messages array with conversation history
//     const messages = [
//       {
//         role: "system",
//         content: "You are a helpful medical AI assistant. Keep responses concise and friendly. Ask follow-up questions when needed."
//       },
//       ...conversationHistory,
//       {
//         role: "user",
//         content: message
//       }
//     ];
    
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: messages,
//       max_tokens: 150
//     });
    
//     return completion.choices[0].message.content || "I couldn't generate a response.";
//   } catch (error) {
//     console.error("OpenAI error:", error);
//     return "Sorry, I encountered an error processing your request.";
//   }
// }

// // Add message to chat history UI
// function addMessageToUI(role: string, content: string) {
//   const messageDiv = document.createElement("div");
//   messageDiv.className = `message ${role}`;
//   messageDiv.textContent = content;
//   chatMessagesEl.appendChild(messageDiv);
  
//   // Scroll to bottom
//   chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
// }

// // Start avatar session
// async function startSession() {
//   try {
//     statusEl.textContent = "Starting session...";
//     startBtn.disabled = true;
    
//     // Get token and create avatar
//     const token = await getAccessToken();
//     avatar = new StreamingAvatar({ token });
    
//     // Set up event listeners
//     avatar.on(StreamingEvents.STREAM_READY, (event) => {
//       console.log("Stream ready");
//       if (event.detail) {
//         videoEl.srcObject = event.detail;
//         videoEl.style.display = "block";
//         placeholderEl.style.display = "none";
//         videoEl.play();
//       }
//     });
    
//     avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
//       console.log("Stream disconnected");
//       endSession();
//     });
    
//     // Create and start avatar
//     sessionData = await avatar.createStartAvatar({
//       quality: AvatarQuality.Medium,
//       avatarName: "Dexter_Doctor_Standing2_public",
//     });
    
//     console.log("Session started:", sessionData);
    
//     // Enable controls
//     endBtn.disabled = false;
//     textInput.disabled = false;
//     sendBtn.disabled = false;
//     voiceBtn.disabled = false;
    
//     statusEl.textContent = "Session active";
//     responseEl.textContent = "Hello! How can I help you today?";
    
//     // Clear chat history for new session
//     conversationHistory = [];
//     chatMessagesEl.innerHTML = "";
    
//     // Add greeting to chat
//     addMessageToUI("system", "Hello! I'm your AI assistant. How can I help you today?");
    
//     // Make avatar say greeting
//     await avatar.speak({
//       text: "Hello! I'm your AI assistant. How can I help you today?",
//     });
    
//   } catch (error) {
//     console.error("Failed to start session:", error);
//     statusEl.textContent = "Failed to start session";
//     startBtn.disabled = false;
//   }
// }

// // End avatar session
// async function endSession() {
//   if (avatar) {
//     await avatar.stopAvatar();
//     avatar = null;
//   }
  
//   // Reset UI
//   videoEl.srcObject = null;
//   videoEl.style.display = "none";
//   placeholderEl.style.display = "block";
  
//   startBtn.disabled = false;
//   endBtn.disabled = true;
//   textInput.disabled = true;
//   sendBtn.disabled = true;
//   voiceBtn.disabled = true;
  
//   statusEl.textContent = "Session ended";
//   responseEl.textContent = "Session ended. Click 'Start Session' to begin again.";
// }

// // Handle text input
// async function handleTextInput() {
//   const message = textInput.value.trim();
//   if (!message || !avatar) return;
  
//   textInput.value = "";
//   statusEl.textContent = "Processing...";
  
//   // Add user message to UI and history
//   addMessageToUI("user", message);
//   conversationHistory.push({role: "user", content: message});
  
//   try {
//     // Get AI response
//     const aiResponse = await getAIResponse(message);
    
//     // Add system response to UI and history
//     addMessageToUI("system", aiResponse);
//     conversationHistory.push({role: "assistant", content: aiResponse});
    
//     // Display current response
//     responseEl.textContent = aiResponse;
    
//     // Make avatar speak
//     await avatar.speak({ text: aiResponse });
    
//     statusEl.textContent = "";
//   } catch (error) {
//     console.error("Error:", error);
//     statusEl.textContent = "Error processing message";
//   }
// }

// // Voice recording functions
// async function startRecording() {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorder = new MediaRecorder(stream);
//     audioChunks = [];
    
//     mediaRecorder.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         audioChunks.push(event.data);
//       }
//     };
    
//     mediaRecorder.onstop = async () => {
//       const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
//       await transcribeAudio(audioBlob);
      
//       // Stop the stream
//       stream.getTracks().forEach(track => track.stop());
//     };
    
//     mediaRecorder.start();
//     voiceBtn.textContent = "🔴 Stop Recording";
//     statusEl.textContent = "Recording...";
//     statusEl.classList.add("recording");
    
//   } catch (error) {
//     console.error("Error starting recording:", error);
//     statusEl.textContent = "Error accessing microphone";
//   }
// }

// function stopRecording() {
//   if (mediaRecorder && mediaRecorder.state !== "inactive") {
//     mediaRecorder.stop();
//     voiceBtn.textContent = "🎤 Start Recording";
//     statusEl.textContent = "Processing audio...";
//     statusEl.classList.remove("recording");
//   }
// }

// async function transcribeAudio(audioBlob: Blob) {
//   try {
//     const formData = new FormData();
//     formData.append('file', audioBlob, 'audio.webm');
//     formData.append('model', 'whisper-1');
    
//     const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
//       },
//       body: formData
//     });
    
//     const data = await response.json();
    
//     if (data.text) {
//       // Put transcribed text in input field
//       textInput.value = data.text;
//       statusEl.textContent = "Transcription complete";
      
//       // Automatically send the message
//       await handleTextInput();
//     }
    
//   } catch (error) {
//     console.error("Error transcribing:", error);
//     statusEl.textContent = "Error transcribing audio";
//   }
// }

// // Event listeners
// startBtn.addEventListener("click", startSession);
// endBtn.addEventListener("click", endSession);
// sendBtn.addEventListener("click", handleTextInput);

// // Enter key to send
// textInput.addEventListener("keypress", (e) => {
//   if (e.key === "Enter") {
//     handleTextInput();
//   }
// });

// // Voice button toggle
// voiceBtn.addEventListener("click", () => {
//   if (mediaRecorder && mediaRecorder.state === "recording") {
//     stopRecording();
//   } else {
//     startRecording();
//   }
// });

// src/main.ts
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from "@heygen/streaming-avatar";
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

// Types
interface ChatSession {
  id: string;
  title: string;
  messages: Array<{role: string, content: string}>;
  date: Date;
}

// Global variables
let avatar: StreamingAvatar | null = null;
let sessionData: any = null;
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let currentSession: ChatSession | null = null;
let chatSessions: ChatSession[] = [];

// DOM elements
const videoEl = document.getElementById("avatarVideo") as HTMLVideoElement;
const placeholderEl = document.getElementById("avatarPlaceholder") as HTMLDivElement;
const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
const endBtn = document.getElementById("endBtn") as HTMLButtonElement;
const textInput = document.getElementById("textInput") as HTMLTextAreaElement;
const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
const voiceBtn = document.getElementById("voiceBtn") as HTMLButtonElement;
const imageBtn = document.getElementById("imageBtn") as HTMLButtonElement;
const imageUpload = document.getElementById("imageUpload") as HTMLInputElement;
const statusEl = document.getElementById("status") as HTMLDivElement;
const chatMessagesEl = document.getElementById("chatMessages") as HTMLDivElement;
const newChatBtn = document.getElementById("newChatBtn") as HTMLButtonElement;
const chatHistoryList = document.getElementById("chatHistoryList") as HTMLDivElement;

// Initialize
loadChatSessions();

// Get HeyGen access token
async function getAccessToken(): Promise<string> {
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

// Get AI response
async function getAIResponse(message: string): Promise<string> {
  try {
    const testKitList = [
      {
          "category": "Respiratory Infections",
          "products": [
              {"name": "Allplex™ Respiratory Panel Assays", "targets": "26 pathogens (16 viruses, 3 Flu A subtypes, 7 bacteria)"},
              {"name": "Allplex™ SARS-CoV-2/FluA/FluB/RSV Assay", "targets": "SARS-CoV-2, Flu A/B, RSV"},
              {"name": "Allplex™ RV Master Assay", "targets": "Respiratory viruses"},
              {"name": "Allplex™ PneumoBacter Assay", "targets": "Pneumonia-causing bacteria"}
          ]
      },
      {
          "category": "Gastrointestinal Infections",
          "products": [
              {"name": "Allplex™ Gastrointestinal Panel Assays", "targets": "25 pathogens (6 viruses, 13 bacteria, 6 parasites)"},
              {"name": "Allplex™ GI-Virus Assay", "targets": "Gastrointestinal viruses"},
              {"name": "Allplex™ GI-Bacteria (I) Assay", "targets": "Gastrointestinal bacteria panel 1"},
              {"name": "Allplex™ H. pylori & ClariR Assay", "targets": "H. pylori and clarithromycin resistance"}
          ]
      },
      {
          "category": "Sexually Transmitted Infections",
          "products": [
              {"name": "Allplex™ STI Essential Assay", "targets": "7 major pathogens (CT, NG, MG, TV, MH, UU, UP)"},
              {"name": "Allplex™ CT/NG/MG/TV Assay", "targets": "CT, NG, MG, TV"},
              {"name": "Allplex™ Genital ulcer Assay", "targets": "Genital ulcer pathogens"}
          ]
      },
      {
          "category": "COVID-19",
          "products": [
              {"name": "Allplex™ SARS-CoV-2 fast PCR Assay", "targets": "SARS-CoV-2"},
              {"name": "Allplex™ 2019-nCoV Assay", "targets": "3 target genes (E, RdRP, N genes)"}
          ]
      }
    ];

    const testKitText = testKitList.map(kit => {
      const products = kit.products.map(p => `• **${p.name}** – ${p.targets}`).join('\n');
      return `**${kit.category}**\n${products}`;
    }).join('\n\n');

    const examples = `
    Example 1: Respiratory Infection (LONGER - 5 exchanges)
    User: "I've been feeling unwell for 4 days"
    Bot: "I'm sorry to hear you're not feeling well. Could you describe your main symptoms?"
    User: "Runny nose, sore throat, dry cough"
    <thinking>
    - Symptoms identified: [runny nose, sore throat, dry cough]
    - Possible categories: [Respiratory Infections, COVID-19]
    - Confidence level: 60
    - Next action: ask about fever
    </thinking>
    <response>
    Those sound like respiratory symptoms. Have you had any fever, and if so, how high?
    </response>
    User: "Yes, around 101°F for two days"
    <thinking>
    - Symptoms identified: [runny nose, sore throat, dry cough, fever 101°F, 4 days duration]
    - Possible categories: [Respiratory Infections]
    - Confidence level: 85
    - Next action: make recommendation
    </thinking>
    <response>
    Based on your respiratory symptoms with fever lasting 4 days, I recommend the **Allplex™ Respiratory Panel Assay** to test for multiple respiratory pathogens.
    </response>

    Example 2: Gastrointestinal (DETAILED - 4 exchanges)
    User: "I've been vomiting and had diarrhea all night"
    Bot: "I'm sorry you're feeling so unwell. When did these symptoms start?"
    User: "About 8 hours ago after eating seafood at a restaurant"
    <thinking>
    - Symptoms identified: [vomiting, diarrhea, 8 hours duration, seafood consumption]
    - Possible categories: [Gastrointestinal Infections]
    - Confidence level: 80
    - Next action: ask about severity/fever
    </thinking>
    <response>
    That timing suggests possible food poisoning from the seafood. Are you having any fever or severe abdominal cramping?
    </response>
    User: "Yes, bad cramping and I think I have a fever"
    <thinking>
    - Symptoms identified: [vomiting, diarrhea, abdominal cramps, fever, seafood-related]
    - Possible categories: [Gastrointestinal Infections]
    - Confidence level: 90
    - Next action: make recommendation
    </thinking>
    <response>
    This sounds like a bacterial gastrointestinal infection from contaminated seafood. I recommend the **Allplex™ GI-Bacteria Assay** to identify foodborne pathogens.
    </response>

    Example 3: STI/Sensitive Symptoms (EMPATHETIC - 5 exchanges)
    User: "I have some uncomfortable symptoms down there"
    <thinking>
    - Symptoms identified: [genital/urinary symptoms - unspecified]
    - Possible categories: [STI, Vaginitis, UTI]
    - Confidence level: 30
    - Next action: ask gently for specific symptoms
    </thinking>
    <response>
    I understand these symptoms can be concerning. To help recommend the right test, are you experiencing burning during urination, unusual discharge, or itching?
    </response>
    User: "Burning when I urinate and some discharge"
    <thinking>
    - Symptoms identified: [burning urination, discharge]
    - Possible categories: [STI, UTI]
    - Confidence level: 60
    - Next action: ask about duration
    </thinking>
    <response>
    Thank you for sharing that. How long have you been experiencing these symptoms?
    </response>
    User: "About 5 days now"
    <thinking>
    - Symptoms identified: [burning urination, discharge, 5 days duration]
    - Possible categories: [STI]
    - Confidence level: 75
    - Next action: make recommendation
    </thinking>
    <response>
    Based on your symptoms lasting 5 days, this may indicate a sexually transmitted infection. I recommend the **Allplex™ STI Essential Assay** which tests for 7 major STI pathogens.
    </response>

    Example 4: Vague Symptoms (CLARIFICATION - 4 exchanges)
    User: "I don't feel well"
    <thinking>
    - Symptoms identified: [general malaise]
    - Possible categories: [unclear]
    - Confidence level: 10
    - Next action: ask for specific symptoms
    </thinking>
    <response>
    I'm sorry to hear you're not feeling well. Could you describe your specific symptoms - do you have fever, cough, stomach issues, or other concerns?
    </response>
    User: "Just tired and my body aches"
    <thinking>
    - Symptoms identified: [fatigue, body aches]
    - Possible categories: [viral infection, multiple possibilities]
    - Confidence level: 25
    - Next action: ask about fever and other symptoms
    </thinking>
    <response>
    Fatigue and body aches can have several causes. Do you have any fever, and have you noticed symptoms like sore throat or cough?
    </response>
    User: "Actually yes, slight fever and scratchy throat"
    <thinking>
    - Symptoms identified: [fatigue, body aches, fever, sore throat]
    - Possible categories: [Respiratory Infections]
    - Confidence level: 80
    - Next action: make recommendation
    </thinking>
    <response>
    Those symptoms together suggest a respiratory infection. I recommend the **Allplex™ Respiratory Panel Assay** to identify the specific pathogen.
    </response>
    `;

    const instructions = `
    You are Dr. Joi, an empathetic medical AI assistant. Keep responses concise (2-3 sentences max), conversational, and helpful. Ask follow-up questions when needed.
    - Ask questions to understand user symptoms.
    - Gradually build diagnostic confidence.
    - Recommend test kits ONLY when confidence is 70% or more.
    - Be concise, friendly, and ask one question at a time.
    - For vague symptoms, clarify before suggesting tests.
    - Format your thinking inside <thinking>...</thinking> and user response inside <response>...</response>.
    Always sound kind and concise. Be especially sensitive to STI-related topics.

    Test Kit Catalog:
    ${testKitText}

    ${examples}

    Begin the conversation below:
    `;

    const messages = [
      {
        role: "system",
        // content: "You are Dr. Joi, an empathetic medical AI assistant. Keep responses concise (2-3 sentences max), conversational, and helpful. Ask follow-up questions when needed."
        content: instructions
      }
    ];

    // Add current session messages
    if (currentSession) {
      messages.push(...currentSession.messages);
    }

    messages.push({ role: "user", content: message });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      // max_tokens: 150
      max_tokens: 300,
    });
    
    return completion.choices[0].message.content || "I couldn't generate a response.";
  } catch (error) {
    console.error("OpenAI error:", error);
    return "Sorry, I encountered an error processing your request.";
  }
}

// Chat session management
function createNewChatSession(): ChatSession {
  return {
    id: Date.now().toString(),
    title: "New Consultation",
    messages: [],
    date: new Date()
  };
}

function loadChatSessions() {
  const saved = localStorage.getItem('chatSessions');
  if (saved) {
    chatSessions = JSON.parse(saved);
    updateChatHistoryUI();
  }
}

function saveChatSessions() {
  localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
}

function updateChatHistoryUI() {
  // This is a simple implementation - you can enhance it
  // For now, we'll just show the current session
}

// Add message to UI
function addMessageToUI(role: string, content: string) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${role}`;
  
  const avatarDiv = document.createElement("div");
  avatarDiv.className = "message-avatar";
  avatarDiv.textContent = role === "user" ? "U" : "AI";
  
  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";
  
  const headerDiv = document.createElement("div");
  headerDiv.className = "message-header";
  headerDiv.textContent = role === "user" ? "You" : "Dr. Joi";
  
  const textDiv = document.createElement("div");
  textDiv.className = "message-text";
  textDiv.textContent = content;
  
  contentDiv.appendChild(headerDiv);
  contentDiv.appendChild(textDiv);
  
  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(contentDiv);
  
  chatMessagesEl.appendChild(messageDiv);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// Show/hide status
function showStatus(message: string) {
  statusEl.textContent = message;
  statusEl.classList.add("show");
}

function hideStatus() {
  statusEl.classList.remove("show");
}

// Auto-resize textarea
function autoResizeTextarea() {
  textInput.style.height = 'auto';
  textInput.style.height = Math.min(textInput.scrollHeight, 120) + 'px';
}

// Start avatar session
async function startSession() {
  try {
    showStatus("Starting session...");
    startBtn.disabled = true;
    
    const token = await getAccessToken();
    avatar = new StreamingAvatar({ token });
    
    avatar.on(StreamingEvents.STREAM_READY, (event) => {
      console.log("Stream ready");
      if (event.detail) {
        videoEl.srcObject = event.detail;
        videoEl.style.display = "block";
        placeholderEl.style.display = "none";
        videoEl.play();
      }
    });
    
    avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      endSession();
    });
    
    sessionData = await avatar.createStartAvatar({
      quality: AvatarQuality.Medium,
      avatarName: "Dexter_Doctor_Standing2_public",
    });
    
    console.log("Session started:", sessionData);
    
    // Create new chat session
    currentSession = createNewChatSession();
    chatSessions.push(currentSession);
    
    // Enable controls
    endBtn.disabled = false;
    textInput.disabled = false;
    sendBtn.disabled = false;
    voiceBtn.disabled = false;
    imageBtn.disabled = false;
    
    hideStatus();
    
    // Clear chat and add greeting
    chatMessagesEl.innerHTML = "";
    const greeting = "Hello! I'm Dr. Joi. How can I help you today?";
    addMessageToUI("system", greeting);
    
    // Make avatar speak
    await avatar.speak({ text: greeting });
    
  } catch (error) {
    console.error("Failed to start session:", error);
    showStatus("Failed to start session");
    startBtn.disabled = false;
  }
}

// End avatar session
async function endSession() {
  if (avatar) {
    await avatar.stopAvatar();
    avatar = null;
  }
  
  // Save current session
  if (currentSession) {
    saveChatSessions();
  }
  
  // Reset UI
  videoEl.srcObject = null;
  videoEl.style.display = "none";
  placeholderEl.style.display = "block";
  
  startBtn.disabled = false;
  endBtn.disabled = true;
  textInput.disabled = true;
  sendBtn.disabled = true;
  voiceBtn.disabled = true;
  imageBtn.disabled = true;
  
  showStatus("Session ended");
  setTimeout(hideStatus, 3000);
}

// Handle text input
async function handleTextInput() {
  const message = textInput.value.trim();
  if (!message || !avatar || !currentSession) return;
  
  textInput.value = "";
  autoResizeTextarea();
  showStatus("Processing...");
  
  // Add user message
  addMessageToUI("user", message);
  currentSession.messages.push({role: "user", content: message});
  
  try {
    // Get AI response
    const aiResponse = await getAIResponse(message);
    
    // Add AI response
    addMessageToUI("system", aiResponse);
    currentSession.messages.push({role: "assistant", content: aiResponse});
    
    // Update session title if it's the first real message
    if (currentSession.messages.length === 2) {
      currentSession.title = message.substring(0, 30) + (message.length > 30 ? "..." : "");
      saveChatSessions();
    }
    
    // Make avatar speak
    await avatar.speak({ text: aiResponse, taskType: TaskType.REPEAT });
    
    hideStatus();
  } catch (error) {
    console.error("Error:", error);
    showStatus("Error processing message");
    setTimeout(hideStatus, 3000);
  }
}

// Voice recording functions
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      await transcribeAudio(audioBlob);
      stream.getTracks().forEach(track => track.stop());
    };
    
    mediaRecorder.start();
    voiceBtn.classList.add("recording");
    showStatus("Recording... Click again to stop");
    
  } catch (error) {
    console.error("Error starting recording:", error);
    showStatus("Error accessing microphone");
    setTimeout(hideStatus, 3000);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    voiceBtn.classList.remove("recording");
    showStatus("Processing audio...");
  }
}

async function transcribeAudio(audioBlob: Blob) {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (data.text) {
      textInput.value = data.text;
      autoResizeTextarea();
      hideStatus();
      await handleTextInput();
    }
    
  } catch (error) {
    console.error("Error transcribing:", error);
    showStatus("Error transcribing audio");
    setTimeout(hideStatus, 3000);
  }
}

// Handle image upload
async function handleImageUpload(file: File) {
  showStatus("Analyzing image...");
  
  try {
    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      
      // For now, just add a message saying image was uploaded
      // In production, you'd send this to your backend for analysis
      const message = "I've uploaded a medical image for analysis";
      textInput.value = message;
      await handleTextInput();
    };
    reader.readAsDataURL(file);
    
  } catch (error) {
    console.error("Error processing image:", error);
    showStatus("Error processing image");
    setTimeout(hideStatus, 3000);
  }
}

// Event listeners
startBtn.addEventListener("click", startSession);
endBtn.addEventListener("click", endSession);
sendBtn.addEventListener("click", handleTextInput);

// New chat button
newChatBtn.addEventListener("click", () => {
  if (currentSession && currentSession.messages.length > 0) {
    saveChatSessions();
  }
  chatMessagesEl.innerHTML = "";
  currentSession = createNewChatSession();
  chatSessions.push(currentSession);
  
  if (avatar) {
    const greeting = "Starting a new consultation. How can I help you?";
    addMessageToUI("system", greeting);
    avatar.speak({ text: greeting });
  }
});

// Text input handling
textInput.addEventListener("input", autoResizeTextarea);
textInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleTextInput();
  }
});

// Voice button
voiceBtn.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    stopRecording();
  } else {
    startRecording();
  }
});

// Image button
imageBtn.addEventListener("click", () => {
  imageUpload.click();
});

imageUpload.addEventListener("change", (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    handleImageUpload(file);
  }
});