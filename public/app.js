const tabButtons = document.querySelectorAll(".tab-button");
const panels = document.querySelectorAll(".panel");
const connectionStatus = document.querySelector("#connection-status");

const knowledgeForm = document.querySelector("#knowledge-form");
const knowledgeResult = document.querySelector("#knowledge-result");

const inboxForm = document.querySelector("#inbox-form");
const inboxResult = document.querySelector("#inbox-result");
const copyReplyButton = document.querySelector("#copy-reply");

const scopeForm = document.querySelector("#scope-form");
const scopeResult = document.querySelector("#scope-result");

let latestEmailDraft = "";

tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedTab = button.dataset.tab;

        tabButtons.forEach((tab) => {
            tab.classList.toggle("active", tab === button);
        });

        panels.forEach((panel) => {
            panel.classList.toggle("active", panel.id === `${selectedTab}-panel`);
        });
    });
});

async function postJSON(url, data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
    }

    return result;
}

function showLoading(element, message) {
    element.classList.remove("error", "muted");
    element.textContent = message;
}

function showError(element, error) {
    element.classList.remove("muted");
    element.classList.add("error");
    element.textContent = error.message;
}

function showText(element, text) {
    element.classList.remove("error", "muted");
    element.textContent = text;
}

function showStructuredResult(element, value) {
    element.classList.remove("error", "muted");
    element.replaceChildren();

    const pre = document.createElement("pre");
    pre.textContent = typeof value === "string"
        ? value
        : JSON.stringify(value, null, 2);

    element.appendChild(pre);
}

async function checkSetup() {
    try {
        const response = await fetch("/api/health");
        const health = await response.json();

        if (health.aiConfigured) {
            connectionStatus.textContent = "Gemini key detected";
            connectionStatus.classList.add("ready");
            connectionStatus.classList.remove("missing");
        } else {
            connectionStatus.textContent = "API key needed";
            connectionStatus.classList.add("missing");
            connectionStatus.classList.remove("ready");
        }
    } catch {
        connectionStatus.textContent = "Server unavailable";
        connectionStatus.classList.add("missing");
    }
}

knowledgeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    showLoading(knowledgeResult, "Asking Gemini…");

    try {
        const result = await postJSON("/api/knowledge", {
            sourceText: document.querySelector("#knowledge-text").value,
            question: document.querySelector("#knowledge-question").value
        });

        showText(knowledgeResult, result.answer);
    } catch (error) {
        showError(knowledgeResult, error);
    }
});

inboxForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    showLoading(inboxResult, "Drafting reply with Gemini…");
    copyReplyButton.disabled = true;
    latestEmailDraft = "";

    try {
        const result = await postJSON("/api/inbox", {
            email: document.querySelector("#customer-email").value,
            context: document.querySelector("#support-context").value
        });

        latestEmailDraft = result.reply;
        showText(inboxResult, result.reply);
        copyReplyButton.disabled = false;
    } catch (error) {
        showError(inboxResult, error);
    }
});

copyReplyButton.addEventListener("click", async () => {
    if (!latestEmailDraft) {
        return;
    }

    try {
        await navigator.clipboard.writeText(latestEmailDraft);
        copyReplyButton.textContent = "Copied!";
        setTimeout(() => {
            copyReplyButton.textContent = "Copy draft";
        }, 1500);
    } catch {
        copyReplyButton.textContent = "Copy unavailable";
    }
});

scopeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    showLoading(scopeResult, "Extracting requirements with Gemini…");

    try {
        const result = await postJSON("/api/scope", {
            meetingNotes: document.querySelector("#meeting-notes").value
        });

        showStructuredResult(scopeResult, result.scope);
    } catch (error) {
        showError(scopeResult, error);
    }
});

checkSetup();
