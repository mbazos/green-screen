// Countdown timer module

interface TimeLeft {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

let isComplete = false;
let countdownInterval: number | null = null;

function calculateTimeLeft(startDate: Date, endDate: Date): { timeLeft: TimeLeft; progress: number; isComplete: boolean } {
  const now = new Date();
  const targetTime = endDate.getTime();
  const startTime = startDate.getTime();
  const nowTime = now.getTime();

  const distance = targetTime - nowTime;
  const totalDuration = targetTime - startTime;
  const elapsed = nowTime - startTime;

  if (distance < 0) {
    return {
      timeLeft: { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 },
      progress: 100,
      isComplete: true,
    };
  }

  const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365.25));
  const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);

  return {
    timeLeft: { years, days, hours, minutes, seconds },
    progress: progressPercent,
    isComplete: false,
  };
}

function updateDOM(timeLeft: TimeLeft, progress: number) {
  // Update countdown numbers
  const yearsEl = document.getElementById('years');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (yearsEl) yearsEl.textContent = String(timeLeft.years);
  if (daysEl) daysEl.textContent = String(timeLeft.days);
  if (hoursEl) hoursEl.textContent = String(timeLeft.hours).padStart(2, '0');
  if (minutesEl) minutesEl.textContent = String(timeLeft.minutes).padStart(2, '0');
  if (secondsEl) secondsEl.textContent = String(timeLeft.seconds).padStart(2, '0');

  // Update progress bar
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');

  if (progressBar) progressBar.style.width = `${progress}%`;
  if (progressText) progressText.textContent = `${progress.toFixed(1)}% complete`;
}

function showFireworks() {
  const container = document.getElementById('fireworks-container');
  if (!container) return;

  container.classList.remove('hidden');
  container.innerHTML = '';

  // Create 15 firework elements
  for (let i = 0; i < 15; i++) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${Math.random() * 100}%`;
    firework.style.animationDelay = `${Math.random() * 2}s`;
    firework.style.animationDuration = `${2 + Math.random() * 2}s`;
    container.appendChild(firework);
  }
}

export function initCountdown(startDateStr: string, endDateStr: string) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const updateCountdown = () => {
    const { timeLeft, progress, isComplete: complete } = calculateTimeLeft(startDate, endDate);
    updateDOM(timeLeft, progress);

    if (complete && !isComplete) {
      isComplete = true;
      showFireworks();
      // Dispatch event for typewriter to show congratulations
      window.dispatchEvent(new CustomEvent('countdown-complete'));
    }
  };

  // Initial update
  updateCountdown();

  // Update every second
  countdownInterval = window.setInterval(updateCountdown, 1000);
}

export function isCountdownComplete(): boolean {
  return isComplete;
}

export function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}
