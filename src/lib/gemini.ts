import { GoogleGenAI } from '@google/genai';

export const eduChatTheme = {
  primary: '#003399',
  secondary: '#D4AF37',
};

// Initialize Gemini
let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (error) {
  console.error("Failed to initialize Gemini:", error);
}

export type Message = {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
  sender?: string;
};

export async function askEduChatBot(question: string): Promise<string> {
  if (!ai) return "Erro: Chave da API do Gemini não configurada.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Você é o EduChatBot, o assistente oficial do EDUCHAT Amazonas, uma plataforma para profissionais da educação do Amazonas (Professores, Gestores, Secretários, TI, Coordenadores). Responda de forma prestativa, clara e contextualizada ao estado do Amazonas.\n\nPergunta: ${question}`,
    });
    return response.text || "Desculpe, não consegui gerar uma resposta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Desculpe, ocorreu um erro ao se comunicar com o assistente.";
  }
}
