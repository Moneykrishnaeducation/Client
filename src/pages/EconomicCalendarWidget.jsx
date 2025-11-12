// EconomicCalendarWidget.jsx
import { useEffect, useRef, memo } from 'react';

function EconomicCalendarWidget() {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.tradays.com/c/js/widgets/calendar/widget.js?v=15';
    script.type = 'text/javascript';
    script.async = true;
    script.dataset.type = 'calendar-widget';
    script.innerHTML = `{"width":"100%","height":"100%","mode":"2","fw":"react","theme":1}`;

    container.current?.appendChild(script);
  }, [container]);

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
      }}
    >
      <div
        id="economicCalendarWidget"
        style={{
          width: '100%',
          height: '500px', // height for the widget itself
        }}
      ></div>
    </div>
  );
}

export default memo(EconomicCalendarWidget);
