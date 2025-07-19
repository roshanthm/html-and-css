document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeChatbot = document.getElementById('close-chatbot');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chatbot-messages');
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('active');
    });
    
    closeChatbot.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
    });
    
    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate bot response after a delay
        setTimeout(() => {
            removeTypingIndicator();
            const botResponse = generateResponse(message);
            addMessage(botResponse, 'bot');
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
    
    // Event listeners for sending messages
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', `${sender}-message`);
        
        const messageText = document.createElement('p');
        messageText.textContent = text;
        messageDiv.appendChild(messageText);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingDiv.appendChild(dot);
        }
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Generate bot responses
    function generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Greetings
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello there! How can I assist you with your food order today?";
        }
        
        // Menu questions
        if (lowerMessage.includes('menu') || lowerMessage.includes('items') || lowerMessage.includes('food')) {
            return "We offer a wide variety of delicious dishes! Our menu includes Italian pasta, Indian curries, Chinese stir-fries, American burgers, and much more. Would you like recommendations based on your preferences?";
        }
        
        // Delivery questions
        if (lowerMessage.includes('delivery') || lowerMessage.includes('deliver') || lowerMessage.includes('time')) {
            return "Our standard delivery time is 30-45 minutes. For premium members, we offer express delivery in 20 minutes or less!";
        }
        
        // Payment questions
        if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('credit card')) {
            return "We accept all major credit cards, PayPal, and cash on delivery. Your payment information is always kept secure.";
        }
        
        // About questions
        if (lowerMessage.includes('about') || lowerMessage.includes('who are you') || lowerMessage.includes('what is this')) {
            return "We're a premium food delivery service committed to bringing you the best dining experience at home. Our chefs prepare meals with fresh, high-quality ingredients.";
        }
        
        // Order status
        if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('track'))) {
            return "To check your order status, please provide your order number or check the 'My Orders' section in your account.";
        }
        
        // Complaints
        if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('wrong')) {
            return "I'm sorry to hear you're having an issue. Please describe the problem and I'll connect you with our customer service team immediately.";
        }
        
        // Default responses
        const defaultResponses = [
            "I'm happy to help with your food order! Could you tell me more about what you're looking for?",
            "That's a great question! Our menu has many options to satisfy your cravings.",
            "I can help you place an order or answer any questions about our service.",
            "Would you like recommendations based on your favorite cuisine type?",
            "I'm here to make your food ordering experience smooth and enjoyable!"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // Initialize with welcome message if no messages exist
    if (chatMessages.children.length === 0) {
        addMessage("Hello! I'm FoodBot, your virtual assistant. How can I help you with your food order today?", 'bot');
    }
});