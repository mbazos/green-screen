// Typewriter effect module

let messages: string[] = [];
let messageIndex = 0;
let charIndex = 0;
let isTyping = true;
let isComplete = false;
let timeoutId: number | null = null;
let displayTextEl: HTMLElement | null = null;

function updateDisplay(text: string) {
  if (displayTextEl) {
    displayTextEl.textContent = text;
  }
}

function dispatchCharEvent(char: string, isDeleting: boolean) {
  window.dispatchEvent(new CustomEvent('typewriter-char', {
    detail: { char, isDeleting }
  }));
}

function typeWriter() {
  if (isComplete) return;

  const currentMessage = messages[messageIndex];

  if (!currentMessage) {
    return;
  }

  if (isTyping) {
    // Typing forward
    if (charIndex <= currentMessage.length) {
      const newText = currentMessage.slice(0, charIndex);
      updateDisplay(newText);

      // Dispatch event for the new character
      if (charIndex > 0) {
        dispatchCharEvent(currentMessage[charIndex - 1], false);
      }

      charIndex++;
      timeoutId = window.setTimeout(typeWriter, 150); // 150ms per character
    } else {
      // Wait 3 seconds before reversing
      timeoutId = window.setTimeout(() => {
        isTyping = false;
        charIndex = currentMessage.length;
        typeWriter();
      }, 3000);
    }
  } else {
    // Typing backward (erasing)
    if (charIndex >= 0) {
      const newText = currentMessage.slice(0, charIndex);
      updateDisplay(newText);

      // Dispatch backspace event
      dispatchCharEvent('Backspace', true);

      charIndex--;
      timeoutId = window.setTimeout(typeWriter, 75); // 75ms when erasing
    } else {
      // Move to next message
      messageIndex = (messageIndex + 1) % messages.length;
      charIndex = 0;
      isTyping = true;
      typeWriter();
    }
  }
}

function handleComplete() {
  isComplete = true;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  updateDisplay('Congratulations you did it!');
}

export function initTypewriter(messageList: string[]) {
  messages = messageList;
  displayTextEl = document.getElementById('display-text');

  // If no messages, clear display
  if (messages.length === 0) {
    updateDisplay('');
    return;
  }

  // Listen for countdown complete event
  window.addEventListener('countdown-complete', handleComplete);

  // Start typewriter effect
  typeWriter();
}

export function stopTypewriter() {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}
