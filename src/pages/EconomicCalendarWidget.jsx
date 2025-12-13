// EconomicCalendarWidget.jsx
import { useEffect, useRef, useState, memo } from 'react';
import { useTheme } from '../context/ThemeContext';

function EconomicCalendarWidget() {
  const container = useRef();
  const widgetRef = useRef();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.tradays.com/c/js/widgets/calendar/widget.js?v=15';
    script.type = 'text/javascript';
    script.async = true;
    script.dataset.type = 'calendar-widget';
    script.innerHTML = `{"width":"100%","height":"100%","mode":"2","fw":"react","theme":${isDarkMode ? 2 : 1}}`;

    container.current?.appendChild(script);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          setIsLoading(false);
          observer.disconnect();
        }
      });
    });

    if (widgetRef.current) {
      observer.observe(widgetRef.current, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, [isDarkMode]);

  return (
    <div
      ref={container}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // center horizontally
        justifyContent: 'flex-start', // align content at top
        height: '90vh', // fixed height
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        position: 'relative',
      }}
    >
      <div
        ref={widgetRef}
        id="economicCalendarWidget"
        style={{
          width: '100%',
          height: '500px', // height for the widget itself
        }}
      ></div>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
            color: isDarkMode ? '#ffffff' : '#000000',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          Loading Economic Calendar...
        </div>
      )}
    </div>
  );
}

export default memo(EconomicCalendarWidget);
