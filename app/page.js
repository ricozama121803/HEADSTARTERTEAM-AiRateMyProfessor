"use client";
import React, { useState, useEffect } from 'react';
import { Box, Stack, TextField, Button, Typography, InputAdornment } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material'; 
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import WelcomeScreen from './WelcomeScreen';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Rate My Professor support assistant. How can I help you today?",
    },
  ]);

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showWelcome) {
      const timer = setTimeout(() => {
        setContentVisible(true);
      }, 300); // Slight delay to sync with WelcomeScreen
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const sendMessage = async () => {
    if (message.trim() === '') return; // Prevent sending empty messages

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    setMessage('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let result = '';
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
    <Box>
      {showWelcome && <WelcomeScreen onFinish={() => setShowWelcome(false)} />}
      <Box
        sx={{
          display: contentVisible ? 'block' : 'none',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `url('/abstract3.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
        }}
      >
        {/* Header with logo and app */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <img
            src="/logo-small.png" 
            alt="ProfSpot Logo"
            style={{ width: '90px', height: '50px', marginRight: '-17px' }}
          />
          <Typography variant="h6" fontWeight="bold" color='#a3aab5'
            sx={{
              fontFamily: "Arial, sans-serif",
              fontSize: "1.5rem",
            }}
          >
            ProfSpot
          </Typography>
        </Box>

        <Box
          sx={{
            display: contentVisible ? 'block' : 'none',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}  // Custom easing for smoother effect
          >
            <Stack
              direction="column"
              width="500px"
              height="700px"
              p={2}
              spacing={3}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Stack
                direction="column"
                spacing={2}
                flexGrow={1}
                overflow={'auto'}
                sx={{
                  maxHeight: '100%',
                  padding: '10px',
                  '&::-webkit-scrollbar': {
                    width: '5px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '10px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555',
                  },
                }}
              >
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent={
                      message.role === 'assistant' ? 'flex-start' : 'flex-end'
                    }
                  >
                    <Box
                      sx={{
                        bgcolor:
                          message.role === 'assistant'
                            ? 'rgba(0, 0, 0, 0.5)'
                            : 'rgba(10, 130, 180, 0.7)',
                        backdropFilter: 'blur(5px)',
                        color: 'white',
                        borderRadius: '16px',
                        p: 3,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        maxWidth: '80%',
                      }}
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </Box>
                  </Box>
                ))}
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <TextField
                  label="Message"
                  fullWidth
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={sendMessage}
                          sx={{
                            minWidth: 'auto',
                            borderRadius: '50%',
                            padding: '4px',
                            bgcolor: 'rgba(255, 255, 255, 0.3)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.4)',
                            },
                          }}
                        >
                          <ArrowUpward />
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
