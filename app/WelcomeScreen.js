import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import * as THREE from 'three'; // Importing three.js
import HALO from 'vanta/dist/vanta.halo.min'; // Importing the Vanta HALO effect

export default function WelcomeScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);
  const vantaRef = useRef(null); // Create a ref to attach the Vanta effect

  useEffect(() => {
    // Initialize the Vanta HALO effect
    const vantaEffect = HALO({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      size: 1.80,
      THREE // Pass the three.js instance
    });

    // Start fade-out after a delay
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000); // Wait for 2 seconds before starting to fade out

    // Call onFinish after fade-out is complete
    const fadeTimer = setTimeout(() => {
      onFinish();
    }, 2500); // Total time including fade-out (2s + 0.5s)

    // Cleanup effect when the component unmounts
    return () => {
      if (vantaEffect) vantaEffect.destroy();
      clearTimeout(timer);
      clearTimeout(fadeTimer);
    };
  }, [onFinish]);

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
          backgroundColor: '#000',
          color: '#fff',
          zIndex: 1000, // Ensure the welcome screen is on top
        }}
      >
        <Typography variant="h3"
          component={motion.h3}
          sx={{
            background: 'linear-gradient(to right, #e8fff7, #d7fff1, #c6ffeb, #b5ffe5, #a2ffde)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          ProfSpot
        </Typography>
      </Box>
    </motion.div>
  );
}
