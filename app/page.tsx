'use client';

import { useEffect, useState } from 'react';
import FullKeyboard from './components/FullKeyboard';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    'Application Developer Single Sign On (SSO) - January 2006 - January 2008',
    'Senior Application Developer EAS - January 2008 - February 2011',
    'Senior Application Developer SE&I - February 2011 - April 2013',
    'Senior Software Engineer Rental Car Services - April 2013 - March 2016',
    'Principal Engineer Rental Car Services - March 2016 - March 2018',
    'Distinguished Engineer Rental Car Services - March 2018 - March 2024',
    'Senior Director Rental Car Services - March 2024 - October 2025',
    'Mobility Search & Book Development Manager - October 2025 - Present',
  ];

  useEffect(() => {
    // Set your target date here (example: January 20, 2029)
    const targetDate = new Date('2046-06-01T12:00:00').getTime();
    const startDate = new Date('2006-06-01T12:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      const totalDuration = targetDate - startDate;
      const elapsed = now - startDate;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setProgress(100);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      const progressPercent = (elapsed / totalDuration) * 100;
      setProgress(Math.min(progressPercent, 100));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentMessage = messages[messageIndex];
    let charIndex = 0;
    let isTyping = true;
    let timeoutId: NodeJS.Timeout;

    const typeWriter = () => {
      if (isTyping) {
        // Typing forward
        if (charIndex <= currentMessage.length) {
          setDisplayText(currentMessage.slice(0, charIndex));
          charIndex++;
          timeoutId = setTimeout(typeWriter, 100); // 100ms per character
        } else {
          // Wait 3 seconds before reversing
          timeoutId = setTimeout(() => {
            isTyping = false;
            charIndex = currentMessage.length;
            typeWriter();
          }, 3000);
        }
      } else {
        // Typing backward (erasing)
        if (charIndex >= 0) {
          setDisplayText(currentMessage.slice(0, charIndex));
          charIndex--;
          timeoutId = setTimeout(typeWriter, 50); // Faster when erasing
        } else {
          // Move to next message
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }
      }
    };

    typeWriter();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [messageIndex]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0c1a0e', color: '#00dd00', fontFamily: 'ui-monospace, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Mono", "Source Code Pro", "Fira Mono", "Droid Sans Mono", Consolas, "Courier New", monospace', WebkitFontSmoothing: 'antialiased' }}>
      {/* Scanlines effect */}
      <div
        className="scanlines"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '200vh',
          backgroundImage: 'repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0px, rgba(0, 0, 0, 0.3) 2px, transparent 2px, transparent 4px)',
          pointerEvents: 'none',
          zIndex: 9999,
          animation: 'scanlines 0.5s linear infinite',
        }}
      />
      {/* Single thick scanline moving top to bottom */}
      <div
        className="single-scanline"
        style={{
          position: 'fixed',
          left: 0,
          width: '100%',
          height: '5px',
          background: 'rgba(0, 0, 0, 0.5)',
          pointerEvents: 'none',
          zIndex: 10000,
          animation: 'single-scanline 1s linear infinite',
        }}
      />

      <main className="flex flex-col items-center justify-center gap-8 z-20">
        <header className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            Time To Retirment
          </h1>

          {/* Interactive keyboard */}
          <div className="keyboard-typing-container mt-8 w-full max-w-4xl">
            <FullKeyboard />
          </div>
        </header>

        <div className="flex gap-4 md:gap-8 text-center items-start">
          <div className="flex flex-col items-center">
            <span className="text-5xl md:text-7xl font-bold tabular-nums">
              {timeLeft.days}
            </span>
            <span className="text-sm md:text-base mt-2">
              days
            </span>
          </div>
          <div className="flex items-center" style={{ height: '3.75rem' }}>
            <span className="text-5xl md:text-7xl font-bold colon-pulse">:</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl md:text-7xl font-bold tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-sm md:text-base mt-2">
              hours
            </span>
          </div>
          <div className="flex items-center" style={{ height: '3.75rem' }}>
            <span className="text-5xl md:text-7xl font-bold colon-pulse">:</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl md:text-7xl font-bold tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-sm md:text-base mt-2">
              minutes
            </span>
          </div>
          <div className="flex items-center" style={{ height: '3.75rem' }}>
            <span className="text-5xl md:text-7xl font-bold colon-pulse">:</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl md:text-7xl font-bold tabular-nums">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-sm md:text-base mt-2">
              seconds
            </span>
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <div className="relative w-full h-12 border-2 border-current">
            <div
              className="absolute top-0 left-0 h-full bg-current opacity-20 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 flex items-center px-4">
              <span className="text-xl md:text-2xl font-semibold">
                {progress.toFixed(1)}% complete
              </span>
            </div>
          </div>

          <div className="mt-8 text-center min-h-[2rem]">
            <p className="text-lg md:text-xl">
              {displayText}
            </p>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-4 left-0 right-0 text-center z-20">
        <a
          href="https://michaelbazos.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg md:text-xl hover:opacity-70 transition-opacity"
        >
          Michael Bazos
        </a>
      </footer>
    </div>
  );
}
