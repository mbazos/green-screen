'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import FullKeyboard from './components/FullKeyboard';

function HomeContent() {
  const searchParams = useSearchParams();

  // Default values
  const defaultMessages = [
    'Application Developer Single Sign On (SSO) - 2 years',
    'Senior Application Developer EAS - 3 years and 1 month',
    'Senior Application Developer SE&I - 2 years and 2 months',
    'Senior Software Engineer Rental Car Services - 2 years and 11 months',
    'Principal Engineer Rental Car Services - 2 years',
    'Distinguished Engineer Rental Car Services - 6 years',
    'Senior Director Rental Car Services - 1 year and 7 months',
    'Mobility Search & Book Development Manager - Present',
  ];

  // Parse query parameters
  const startDateParam = searchParams.get('startDate') || '2006-06-01T12:00:00';
  const endDateParam = searchParams.get('endDate') || '2046-06-01T12:00:00';
  const messagesParam = searchParams.get('messages');
  const footerTextParam = searchParams.get('footerText') || 'Michael Bazos';
  const footerUrlParam = searchParams.get('footerUrl') || 'https://michaelbazos.com/';

  // Parse messages from JSON or use defaults
  const messages = useMemo(() => {
    if (messagesParam !== null) {
      try {
        const parsed = JSON.parse(decodeURIComponent(messagesParam));
        if (Array.isArray(parsed)) {
          // Allow empty arrays when explicitly provided
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse messages parameter:', e);
      }
    }
    return defaultMessages;
  }, [messagesParam]);

  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    startDate: startDateParam.slice(0, 7), // Extract YYYY-MM
    endDate: endDateParam.slice(0, 7), // Extract YYYY-MM
    messages: messages.join('\n'),
    footerText: footerTextParam,
    footerUrl: footerUrlParam,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query parameters
    const params = new URLSearchParams();
    // Append day (1st) and time (noon) to the month/year
    params.set('startDate', `${formData.startDate}-01T12:00:00`);
    params.set('endDate', `${formData.endDate}-01T12:00:00`);

    // Convert messages from newline-separated to JSON array
    const messagesArray = formData.messages.split('\n').filter(m => m.trim() !== '');
    params.set('messages', encodeURIComponent(JSON.stringify(messagesArray)));

    params.set('footerText', formData.footerText);
    params.set('footerUrl', formData.footerUrl);

    // Reload with new params
    window.location.href = `${window.location.pathname}?${params.toString()}`;
  };

  useEffect(() => {
    const targetDate = new Date(endDateParam).getTime();
    const startDate = new Date(startDateParam).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      const totalDuration = targetDate - startDate;
      const elapsed = now - startDate;

      if (distance < 0) {
        setTimeLeft({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        setProgress(100);
        setIsComplete(true);
        return;
      }

      const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365.25));
      const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ years, days, hours, minutes, seconds });

      const progressPercent = (elapsed / totalDuration) * 100;
      setProgress(Math.min(progressPercent, 100));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [startDateParam, endDateParam]);

  useEffect(() => {
    // If complete, show congratulations message
    if (isComplete) {
      setDisplayText('Congratulations you did it!');
      return;
    }

    // If messages array is empty, clear display text
    if (messages.length === 0) {
      setDisplayText('');
      return;
    }

    const currentMessage = messages[messageIndex];

    // Safety check
    if (!currentMessage) {
      return;
    }

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
  }, [messageIndex, messages, isComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0c1a0e', color: '#00dd00', fontFamily: 'ui-monospace, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Mono", "Source Code Pro", "Fira Mono", "Droid Sans Mono", Consolas, "Courier New", monospace', WebkitFontSmoothing: 'antialiased' }}>
      {/* Retro Fireworks */}
      {isComplete && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="firework"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Customize button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-4 right-4 z-30 px-4 py-2 border-2 border-current transition-all"
        style={{
          fontFamily: 'inherit',
          backgroundColor: 'transparent',
          color: '#00dd00'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#00dd00';
          e.currentTarget.style.color = '#000000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#00dd00';
        }}
      >
        Customize
      </button>

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

      <main className="flex flex-col items-center justify-center gap-6 md:gap-8 z-20 px-4">
        <header className="text-center w-full">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2">
            Green Screen To Retirement
          </h1>
        </header>

        <div className="flex gap-2 sm:gap-4 md:gap-8 text-center items-start">
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl md:text-7xl font-bold tabular-nums">
              {timeLeft.years}
            </span>
            <span className="text-xs sm:text-sm md:text-base mt-1 md:mt-2">
              years
            </span>
          </div>
          <div className="flex items-center" style={{ height: '2.5rem' }}>
            <span className="text-4xl sm:text-5xl md:text-7xl font-bold colon-pulse">:</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl md:text-7xl font-bold tabular-nums">
              {timeLeft.days}
            </span>
            <span className="text-xs sm:text-sm md:text-base mt-1 md:mt-2">
              days
            </span>
          </div>
          <div className="flex items-center" style={{ height: '2.5rem' }}>
            <span className="text-4xl sm:text-5xl md:text-7xl font-bold colon-pulse">:</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl md:text-7xl font-bold tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm md:text-base mt-1 md:mt-2">
              hours
            </span>
          </div>
          <div className="flex items-center" style={{ height: '2.5rem' }}>
            <span className="text-4xl sm:text-5xl md:text-7xl font-bold colon-pulse">:</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl md:text-7xl font-bold tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm md:text-base mt-1 md:mt-2">
              minutes
            </span>
          </div>
          <div className="flex items-center" style={{ height: '2.5rem' }}>
            <span className="text-4xl sm:text-5xl md:text-7xl font-bold colon-pulse">:</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl md:text-7xl font-bold tabular-nums">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm md:text-base mt-1 md:mt-2">
              seconds
            </span>
          </div>
        </div>

        <div className="w-full max-w-2xl px-2">
          <div className="relative w-full h-10 sm:h-12 border-2 border-current">
            <div
              className="absolute top-0 left-0 h-full bg-current opacity-20 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 flex items-center px-2 sm:px-4">
              <span className="text-base sm:text-xl md:text-2xl font-semibold">
                {progress.toFixed(1)}% complete
              </span>
            </div>
          </div>

          {/* Interactive keyboard */}
          <div className="keyboard-typing-container mt-6 md:mt-8 w-full max-w-4xl mx-auto">
            <FullKeyboard isComplete={isComplete} displayText={displayText} />
          </div>

          <div className="mt-6 sm:mt-8 text-center h-[3.5rem] sm:h-[4rem] md:h-[4.5rem] px-2 flex items-center justify-center overflow-hidden">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed">
              {displayText}
            </p>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-2 sm:bottom-4 left-0 right-0 text-center z-20 px-4">
        <a
          href={footerUrlParam}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base sm:text-lg md:text-xl hover:opacity-70 transition-opacity"
        >
          {footerTextParam}
        </a>
      </footer>

      {/* Customization Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="border-2 border-current p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: '#0c1a0e' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Customize Countdown</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl hover:opacity-70"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-semibold">Start Date (Month & Year)</label>
                <input
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-2 border-2 border-current bg-transparent focus:outline-none"
                  style={{ fontFamily: 'inherit', colorScheme: 'dark', caretColor: '#00dd00' }}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">End Date (Month & Year)</label>
                <input
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full p-2 border-2 border-current bg-transparent focus:outline-none"
                  style={{ fontFamily: 'inherit', colorScheme: 'dark', caretColor: '#00dd00' }}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">Messages (one per line)</label>
                <textarea
                  value={formData.messages}
                  onChange={(e) => setFormData({ ...formData, messages: e.target.value })}
                  rows={8}
                  className="w-full p-2 border-2 border-current bg-transparent focus:outline-none resize-y"
                  style={{ fontFamily: 'inherit', caretColor: '#00dd00' }}
                  placeholder="Enter messages, one per line"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">Footer Text</label>
                <input
                  type="text"
                  value={formData.footerText}
                  onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                  className="w-full p-2 border-2 border-current bg-transparent focus:outline-none"
                  style={{ fontFamily: 'inherit', caretColor: '#00dd00' }}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">Footer URL</label>
                <input
                  type="url"
                  value={formData.footerUrl}
                  onChange={(e) => setFormData({ ...formData, footerUrl: e.target.value })}
                  className="w-full p-2 border-2 border-current bg-transparent focus:outline-none"
                  style={{ fontFamily: 'inherit', caretColor: '#00dd00' }}
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 border-2 border-current hover:bg-current hover:text-[#0c1a0e] transition-all font-semibold"
                >
                  Apply Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 border-2 border-current hover:bg-current hover:text-[#0c1a0e] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
