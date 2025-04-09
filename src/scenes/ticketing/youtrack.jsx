import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const YouTrackFeedback = () => {
  const feedbackContainerRef = useRef(null);
  const [formInstance, setFormInstance] = useState(null);
  const location = useLocation();

  // Cerrar el formulario cuando cambia la ruta
  useEffect(() => {
    if (formInstance && typeof formInstance.closeForm === 'function') {
      formInstance.closeForm();
    }
  }, [location.pathname, formInstance]);

  // Manejar clic fuera del formulario
  useEffect(() => {
    console.log('Form instance changed:', formInstance);
    if (!formInstance) return;

    const handleClickOutside = (event) => {
      const formElement = document.querySelector('.yt-feedback-form');
      const feedbackButton = feedbackContainerRef.current;
      
      if (formElement && feedbackButton &&
          !formElement.contains(event.target) && 
          !feedbackButton.contains(event.target)) {
        formInstance.closeForm();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formInstance]);

  useEffect(() => {
    let isMounted = true;
    const script = document.createElement('script');
    script.src = 'https://infocare.youtrack.cloud/static/simplified/form/form-entry.js?auto=false';
    script.async = true;
    
    script.onload = () => {
      if (isMounted && window.YTFeedbackForm && feedbackContainerRef.current) {
        const form = window.YTFeedbackForm.renderFeedbackButton(
          feedbackContainerRef.current,
          {
            backendURL: 'https://infocare.youtrack.cloud',
            formUUID: 'd69c967d-3b7d-465f-84d0-d4e8ac9914ce',
            theme: 'light', 
            language: 'en'
          }
        );
        if (isMounted) setFormInstance(form);
      }
    };

    script.onerror = () => {
      console.error('Failed to load YouTrack feedback form script');
    };

    document.body.appendChild(script);

    return () => {
      isMounted = false;
      document.body.removeChild(script);
      if (feedbackContainerRef.current) {
        feedbackContainerRef.current.innerHTML = '';
      }
      if (formInstance && typeof formInstance.closeForm === 'function') {
        formInstance.closeForm();
      }
    };
  }, []);

  return (
    <Box 
      ref={feedbackContainerRef}
      sx={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}
    />
  );
};

export default YouTrackFeedback;