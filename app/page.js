"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "user",
      content:
        "Hi! I'm the Rate My Professor support assistant. How can I help you today?",
    },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    setMessage("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let result = "";
    const processText = async ({ done, value }) => {
      if (done) {
        return result;
      }
      const text = decoder.decode(value || new Uint8Array(), { stream: true });
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
        return [
          ...otherMessages,
          { ...lastMessage, content: lastMessage.content + text },
        ];
      });

      return reader.read().then(processText);
    };

    reader.read().then(processText);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: `url('/abstract3.jpg')`, // Use the image from the public folder
        backgroundSize: 'cover', // Ensures the image covers the whole area
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
        overflow: "hidden",
      }}
    >
      <Stack
        direction="column"
        width="500px"
        height="700px"
        p={2}
        spacing={3}
        sx={{
          background: "rgba(255, 255, 255, 0.2)", // Semi-transparent white
          borderRadius: "16px",
          backdropFilter: "blur(10px)", // Apply blur effect
          border: "1px solid rgba(255, 255, 255, 0.3)", // Light border
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Subtle shadow
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow={"auto"}
          sx={{
            maxHeight: "100%",
            padding: "10px",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                sx={{
                  bgcolor:
                    message.role === "assistant"
                      ? "rgba(0, 0, 0, 0.5)" // Darker color for assistant messages
                      : "rgba(0, 123, 255, 0.7)", // Distinctive color for user messages
                  backdropFilter: "blur(5px)",
                  color: "white",
                  borderRadius: "16px",
                  p: 3,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  maxWidth: "80%", // To avoid taking up too much space
                }}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(5px)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(5px)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
