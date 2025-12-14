// Keyboard visualization module

// Map keyboard event codes to key IDs
const keyMap: Record<string, number> = {
  'Escape': 1,
  'F1': 2, 'F2': 3, 'F3': 4, 'F4': 5,
  'F5': 6, 'F6': 7, 'F7': 8, 'F8': 9,
  'F9': 10, 'F10': 11, 'F11': 12, 'F12': 13,
  'PrintScreen': 14, 'ScrollLock': 15, 'Pause': 16,
  'Backquote': 17,
  'Digit1': 18, 'Digit2': 19, 'Digit3': 20, 'Digit4': 21,
  'Digit5': 22, 'Digit6': 23, 'Digit7': 24, 'Digit8': 25,
  'Digit9': 26, 'Digit0': 27, 'Minus': 28, 'Equal': 29,
  'Backspace': 30,
  'Insert': 31, 'Home': 32, 'PageUp': 33,
  'NumLock': 34, 'NumpadDivide': 35, 'NumpadMultiply': 36, 'NumpadSubtract': 37,
  'Tab': 38,
  'KeyQ': 39, 'KeyW': 40, 'KeyE': 41, 'KeyR': 42,
  'KeyT': 43, 'KeyY': 44, 'KeyU': 45, 'KeyI': 46,
  'KeyO': 47, 'KeyP': 48, 'BracketLeft': 49, 'BracketRight': 50,
  'Backslash': 51,
  'Delete': 52, 'End': 53, 'PageDown': 54,
  'Numpad7': 55, 'Numpad8': 56, 'Numpad9': 57, 'NumpadAdd': 58,
  'CapsLock': 59,
  'KeyA': 60, 'KeyS': 61, 'KeyD': 62, 'KeyF': 63,
  'KeyG': 64, 'KeyH': 65, 'KeyJ': 66, 'KeyK': 67,
  'KeyL': 68, 'Semicolon': 69, 'Quote': 70,
  'Enter': 71,
  'Numpad4': 72, 'Numpad5': 73, 'Numpad6': 74,
  'ShiftLeft': 75,
  'KeyZ': 76, 'KeyX': 77, 'KeyC': 78, 'KeyV': 79,
  'KeyB': 80, 'KeyN': 81, 'KeyM': 82, 'Comma': 83,
  'Period': 84, 'Slash': 85,
  'ShiftRight': 86,
  'ArrowUp': 87,
  'Numpad1': 88, 'Numpad2': 89, 'Numpad3': 90, 'NumpadEnter': 91,
  'ControlLeft': 92, 'MetaLeft': 93, 'AltLeft': 94,
  'Space': 95,
  'AltRight': 96, 'MetaRight': 97, 'ContextMenu': 98, 'ControlRight': 99,
  'ArrowLeft': 100, 'ArrowDown': 101, 'ArrowRight': 102,
  'Numpad0': 103, 'NumpadDecimal': 104,
};

// Map characters to key IDs
const charToKeyMap: Record<string, number> = {
  // Letters
  'a': 60, 'b': 80, 'c': 78, 'd': 62, 'e': 41, 'f': 63, 'g': 64, 'h': 65,
  'i': 46, 'j': 66, 'k': 67, 'l': 68, 'm': 82, 'n': 81, 'o': 47, 'p': 48,
  'q': 39, 'r': 42, 's': 61, 't': 43, 'u': 45, 'v': 79, 'w': 40, 'x': 77,
  'y': 44, 'z': 76,
  // Numbers
  '0': 27, '1': 18, '2': 19, '3': 20, '4': 21, '5': 22, '6': 23, '7': 24, '8': 25, '9': 26,
  // Special characters
  ' ': 95, // Space
  '-': 28, // Minus
  '(': 26, // Shift + 9
  ')': 27, // Shift + 0
  ',': 83, // Comma
  '.': 84, // Period
  '/': 85, // Slash
  ';': 69, // Semicolon
  "'": 70, // Quote
  '!': 18, // Shift + 1
  ':': 69, // Shift + semicolon
  '&': 24, // Shift + 7
};

let pressedKeyId: number | null = null;

function getKeyElement(keyId: number): Element | null {
  return document.querySelector(`[data-key="${keyId}"]`);
}

function pressKey(keyId: number) {
  const keyEl = getKeyElement(keyId);
  if (keyEl) {
    keyEl.classList.add('key-pressed');
  }
}

function releaseKey(keyId: number) {
  const keyEl = getKeyElement(keyId);
  if (keyEl) {
    keyEl.classList.remove('key-pressed');
  }
}

function releaseAllKeys() {
  document.querySelectorAll('.key-pressed').forEach(el => {
    el.classList.remove('key-pressed');
  });
}

function animateKeyPress(keyIds: number[], duration: number) {
  // Press keys
  keyIds.forEach(id => pressKey(id));

  // Release after duration
  setTimeout(() => {
    keyIds.forEach(id => releaseKey(id));
  }, duration);
}

function handleTypewriterChar(event: CustomEvent<{ char: string; isDeleting: boolean }>) {
  const { char, isDeleting } = event.detail;

  if (isDeleting) {
    // Backspace key
    animateKeyPress([30], 65);
  } else {
    const lowerChar = char.toLowerCase();
    const keyId = charToKeyMap[lowerChar];

    if (keyId) {
      const keysToPress: number[] = [keyId];

      // If uppercase letter, also press shift
      if (char !== lowerChar && /[A-Z]/.test(char)) {
        keysToPress.push(75); // Left Shift
      }

      animateKeyPress(keysToPress, 140);
    }
  }
}

function handleKeyDown(e: KeyboardEvent) {
  const keyId = keyMap[e.code];
  if (keyId) {
    pressedKeyId = keyId;
    pressKey(keyId);
  }
}

function handleKeyUp(e: KeyboardEvent) {
  const keyId = keyMap[e.code];
  if (keyId && pressedKeyId === keyId) {
    releaseKey(keyId);
    pressedKeyId = null;
  }
}

function handleComplete() {
  // Stop animations when countdown is complete
  releaseAllKeys();
}

export function initKeyboard() {
  // Listen for typewriter character events
  window.addEventListener('typewriter-char', handleTypewriterChar as EventListener);

  // Listen for physical keyboard events
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // Listen for countdown complete
  window.addEventListener('countdown-complete', handleComplete);
}

export function cleanupKeyboard() {
  window.removeEventListener('typewriter-char', handleTypewriterChar as EventListener);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('countdown-complete', handleComplete);
}
