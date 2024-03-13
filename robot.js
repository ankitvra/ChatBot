				const chatInput = document.querySelector(".chat_input textarea");
const SendChatBtn = document.querySelector(".chat_input img");
const ChatBox = document.querySelector(".chatbox");
const ChatbotToggle = document.querySelector(".chatbox_toggle");
const ChatbotCloseBtn = document.querySelector(".close_btn");

let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatli = (message, className) => {
    const chatli = document.createElement("li");
    chatli.classList.add("chat", className);
    let chatcontent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material_symbols_outlined"><i class="fa fa-android" aria-hidden="true"></i></span> <p>${message}</p>`;
    chatli.innerHTML = chatcontent;
    return chatli;
};

const generateResponse = (incomingChatli) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatli.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => {
            ChatBox.scrollTo(0, ChatBox.scrollHeight);
        });
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    ChatBox.appendChild(createChatli(userMessage, "outgoing"));
    ChatBox.scrollTo(0, ChatBox.scrollHeight);

    setTimeout(() => {
        const incomingChatli = createChatli("typing...", "incoming");
        ChatBox.appendChild(incomingChatli);
        ChatBox.scrollTo(0, ChatBox.scrollHeight);
        generateResponse(incomingChatli);
    }, 600);
};

SendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

ChatbotToggle.addEventListener("click", () => document.body.classList.toggle("show_chatbot"));
ChatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show_chatbot"));



	
