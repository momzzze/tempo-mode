import { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <div className="clock drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
      <span className="font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
        {hours}:{minutes}
      </span>
    </div>
  );
}
