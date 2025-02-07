import "./Chatbot.css";
import { useEffect, useState } from "react";
import { CreateNewTicket } from "../../pocketbase/config";
import { ollama } from "../../ollama/config";
import Markdown from "react-markdown";

function Chatbot() {
  const once = "once";
  const [messageResponse, setMessageResponse] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Your name is Beemie, whenever the user greets you will always introduce your self and tell them that you are willing to help them with anything, you can have a friendly chat with the user, please also make the user feel welcome. You are also an agent who will listen to any of the user's issues, and if you can't solve the issue within 5 prompts from the user mentioning the issue you will have to ask the user if the want to submit a ticket, but you will have to atleast provided 3 solutions first before submitting a ticket. Try and have a conversation with the user first before submitting a ticket. Please wait for 3 prompts before submitting a ticket",
    },
  ]);
  const [prompt, setPrompt] = useState("");

  const tools = [
    {
      type: "function",
      function: {
        name: "submit_ticket",
        description: "Used to submit a ticket",
        parameters: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "A short description of the ticket",
            },
            description: {
              type: "string",
              description: "A longer description of the ticket",
            },
          },
          required: ["title", "description"],
          additionalProperties: false,
        },
        strict: true,
      },
    },
  ];

  // Initial prompt sent to Ollama when the component loads
  useEffect(() => {
    const sendInitialPrompt = async () => {
      const response = await ollama.chat({
        model: "qwen2",
        messages: messages,
        tools,
        stream: false,
      });

      console.log(response);
    };

    sendInitialPrompt();
  }, [once]); // This dependency ensures the initial prompt only sends once

  const SendPrompt = async () => {
    const message = { role: "user", content: prompt };

    // Correctly update the messages state with the previous state
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, message]; // Append the new user message
      return updatedMessages;
    });

    // After the messages state has updated, pass the updated state to Ollama
    // Wait for the state to be updated before sending the next prompt
    const response = await ollama.chat({
      model: "qwen2",
      messages: [...messages, message], // Send updated messages
      tools,
      stream: false,
    });

    console.log(response);

    setMessageResponse(
      (prevResponse) => prevResponse + response.message.content
    );

    // Update messages with the new response from Ollama
    setMessages((prevMessages) => [...prevMessages, response.message]);

    if (response.message.tool_calls) {
      if (response.message.tool_calls[0].function.name === "submit_ticket") {
        const newTicket = {
          title: response.message.tool_calls[0].function.arguments.title,
          description:
            response.message.tool_calls[0].function.arguments.description,
        };
        console.log(newTicket);
        CreateNewTicket(newTicket);
      }
    }
  };
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex-grow">
          <div>
            {/* Results:
            <Markdown>{messageResponse}</Markdown> */}
          </div>
          <div className="imessage">
            {messages.map((message) => (
              <p
                key={1}
                className={
                  message.role == "user"
                    ? "from-me"
                    : message.role == "assistant"
                    ? "from-them"
                    : "noDisplay"
                }
              >
                <Markdown className=".Markdown">{message.content}</Markdown>
              </p>
            ))}
          </div>
        </div>
        <div className="footer">
          <button onClick={SendPrompt} type="submit">
            Send
          </button>
          <textarea
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </div>
      </div>
    </>
  );
}

export default Chatbot;
