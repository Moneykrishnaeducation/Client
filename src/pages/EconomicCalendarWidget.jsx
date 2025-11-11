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
  }, []);

  return (
    <div ref={container}>
      <div id="economicCalendarWidget"></div>
      <div className="ecw-copyright"><a href="https://www.mql5.com/?utm_source=calendar.widget&utm_medium=link&utm_term=economic.calendar&utm_content=visit.mql5.calendar&utm_campaign=202.calendar.widget" rel="noopener nofollow" target="_blank">MQL5 Algo Trading Community</a></div>
    </div>
  );
}

export default memo(EconomicCalendarWidget);