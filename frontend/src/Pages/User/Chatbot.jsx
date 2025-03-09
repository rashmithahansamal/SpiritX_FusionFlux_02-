import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [inputValue, setInputValue] = useState(""); // Stores user input
  const chatEndRef = useRef(null); // Ref for auto-scrolling to the latest message

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return; // Ignore empty messages

    // Add user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, sender: "user" },
    ]);
    setInputValue(""); // Clear the input field

    // Call the backend API to get the bot's response
    const botResponse = await getBotResponse(inputValue);

    // Add bot's response to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: botResponse, sender: "bot" },
    ]);
  };

  // Function to call the backend API
  const getBotResponse = async (userMessage) => {
    try {
      const response = await fetch("http://localhost:8000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: 1, query: userMessage }), // Replace `1` with the actual user ID if needed
      });
      const data = await response.json();
      return data.response; // Return the bot's response
    } catch (error) {
      console.error("Error fetching bot response:", error);
      return "Sorry, I couldn't process your request."; // Fallback message
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div style={styles.chatbotContainer}>
      {/* Bot Photo and Header */}
      <div style={styles.headerContainer}>

        <h1 style={styles.header}>Cricket Assistant</h1>
      </div>

      {/* Chat Window */}
      <div style={styles.chatWindow}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(message.sender === "user" ? styles.userMessage : styles.botMessage),
            }}
          >
            {message.text}
          </div>
        ))}
        <div ref={chatEndRef} /> {/* Invisible element for auto-scrolling */}
      </div>

      {/* Input Field and Send Button */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          style={styles.inputField}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

// Styles for the chatbot UI
const styles = {
  chatbotContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  botPhoto: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  header: {
    fontSize: "24px",
    color: "#333",
  },
  chatWindow: {
    width: "600px", // Wider chat window
    height: "500px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#fff",
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  message: {
    maxWidth: "80%",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "10px",
    wordWrap: "break-word",
    fontSize: "16px",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    color: "#fff",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e9ecef",
    color: "#000",
  },
  inputContainer: {
    display: "flex",
    width: "600px", // Wider input container
    marginTop: "20px",
  },
  inputField: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
    fontSize: "16px",
  },
  sendButton: {
    padding: "10px 20px",
    marginLeft: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Chatbot;