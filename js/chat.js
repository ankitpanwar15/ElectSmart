// Mock AI Chat Assistant

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

function handleSend() {
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
    typingMsg.innerHTML = '<i class="fa-solid fa-ellipsis"></i> Thinking...';
    typingMsg.id = 'typing-indicator';
    chatContainer.appendChild(typingMsg);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Simulate network delay for AI response
    setTimeout(() => {
        const indicator = document.getElementById('typing-indicator');
        if(indicator) indicator.remove();
        
        const response = getMockAIResponse(text);
        appendMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
}

function appendMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = text;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function getMockAIResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    for (const key in knowledgeBase) {
        if (lowerQuery.includes(key)) {
            return knowledgeBase[key];
        }
    }
    
    // Default response
    return "I'm still learning! While I don't have the specific answer to that right now, you can try asking me about 'EVM', 'VVPAT', 'How to register', or the 'Model Code of Conduct'.";
}
