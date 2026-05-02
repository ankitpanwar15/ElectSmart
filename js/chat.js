/**
 * @module Chat
 * Handles the AI Assistant interaction using Google Gemini API with premium persona.
 */

let GEMINI_API_KEY = localStorage.getItem('gemini_api_key') || '';

const SYSTEM_PROMPT = `You are Electo, the advanced AI Election Companion for India.
Your mission is to empower citizens with accurate, neutral, and easy-to-understand information about the electoral process.

Tone Guidelines:
- Professional yet approachable (Namaste!).
- Non-partisan: Never express opinions on political parties or candidates.
- Clear: Use simple analogies for complex rules (like MCC or VVPAT).
- Encouraging: Remind users of the power of their vote.

Specific Instructions:
1. If asked about voter registration, mention voters.eci.gov.in.
2. If asked about documents, list the 12 approved photo IDs.
3. Use markdown (bold, lists) for readability.
4. Keep responses concise but comprehensive.`;

const knowledgeBase = {
    "vvpat": "Voter Verifiable Paper Audit Trail (VVPAT) is an independent system attached with the EVM that allows voters to verify their vote. A slip is displayed for 7 seconds showing the choice made.",
    "evm": "Electronic Voting Machines (EVM) consist of a Control Unit and a Balloting Unit. They are tamper-proof and have been used in India since 1982.",
    "mcc": "Model Code of Conduct (MCC) are guidelines issued by the ECI for political parties to ensure free and fair elections. It kicks in the moment elections are announced.",
    "epic": "EPIC is your Voter ID card. However, you can vote with 11 other IDs if your name is in the electoral roll.",
    "nota": "None of the Above (NOTA) allows you to reject all candidates. It's a powerful tool for democratic expression.",
    "age": "You must be 18 years old on the qualifying date (usually Jan 1st of the year) to register as a voter."
};

export function initChat() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    if (!input || !sendBtn) return;

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    sendBtn.addEventListener('click', handleSend);
}

async function handleSend() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    input.value = '';

    const chatContainer = document.getElementById('chat-messages');
    const typingMsg = document.createElement('div');
    typingMsg.className = 'message bot typing';
    typingMsg.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    typingMsg.id = 'typing-indicator';
    chatContainer.appendChild(typingMsg);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const response = await getAIResponse(text);
        document.getElementById('typing-indicator')?.remove();
        appendMessage(response, 'bot');
    } catch (error) {
        console.error('AI Error:', error);
        document.getElementById('typing-indicator')?.remove();
        appendMessage("I'm experiencing a brief connection issue. " + getLocalFallback(text), 'bot');
    }
}

function formatMarkdown(text) {
    // Simple markdown-to-HTML formatter
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>')
        .replace(/^- (.*)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
}

export function appendMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    
    if (sender === 'bot') {
        msgDiv.innerHTML = formatMarkdown(text);
    } else {
        msgDiv.textContent = text;
    }
    
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    
    // Animate message entry
    msgDiv.style.opacity = '0';
    msgDiv.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
        msgDiv.style.transition = 'all 0.3s ease';
        msgDiv.style.opacity = '1';
        msgDiv.style.transform = 'translateY(0)';
    });
}

async function getAIResponse(query) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY') {
        return new Promise(resolve => setTimeout(() => resolve(getLocalFallback(query)), 800));
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const requestBody = {
        contents: [{
            parts: [{
                text: `${SYSTEM_PROMPT}\n\nUser Question: ${query}`
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
        }
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error('Gemini API Error');

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

function getLocalFallback(query) {
    const lowerQuery = query.toLowerCase();
    for (const key in knowledgeBase) {
        if (lowerQuery.includes(key)) return knowledgeBase[key];
    }
    return "I can certainly help you with that! I'm best at explaining things like EVM, VVPAT, Voter Registration, and the Model Code of Conduct. What specific part of the election process would you like to know more about?";
}

export function setGeminiKey(key) {
    GEMINI_API_KEY = key;
    localStorage.setItem('gemini_api_key', key);
}
