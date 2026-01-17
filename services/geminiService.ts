import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Attachment, QuizQuestion } from "../types";

// The persona and constraints defined by the user
const SYSTEM_INSTRUCTION = `
# Role
You are a Lead Research Analyst specializing in multimodal information extraction. Your goal is to provide rigorous, evidence-based analysis of the uploaded files (Video, PDF, or Audio).

# Core Constraints
1. **Source Grounding:** You must NEVER answer from your general knowledge. Every statement must be derived directly from the uploaded content.
2. **Citation Protocol:**
   - For Video/Audio: Every claim must end with a timestamp in [MM:SS] format.
   - For PDFs/Documents: Every claim must end with a page reference [Page X].
3. **Negative Constraint:** If the answer is not explicitly contained in the provided media, respond with: "I'm sorry, the provided source material does not contain information regarding [Subject]." Do not hallucinate or infer.

# Language Protocol
1. **Auto-Detection:** Identify the primary and secondary languages used in the uploaded media.
2. **Output Language:** ALWAYS respond in the same language used by the user in their prompt, unless they explicitly ask for a translation.
3. **Multilingual Synthesis:** If a user asks a question in English about a video recorded in Hindi, provide the answer in English but quote the original Hindi terms where relevant for accuracy.

# Modality Intelligence (Adaptive Handling)
- **TEXT/PDF:** Act as a document parser. Extract structured data, logic, and intent. Provide page citations [Page X].
- **AUDIO/VIDEO:** Act as a transcription and visual analyst. Link audio cues to visual events. Provide timestamp citations [MM:SS].
- **CODE:** Act as a senior developer. Analyze logic, security, and performance.

# Workspace / Scratchpad
You have access to a persistent "Workspace" on the user's screen. 
- When you identify a **critical fact, figure, or key finding** that should be saved for quick reference, output it on a new line using this exact format:
  \`:::WORKSPACE_SAVE: [Fact content with citation]\`
- This line will be extracted and moved to the user's workspace automatically. It will NOT appear in the main chat bubble.
- Use this sparingly for high-value data points.
- You can still discuss the point in your main narrative. The tag is specifically for saving a copy to the notes.

# Response Schema
For every query, structure your response as follows:
- **Executive Summary:** A 2-3 sentence high-level overview.
- **Key Findings:** Use a bulleted list for detailed points.
- **Cross-Reference:** Mention if the same concept appears in multiple places within the file.

# Tone and Style
- Maintain a neutral, academic, and objective tone.
- Use professional terminology appropriate for the subject matter.
- Prioritize density and accuracy over brevity.
`;

// Initialize the API client
const apiKey = process.env.API_KEY;
// Using gemini-3-pro-preview for best multimodal reasoning capabilities
const MODEL_NAME = 'gemini-3-pro-preview'; 

let chatSession: Chat | null = null;
let currentFile: Attachment | null = null;

const ai = new GoogleGenAI({ apiKey });

export const resetSession = () => {
  chatSession = null;
  currentFile = null;
};

export const initializeChat = (file: Attachment | null) => {
  currentFile = file;
  chatSession = ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.2, // Low temperature for factual, analytical responses
    },
  });
};

export const sendMessageStream = async (
  messageText: string,
  onChunk: (text: string) => void
): Promise<string> => {
  if (!chatSession) {
    initializeChat(null);
  }

  const parts: any[] = [];

  // If this is the first message about a file, we need to attach it inline
  const history = await chatSession!.getHistory();
  
  if (history.length === 0 && currentFile) {
    parts.push({
      inlineData: {
        mimeType: currentFile.mimeType,
        data: currentFile.data,
      },
    });
  }

  parts.push({ text: messageText });

  try {
    const responseStream = await chatSession!.sendMessageStream({
      message: {
        role: 'user',
        parts: parts
      } 
    });

    let fullText = "";
    
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateQuiz = async (file: Attachment): Promise<QuizQuestion[]> => {
  if (!file) throw new Error("No file provided for quiz generation");

  const prompt = `Generate a rigorous 20-question multiple-choice quiz based on the provided content. 
  Focus on testing the user's understanding of key facts, figures, and concepts presented in the material.
  Return ONLY the JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.mimeType,
              data: file.data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Exactly 4 options" 
              },
              correctAnswerIndex: { 
                type: Type.INTEGER, 
                description: "The index (0-3) of the correct option" 
              }
            },
            required: ["question", "options", "correctAnswerIndex"]
          }
        },
        temperature: 0.5
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    throw new Error("Empty response from model");
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    throw error;
  }
};