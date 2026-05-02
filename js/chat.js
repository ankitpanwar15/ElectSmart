// AI Chat Assistant - Integrated with Google Gemini API
let GEMINI_API_KEY = localStorage.getItem('gemini_api_key') || '';

const knowledgeBase = {
    "vvpat": "VVPAT stands for Voter Verifiable Paper Audit Trail. It is an independent system attached to the EVM that allows voters to verify that their votes are cast as intended. When a vote is cast, a slip is printed containing the serial number, name, and symbol of the candidate.",
    "evm": "EVM stands for Electronic Voting Machine. It is used to record votes digitally in Indian elections, replacing the traditional paper ballot system to make the process faster and reduce invalid votes.",
    "register": "To register to vote, you must be an Indian citizen aged 18 or above. You can register online through the National Voters' Services Portal (NVSP) by filling out Form 6, or via the Voter Helpline App.",
    "model code of conduct": "The Model Code of Conduct (MCC) is a set of guidelines issued by the Election Commission of India for candidates and political parties during elections to ensure free and fair polling. It comes into effect as soon as the election schedule is announced.",
    "eci": "The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering election processes in India at national, state and district levels.",
    "delimitation": "Delimitation is the act of redrawing boundaries of Lok Sabha and state Assembly seats to represent changes in population. The main objective is to provide equal representation to equal segments of a population."
};

function initChat() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    if (!input || !sendBtn) return;

    // Send on Enter
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    sendBtn.addEventListener('click', handleSend);
}

async function handleSend() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    appendMessage(text, 'user');
    input.value = '';

    // Show typing indicator
    const chatContainer = document.getElementById('chat-messages');
    const typingMsg = document.createElement('div');
    typingMsg.className = 'message bot typing';
    typingMsg.innerHTML = '<i class="fa-solid fa-ellipsis fa-fade"></i> AI is thinking...';
    typingMsg.id = 'typing-indicator';
    chatContainer.appendChild(typingMsg);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const response = await getAIResponse(text);
        
        const indicator = document.getElementById('typing-indicator');
        if(indicator) indicator.remove();
        
        appendMessage(response, 'bot');
    } catch (error) {
        console.error('AI Error:', error);
        const indicator = document.getElementById('typing-indicator');
        if(indicator) indicator.remove();
        appendMessage("I'm having trouble connecting to my brain right now. Here's a quick answer from my local database: " + getLocalFallback(text), 'bot');
    }
}

function appendMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    // Security: Use textContent for user messages to prevent XSS
    msgDiv.textContent = text;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

async function getAIResponse(query) {
    // If no API key, use fallback immediately
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY') {
        return new Promise(resolve => setTimeout(() => resolve(getLocalFallback(query)), 1000));
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const requestBody = {
        contents: [{
            parts: [{
                text: `You are an Indian Election Assistant. Answer the following user query briefly and helpfully. Query: ${query}`
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
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
    return "I'm currently in Offline/Lite mode. Please ask about EVM, VVPAT, or Registration, or add a Gemini API Key in settings to enable full AI capabilities.";
}

// Global function for the setup
window.setGeminiKey = function(key) {
    GEMINI_API_KEY = key;
    localStorage.setItem('gemini_api_key', key);
    if (window.addNotification) window.addNotification("Gemini AI integration enabled!");
};
