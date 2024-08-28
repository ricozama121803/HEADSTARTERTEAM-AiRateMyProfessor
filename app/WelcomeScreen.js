import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import * as THREE from 'three'; // Importing three.js
import GLOBE from 'vanta/dist/vanta.globe.min'; // Importing the Vanta GLOBE effect

export default function WelcomeScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);
  const vantaRef = useRef(null); // Create a ref to attach the Vanta effect

  useEffect(() => {
    // Initialize the Vanta GLOBE effect
    const vantaEffect = GLOBE({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x315CCC,
      color2: 0x7A5684,
      size: 1.80,
      backgroundColor: 0x0,
      THREE // Pass the three.js instance
    });

    // Cleanup effect when the component unmounts
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  const handleClick = () => {
    setFadeOut(true);
    setTimeout(() => {
      onFinish(); // Call onFinish after the fade-out animation
    }, 1500); // Duration of the fade-out animation
  };

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        opacity: fadeOut ? 0 : 1,
        scale: fadeOut ? 0.9 : 1,
        transition: { duration: 1.5 },
      }}
    >
      <Box
        ref={vantaRef} // Attach the Vanta effect to this element
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column', // Stack content vertically
          backgroundColor: '#000',
          color: '#fff',
          zIndex: 1000, // Ensure the welcome screen is on top
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.1)', // More transparent background
            borderRadius: '15px', // Slightly more rounded corners for a softer look
            padding: '20px 40px', // Extra padding to create more space around the text
            backdropFilter: 'blur(15px)', // Increase blur for a glassier effect
            WebkitBackdropFilter: 'blur(15px)', // Ensure compatibility with Webkit browsers
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)', // Stronger shadow for more depth
            border: '1px solid rgba(255, 255, 255, 0.18)', // Softer border to enhance glass effect
            textAlign: 'center', // Center align the text
            marginBottom: '20px', // Space between the card and the button
          }}
        >
          <Typography
            variant="h3"
            component={motion.h3}
            sx={{
              background: '#ffffff',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              marginBottom: '10px', // Space between the title and the subtext
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            ProfSpot
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#fff',
              opacity: 0.8, // Slight transparency for subtext
              fontWeight: '300', // Lighter font weight for subtext
            }}
          >
            Introducing the OpenAI-Powered RAG Assistant to RateMyProfessor.com
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#4b32e5', // Match the color with the theme
            '&:hover': {
              backgroundColor: '#3b29c5', // Slightly darker shade on hover
            },
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Chat now
        </Button>
      </Box>
    </motion.div>
  );
}
