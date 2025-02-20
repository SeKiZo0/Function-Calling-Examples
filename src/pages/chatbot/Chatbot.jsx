import "./Chatbot.css";
import { useEffect, useState } from "react";
import { CreateNewTicket, createMultipleRecords, fetchCarSaleCategories, fetchCarSales } from "../../pocketbase/config";
import { ollama } from "../../ollama/config";
import Markdown from "react-markdown";

function Chatbot() {
  const once = "once";
  const [messageResponse, setMessageResponse] = useState("");
  
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are a data analyst, you are hired to give the user the CarSale data, this can include the statistics of the CarSales, the categories of the CarSales, and the number of CarSales in each category. this can also include data related to costs. you need to use the tools such as fetch_CarSales and fetch_CarSalescategories to get the data from the database. Please do not use the submit ticket tool for anything unless the user asks for it. you need to give the user information only on car sales and nothing else, if you do so you will get demoted to a lower rank. The user will not be interested in code so dont provide them with any, they will only be interested in the data. ",
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
    {
      type: "function",
      function: {
        name: "fetch_CarSales",
        description: "Fetches all CarSales from the database",
        parameters: {
          type: "object",
          properties: {},
          required: [],
          additionalProperties: false,
        },
        strict: true,
      },
    },
    {
      type: "function",
      function: {
        name: "fetch_CarSalescategories",
        description: "Fetches all CarSale categories from the database",
        parameters: {
          type: "object",
          properties: {},
          required: [],
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
        model: "llama3.1",
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
      model: "llama3.1",
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
      } else if (response.message.tool_calls[0].function.name === "fetch_CarSalescategories") {
        const CarSales = await fetchCarSaleCategories();
        console.log(CarSales);

        // Update messages with the fetched CarSales data
        const updatedMessages = [
          ...messages,
          { role: "user", content: `Fetched CarSales: ${JSON.stringify(CarSales)}` },
        ];

        const response2 = await ollama.chat({
          model: "llama3.1",
          messages: updatedMessages, // Send updated messages with fetched CarSales
          tools,
          stream: false,
        });
        console.log(response2);

        // Update messages with the new response from Ollama
        setMessages((prevMessages) => [...prevMessages, response2.message]);
        setMessageResponse(
          (prevResponse) => prevResponse + response2.message.content
        );
      } else if (response.message.tool_calls[0].function.name === "fetch_CarSales") {
        const CarSales = await fetchCarSales();
        console.log(CarSales);

        // Update messages with the fetched CarSales data
        const updatedMessages = [
          ...messages,
          { role: "user", content: `Fetched CarSales: ${JSON.stringify(CarSales)}` },
        ];

        const response2 = await ollama.chat({
          model: "llama3.1",
          messages: updatedMessages, // Send updated messages with fetched CarSales
          tools,
          stream: false,
        });
        console.log(response2);

        // Update messages with the new response from Ollama
        setMessages((prevMessages) => [...prevMessages, response2.message]);
        setMessageResponse(
          (prevResponse) => prevResponse + response2.message.content
        );
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
          <button onClick={createMultipleRecords} type="submit">
            upload data
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
