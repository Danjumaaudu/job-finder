import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function filterJobWithGemini(job: any, prefs: any) {
  const prompt = `
User Preferences: ${JSON.stringify(prefs)}
Job Details: ${JSON.stringify(job)}

Your task: Decide if this job matches the user's preferences.
Respond with ONLY "yes" or "no".
No explanation.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim().toLowerCase();
  

  return /^yes\b/.test(text);
}

export async function summarizeJob(job: any) {
  const prompt = `
Summarize this job in 1–2 sentences in a friendly tone:
${JSON.stringify(job)}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

