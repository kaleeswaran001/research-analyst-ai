# Lead Research Analyst AI

Lead Research Analyst AI is a premium, AI-powered research assistant designed for deep multimodal analysis. It enables researchers, students, and professionals to extract insights from complex documents, videos, and audio files with academic rigor and absolute accuracy.

## ✨ Key Features

*   **Multimodal Intelligence**: Seamlessly analyze PDFs, Documents, Videos, and Audio files in a single interface.
*   **Strict Source Grounding**: The AI is constrained to provide answers *only* from the uploaded material, eliminating hallucinations.
*   **Automated Citation Protocol**: Every claim includes precise citations—[MM:SS] for media and [Page X] for documents.
*   **Dynamic Workspace**: A persistent sidebar that automatically captures key findings identified by the AI during analysis for quick reference.
*   **Academic Quiz Generator**: Instantly generate rigorous 20-question multiple-choice quizzes based on your source material to test comprehension.
*   **Real-time Streaming**: Experience lightning-fast responses with a modern streaming interface.
*   **Premium Aesthetic**: A clean, responsive design built with Tailwind CSS, featuring smooth animations and a focus on readability.

## 🚀 Tech Stack

*   **Framework**: [React 19](https://react.dev/) (Vite)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **AI Engine**: [Google Gemini API](https://ai.google.dev/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown)

## 🛠️ Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher)
*   A Google Gemini API Key

### Installation

1.  Clone the repository:
    ```bash
    git clone [repository-url]
    cd research-analyst-ai
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    Create a `.env.local` file in the root directory and add your API key:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 📖 Usage Guide

1.  **Upload Source**: Start by uploading a PDF, Video, or Audio file. The AI will acknowledge the file and prepare for analysis.
2.  **Analyze**: Ask detailed questions about the content. The AI will provide executive summaries and key findings with citations.
3.  **Workspace**: Watch the Workspace sidebar on the right; key data points will be automatically saved there.
4.  **Test Knowledge**: Click "Generate Quiz" to create a comprehension test based on the current file.
5.  **Multilingual Support**: Communicate in your preferred language; the AI automatically detects and adapts to the language of both the source material and your queries.

## ⚖️ License

Private Use Only.
