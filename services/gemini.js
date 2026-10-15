import { GoogleGenAI } from "@google/genai";

function getAIClient() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing.");
    }

    return new GoogleGenAI({ apiKey });
}

async function askGemini(prompt) {
    const ai = getAIClient();
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });

    const text = response.text?.trim();

    if (!text) {
        throw new Error("Gemini returned an empty response.");
    }

    return text;
}

export async function answerFromKnowledge(sourceText, question) {
    const prompt = `
You are a helpful support assistant.
Answer the user's question using only the supplied knowledge text.
If the text does not contain the answer, say that the supplied text does not provide enough information.
Do not invent policies, features, or facts.
Keep the answer clear and concise.

SUPPLIED KNOWLEDGE:
${sourceText}

USER QUESTION:
${question}
`;

    return askGemini(prompt);
}

export async function draftEmailReply(email, context) {
    const prompt = `
You help a support team draft customer email replies.
Write a friendly, professional draft based on the customer's email and the supplied context.
Do not claim that an action has already been completed unless the context says so.
If important details are missing, ask a clarifying question instead of guessing.
Return only the draft reply, including a suitable greeting and sign-off.

SUPPORT CONTEXT:
${context || "No additional support context was supplied. Do not invent company policies or promises."}

CUSTOMER EMAIL:
${email}
`;

    return askGemini(prompt);
}

export async function extractMeetingScope(meetingNotes) {
    const prompt = `
You are helping a small software team organize meeting notes.
Extract the information into valid JSON only, with this structure:
{
  "project_summary": "short summary",
  "requirements": [
    {
      "requirement": "clear requirement",
      "priority": "High, Medium, or Low",
      "open_question": "question to clarify, or None"
    }
  ],
  "suggested_tasks": [
    {
      "task": "small development task",
      "estimate_hours": 1,
      "assumptions": "short reason or assumption"
    }
  ],
  "risks_and_unknowns": ["item"],
  "next_steps": ["item"]
}

Rules:
- Use only information supported by the meeting notes.
- Estimates are rough suggestions, not commitments. Use whole-number hours and explain important assumptions.
- Do not add requirements that the client did not request.
- If details are unclear, list questions or unknowns.
- Return JSON only, without Markdown fences.

MEETING NOTES:
${meetingNotes}
`;

    const result = await askGemini(prompt);

    try {
        const cleaned = result
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "");

        return JSON.parse(cleaned);
    } catch {
        return {
            raw_response: result,
            note: "The model response was not valid JSON, so it is shown as text."
        };
    }
}
