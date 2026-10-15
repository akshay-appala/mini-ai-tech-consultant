import express from "express";
import dotenv from "dotenv";
import {
    answerFromKnowledge,
    draftEmailReply,
    extractMeetingScope
} from "./services/gemini.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

function requireText(value, fieldName) {
    if (typeof value !== "string" || value.trim() === "") {
        const error = new Error(`${fieldName} is required.`);
        error.status = 400;
        throw error;
    }

    return value.trim();
}

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        aiConfigured: Boolean(process.env.GEMINI_API_KEY)
    });
});

app.post("/api/knowledge", async (req, res, next) => {
    try {
        const sourceText = requireText(req.body.sourceText, "Knowledge text");
        const question = requireText(req.body.question, "Question");

        const answer = await answerFromKnowledge(sourceText, question);
        res.json({ answer });
    } catch (error) {
        next(error);
    }
});

app.post("/api/inbox", async (req, res, next) => {
    try {
        const email = requireText(req.body.email, "Customer email");
        const context = (req.body.context || "").trim();

        const reply = await draftEmailReply(email, context);
        res.json({ reply });
    } catch (error) {
        next(error);
    }
});

app.post("/api/scope", async (req, res, next) => {
    try {
        const meetingNotes = requireText(req.body.meetingNotes, "Meeting notes");

        const scope = await extractMeetingScope(meetingNotes);
        res.json({ scope });
    } catch (error) {
        next(error);
    }
});

app.use((error, req, res, next) => {
    console.error("Request error:", error.message);

    if (error.status === 400) {
        return res.status(400).json({ error: error.message });
    }

    if (error.message === "GEMINI_API_KEY is missing.") {
        return res.status(503).json({
            error: "Gemini is not configured yet. Add your API key to the .env file, then restart the server."
        });
    }

    res.status(500).json({
        error: "The request could not be completed. Check the server terminal and try again."
    });
});

app.listen(port, () => {
    console.log(`Mini AI Tech Consultant is running at http://localhost:${port}`);

    if (!process.env.GEMINI_API_KEY) {
        console.log("Gemini API key not found. Add it to .env to enable AI features.");
    }
});
