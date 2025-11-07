'use client';

import { useEffect, useState, useRef } from 'react';

// Map keyboard event codes to key IDs
const keyMap: { [key: string]: number } = {
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
const charToKeyMap: { [key: string]: number } = {
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
};

interface FullKeyboardProps {
  isComplete?: boolean;
  displayText?: string;
}

export default function FullKeyboard({ isComplete = false, displayText = '' }: FullKeyboardProps) {
  const [pressedKey, setPressedKey] = useState<number | null>(null);
  const [animatedKeys, setAnimatedKeys] = useState<number[]>([]);
  const prevTextLengthRef = useRef(0);

  // Keyboard event listener for real keypresses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyId = keyMap[e.code];
      if (keyId) {
        setPressedKey(keyId);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyId = keyMap[e.code];
      if (keyId && pressedKey === keyId) {
        setPressedKey(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedKey]);

  // Key press animation based on displayText
  useEffect(() => {
    // Stop animations if complete
    if (isComplete) {
      setAnimatedKeys([]);
      prevTextLengthRef.current = 0;
      return;
    }

    const currentLength = displayText.length;
    const prevLength = prevTextLengthRef.current;

    // Determine if text is being added or removed
    if (currentLength > prevLength) {
      // Text is being typed forward - press the key for the new character
      const newChar = displayText[currentLength - 1];
      const lowerChar = newChar.toLowerCase();
      const keyId = charToKeyMap[lowerChar];

      if (keyId) {
        const keysToPress: number[] = [keyId];

        // If uppercase letter, also press shift
        if (newChar !== lowerChar && /[A-Z]/.test(newChar)) {
          keysToPress.push(75); // Left Shift
        }

        setAnimatedKeys(keysToPress);

        // Release keys after 150ms (matching typing speed) to prevent last key from staying pressed
        const releaseTimeout = setTimeout(() => {
          setAnimatedKeys([]);
        }, 150);

        return () => clearTimeout(releaseTimeout);
      } else {
        // Character not in map, clear any pressed keys
        setAnimatedKeys([]);
      }
    } else if (currentLength < prevLength) {
      // Text is being erased - press backspace and release after delay
      setAnimatedKeys([30]); // Backspace key ID

      // Release backspace after 50ms to create visible tapping effect before next deletion at 75ms
      const releaseTimeout = setTimeout(() => {
        setAnimatedKeys([]);
      }, 50);

      return () => clearTimeout(releaseTimeout);
    } else if (currentLength === 0 && prevLength > 0) {
      // Text is empty, clear keys
      setAnimatedKeys([]);
    }

    // Update ref to current length
    prevTextLengthRef.current = currentLength;
  }, [displayText, isComplete]);
  return (
    <svg width="100%" height="100%" viewBox="0 0 625 162" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      {/* Keyboard base */}
      <rect x="5" y="5" width="615" height="152" fill="none" stroke="currentColor" strokeWidth="2" rx="5" />

      {/* Function Row */}
      <rect x="20" y="20" width="25" height="16" fill="currentColor" className={`key ${pressedKey === 1 || animatedKeys.includes(1) ? 'key-pressed' : ''}`} rx="2" />
      <text x="32.5" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">ESC</text>

      <rect x="60" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 2 || animatedKeys.includes(2) ? 'key-pressed' : ''}`} rx="2" />
      <text x="70" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F1</text>
      <rect x="85" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 3 || animatedKeys.includes(3) ? 'key-pressed' : ''}`} rx="2" />
      <text x="95" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F2</text>
      <rect x="110" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 4 || animatedKeys.includes(4) ? 'key-pressed' : ''}`} rx="2" />
      <text x="120" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F3</text>
      <rect x="135" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 5 || animatedKeys.includes(5) ? 'key-pressed' : ''}`} rx="2" />
      <text x="145" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F4</text>

      <rect x="170" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 6 || animatedKeys.includes(6) ? 'key-pressed' : ''}`} rx="2" />
      <text x="180" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F5</text>
      <rect x="195" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 7 || animatedKeys.includes(7) ? 'key-pressed' : ''}`} rx="2" />
      <text x="205" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F6</text>
      <rect x="220" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 8 || animatedKeys.includes(8) ? 'key-pressed' : ''}`} rx="2" />
      <text x="230" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F7</text>
      <rect x="245" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 9 || animatedKeys.includes(9) ? 'key-pressed' : ''}`} rx="2" />
      <text x="255" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F8</text>

      <rect x="280" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 10 || animatedKeys.includes(10) ? 'key-pressed' : ''}`} rx="2" />
      <text x="290" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F9</text>
      <rect x="305" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 11 || animatedKeys.includes(11) ? 'key-pressed' : ''}`} rx="2" />
      <text x="315" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F10</text>
      <rect x="330" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 12 || animatedKeys.includes(12) ? 'key-pressed' : ''}`} rx="2" />
      <text x="340" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F11</text>
      <rect x="355" y="20" width="20" height="16" fill="currentColor" className={`key ${pressedKey === 13 || animatedKeys.includes(13) ? 'key-pressed' : ''}`} rx="2" />
      <text x="365" y="31" fontSize="6" fill="#0c1a0e" textAnchor="middle">F12</text>

      {/* Print Screen, Scroll Lock, Pause */}
      <rect x="395" y="20" width="25" height="16" fill="currentColor" className={`key ${pressedKey === 14 || animatedKeys.includes(14) ? 'key-pressed' : ''}`} rx="2" />
      <text x="407.5" y="31" fontSize="5" fill="#0c1a0e" textAnchor="middle">PRNT</text>
      <rect x="425" y="20" width="25" height="16" fill="currentColor" className={`key ${pressedKey === 15 || animatedKeys.includes(15) ? 'key-pressed' : ''}`} rx="2" />
      <text x="437.5" y="31" fontSize="5" fill="#0c1a0e" textAnchor="middle">SCRL</text>
      <rect x="455" y="20" width="25" height="16" fill="currentColor" className={`key ${pressedKey === 16 || animatedKeys.includes(16) ? 'key-pressed' : ''}`} rx="2" />
      <text x="467.5" y="31" fontSize="5" fill="#0c1a0e" textAnchor="middle">PAUS</text>

      {/* Number Row with symbols */}
      <rect x="20" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 17 || animatedKeys.includes(17) ? 'key-pressed' : ''}`} rx="2" />
      <text x="30" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">`</text>
      <rect x="45" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 18 || animatedKeys.includes(18) ? 'key-pressed' : ''}`} rx="2" />
      <text x="55" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">1</text>
      <rect x="70" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 19 || animatedKeys.includes(19) ? 'key-pressed' : ''}`} rx="2" />
      <text x="80" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">2</text>
      <rect x="95" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 20 || animatedKeys.includes(20) ? 'key-pressed' : ''}`} rx="2" />
      <text x="105" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">3</text>
      <rect x="120" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 21 || animatedKeys.includes(21) ? 'key-pressed' : ''}`} rx="2" />
      <text x="130" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">4</text>
      <rect x="145" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 22 || animatedKeys.includes(22) ? 'key-pressed' : ''}`} rx="2" />
      <text x="155" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">5</text>
      <rect x="170" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 23 || animatedKeys.includes(23) ? 'key-pressed' : ''}`} rx="2" />
      <text x="180" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">6</text>
      <rect x="195" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 24 || animatedKeys.includes(24) ? 'key-pressed' : ''}`} rx="2" />
      <text x="205" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">7</text>
      <rect x="220" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 25 || animatedKeys.includes(25) ? 'key-pressed' : ''}`} rx="2" />
      <text x="230" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">8</text>
      <rect x="245" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 26 || animatedKeys.includes(26) ? 'key-pressed' : ''}`} rx="2" />
      <text x="255" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">9</text>
      <rect x="270" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 27 || animatedKeys.includes(27) ? 'key-pressed' : ''}`} rx="2" />
      <text x="280" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">0</text>
      <rect x="295" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 28 || animatedKeys.includes(28) ? 'key-pressed' : ''}`} rx="2" />
      <text x="305" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">-</text>
      <rect x="320" y="42" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 29 || animatedKeys.includes(29) ? 'key-pressed' : ''}`} rx="2" />
      <text x="330" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">=</text>
      <rect x="345" y="42" width="30" height="18" fill="currentColor" className={`key ${pressedKey === 30 || animatedKeys.includes(30) ? 'key-pressed' : ''}`} rx="2" />
      <text x="360" y="54" fontSize="6" fill="#0c1a0e" textAnchor="middle">BKSP</text>

      {/* Insert, Home, PgUp */}
      <rect x="395" y="42" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 31 || animatedKeys.includes(31) ? 'key-pressed' : ''}`} rx="2" />
      <text x="407.5" y="54" fontSize="6" fill="#0c1a0e" textAnchor="middle">INS</text>
      <rect x="425" y="42" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 32 || animatedKeys.includes(32) ? 'key-pressed' : ''}`} rx="2" />
      <text x="437.5" y="54" fontSize="6" fill="#0c1a0e" textAnchor="middle">HOME</text>
      <rect x="455" y="42" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 33 || animatedKeys.includes(33) ? 'key-pressed' : ''}`} rx="2" />
      <text x="467.5" y="54" fontSize="6" fill="#0c1a0e" textAnchor="middle">PGUP</text>

      {/* Numpad Row 1 */}
      <rect x="500" y="42" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 34 || animatedKeys.includes(34) ? 'key-pressed' : ''}`} rx="2" />
      <text x="512.5" y="54" fontSize="6" fill="#0c1a0e" textAnchor="middle">NUM</text>
      <rect x="530" y="42" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 35 || animatedKeys.includes(35) ? 'key-pressed' : ''}`} rx="2" />
      <text x="542.5" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">/</text>
      <rect x="560" y="42" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 36 || animatedKeys.includes(36) ? 'key-pressed' : ''}`} rx="2" />
      <text x="572.5" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">*</text>
      <rect x="590" y="42" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 37 || animatedKeys.includes(37) ? 'key-pressed' : ''}`} rx="2" />
      <text x="602.5" y="54" fontSize="7" fill="#0c1a0e" textAnchor="middle">-</text>

      {/* QWERTY Row */}
      <rect x="20" y="65" width="30" height="18" fill="currentColor" className={`key ${pressedKey === 38 || animatedKeys.includes(38) ? 'key-pressed' : ''}`} rx="2" />
      <text x="35" y="77" fontSize="6" fill="#0c1a0e" textAnchor="middle">TAB</text>
      <rect x="55" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 39 || animatedKeys.includes(39) ? 'key-pressed' : ''}`} rx="2" />
      <text x="65" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">Q</text>
      <rect x="80" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 40 || animatedKeys.includes(40) ? 'key-pressed' : ''}`} rx="2" />
      <text x="90" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">W</text>
      <rect x="105" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 41 || animatedKeys.includes(41) ? 'key-pressed' : ''}`} rx="2" />
      <text x="115" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">E</text>
      <rect x="130" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 42 || animatedKeys.includes(42) ? 'key-pressed' : ''}`} rx="2" />
      <text x="140" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">R</text>
      <rect x="155" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 43 || animatedKeys.includes(43) ? 'key-pressed' : ''}`} rx="2" />
      <text x="165" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">T</text>
      <rect x="180" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 44 || animatedKeys.includes(44) ? 'key-pressed' : ''}`} rx="2" />
      <text x="190" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">Y</text>
      <rect x="205" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 45 || animatedKeys.includes(45) ? 'key-pressed' : ''}`} rx="2" />
      <text x="215" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">U</text>
      <rect x="230" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 46 || animatedKeys.includes(46) ? 'key-pressed' : ''}`} rx="2" />
      <text x="240" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">I</text>
      <rect x="255" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 47 || animatedKeys.includes(47) ? 'key-pressed' : ''}`} rx="2" />
      <text x="265" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">O</text>
      <rect x="280" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 48 || animatedKeys.includes(48) ? 'key-pressed' : ''}`} rx="2" />
      <text x="290" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">P</text>
      <rect x="305" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 49 || animatedKeys.includes(49) ? 'key-pressed' : ''}`} rx="2" />
      <text x="315" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">[</text>
      <rect x="330" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 50 || animatedKeys.includes(50) ? 'key-pressed' : ''}`} rx="2" />
      <text x="340" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">]</text>
      <rect x="355" y="65" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 51 || animatedKeys.includes(51) ? 'key-pressed' : ''}`} rx="2" />
      <text x="365" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">\</text>

      {/* Delete, End, PgDn */}
      <rect x="395" y="65" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 52 || animatedKeys.includes(52) ? 'key-pressed' : ''}`} rx="2" />
      <text x="407.5" y="77" fontSize="6" fill="#0c1a0e" textAnchor="middle">DEL</text>
      <rect x="425" y="65" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 53 || animatedKeys.includes(53) ? 'key-pressed' : ''}`} rx="2" />
      <text x="437.5" y="77" fontSize="6" fill="#0c1a0e" textAnchor="middle">END</text>
      <rect x="455" y="65" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 54 || animatedKeys.includes(54) ? 'key-pressed' : ''}`} rx="2" />
      <text x="467.5" y="77" fontSize="6" fill="#0c1a0e" textAnchor="middle">PGDN</text>

      {/* Numpad 7, 8, 9, + */}
      <rect x="500" y="65" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 55 || animatedKeys.includes(55) ? 'key-pressed' : ''}`} rx="2" />
      <text x="512.5" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">7</text>
      <rect x="530" y="65" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 56 || animatedKeys.includes(56) ? 'key-pressed' : ''}`} rx="2" />
      <text x="542.5" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">8</text>
      <rect x="560" y="65" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 57 || animatedKeys.includes(57) ? 'key-pressed' : ''}`} rx="2" />
      <text x="572.5" y="77" fontSize="7" fill="#0c1a0e" textAnchor="middle">9</text>
      <rect x="590" y="65" width="25" height="41" fill="currentColor" className={`key ${pressedKey === 58 || animatedKeys.includes(58) ? 'key-pressed' : ''}`} rx="2" />
      <text x="602.5" y="88" fontSize="7" fill="#0c1a0e" textAnchor="middle">+</text>

      {/* ASDF Row */}
      <rect x="20" y="88" width="35" height="18" fill="currentColor" className={`key ${pressedKey === 59 || animatedKeys.includes(59) ? 'key-pressed' : ''}`} rx="2" />
      <text x="37.5" y="100" fontSize="6" fill="#0c1a0e" textAnchor="middle">CAPS</text>
      <rect x="60" y="88" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 60 || animatedKeys.includes(60) ? 'key-pressed' : ''}`} rx="2" />
      <text x="70" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">A</text>
      <rect x="85" y="88" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 61 || animatedKeys.includes(61) ? 'key-pressed' : ''}`} rx="2" />
      <text x="95" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">S</text>
      <rect x="110" y="88" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 62 || animatedKeys.includes(62) ? 'key-pressed' : ''}`} rx="2" />
      <text x="120" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">D</text>
      <rect x="135" y="88" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 63 || animatedKeys.includes(63) ? 'key-pressed' : ''}`} rx="2" />
      <text x="145" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">F</text>
      <rect x="160" y="88" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 64 || animatedKeys.includes(64) ? 'key-pressed' : ''}`} rx="2" />
      <text x="170" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">G</text>
      <rect x="185" y="88" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 65 || animatedKeys.includes(65) ? 'key-pressed' : ''}`} rx="2" />
      <text x="195" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">H</text>
      <rect x="210" y="88" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 66 || animatedKeys.includes(66) ? 'key-pressed' : ''}`} rx="2" />
      <text x="220" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">J</text>
      <rect x="235" y="88" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 67 || animatedKeys.includes(67) ? 'key-pressed' : ''}`} rx="2" />
      <text x="245" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">K</text>
      <rect x="260" y="88" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 68 || animatedKeys.includes(68) ? 'key-pressed' : ''}`} rx="2" />
      <text x="270" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">L</text>
      <rect x="285" y="88" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 69 || animatedKeys.includes(69) ? 'key-pressed' : ''}`} rx="2" />
      <text x="295" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">;</text>
      <rect x="310" y="88" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 70 || animatedKeys.includes(70) ? 'key-pressed' : ''}`} rx="2" />
      <text x="320" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">'</text>
      <rect x="335" y="88" width="40" height="18" fill="currentColor" className={`key ${pressedKey === 71 || animatedKeys.includes(71) ? 'key-pressed' : ''}`} rx="2" />
      <text x="355" y="100" fontSize="6" fill="#0c1a0e" textAnchor="middle">ENTER</text>

      {/* Numpad 4, 5, 6 */}
      <rect x="500" y="88" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 72 || animatedKeys.includes(72) ? 'key-pressed' : ''}`} rx="2" />
      <text x="512.5" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">4</text>
      <rect x="530" y="88" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 73 || animatedKeys.includes(73) ? 'key-pressed' : ''}`} rx="2" />
      <text x="542.5" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">5</text>
      <rect x="560" y="88" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 74 || animatedKeys.includes(74) ? 'key-pressed' : ''}`} rx="2" />
      <text x="572.5" y="100" fontSize="7" fill="#0c1a0e" textAnchor="middle">6</text>

      {/* ZXCV Row */}
      <rect x="20" y="111" width="45" height="18" fill="currentColor" className={`key ${pressedKey === 75 || animatedKeys.includes(75) ? 'key-pressed' : ''}`} rx="2" />
      <text x="42.5" y="123" fontSize="6" fill="#0c1a0e" textAnchor="middle">SHIFT</text>
      <rect x="70" y="111" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 76 || animatedKeys.includes(76) ? 'key-pressed' : ''}`} rx="2" />
      <text x="80" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">Z</text>
      <rect x="95" y="111" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 77 || animatedKeys.includes(77) ? 'key-pressed' : ''}`} rx="2" />
      <text x="105" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">X</text>
      <rect x="120" y="111" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 78 || animatedKeys.includes(78) ? 'key-pressed' : ''}`} rx="2" />
      <text x="130" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">C</text>
      <rect x="145" y="111" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 79 || animatedKeys.includes(79) ? 'key-pressed' : ''}`} rx="2" />
      <text x="155" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">V</text>
      <rect x="170" y="111" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 80 || animatedKeys.includes(80) ? 'key-pressed' : ''}`} rx="2" />
      <text x="180" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">B</text>
      <rect x="195" y="111" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 81 || animatedKeys.includes(81) ? 'key-pressed' : ''}`} rx="2" />
      <text x="205" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">N</text>
      <rect x="220" y="111" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 82 || animatedKeys.includes(82) ? 'key-pressed' : ''}`} rx="2" />
      <text x="230" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">M</text>
      <rect x="245" y="111" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 83 || animatedKeys.includes(83) ? 'key-pressed' : ''}`} rx="2" />
      <text x="255" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">,</text>
      <rect x="270" y="111" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 84 || animatedKeys.includes(84) ? 'key-pressed' : ''}`} rx="2" />
      <text x="280" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">.</text>
      <rect x="295" y="111" width="20" height="18" fill="currentColor" className={`key ${pressedKey === 85 || animatedKeys.includes(85) ? 'key-pressed' : ''}`} rx="2" />
      <text x="305" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">/</text>
      <rect x="320" y="111" width="55" height="18" fill="currentColor" className={`key ${pressedKey === 86 || animatedKeys.includes(86) ? 'key-pressed' : ''}`} rx="2" />
      <text x="347.5" y="123" fontSize="6" fill="#0c1a0e" textAnchor="middle">SHIFT</text>

      {/* Arrow Up */}
      <rect x="425" y="111" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 87 || animatedKeys.includes(87) ? 'key-pressed' : ''}`} rx="2" />
      <text x="437.5" y="123" fontSize="6" fill="#0c1a0e" textAnchor="middle">↑</text>

      {/* Numpad 1, 2, 3, Enter */}
      <rect x="500" y="111" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 88 || animatedKeys.includes(88) ? 'key-pressed' : ''}`} rx="2" />
      <text x="512.5" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">1</text>
      <rect x="530" y="111" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 89 || animatedKeys.includes(89) ? 'key-pressed' : ''}`} rx="2" />
      <text x="542.5" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">2</text>
      <rect x="560" y="111" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 90 || animatedKeys.includes(90) ? 'key-pressed' : ''}`} rx="2" />
      <text x="572.5" y="123" fontSize="7" fill="#0c1a0e" textAnchor="middle">3</text>
      <rect x="590" y="111" width="25" height="41" fill="currentColor" className={`key ${pressedKey === 91 || animatedKeys.includes(91) ? 'key-pressed' : ''}`} rx="2" />
      <text x="602.5" y="134" fontSize="6" fill="#0c1a0e" textAnchor="middle">ENTR</text>

      {/* Bottom Row: CTRL, WIN, ALT, SPACE, ALT, WIN, MENU, CTRL */}
      <rect x="20" y="134" width="30" height="18" fill="currentColor" className={`key ${pressedKey === 92 || animatedKeys.includes(92) ? 'key-pressed' : ''}`} rx="2" />
      <text x="35" y="146" fontSize="6" fill="#0c1a0e" textAnchor="middle">CTRL</text>
      <rect x="55" y="134" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 93 || animatedKeys.includes(93) ? 'key-pressed' : ''}`} rx="2" />
      <text x="67.5" y="146" fontSize="6" fill="#0c1a0e" textAnchor="middle">WIN</text>
      <rect x="85" y="134" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 94 || animatedKeys.includes(94) ? 'key-pressed' : ''}`} rx="2" />
      <text x="97.5" y="146" fontSize="6" fill="#0c1a0e" textAnchor="middle">ALT</text>
      <rect x="115" y="134" width="150" height="18" fill="currentColor" className={`key ${pressedKey === 95 || animatedKeys.includes(95) ? 'key-pressed' : ''}`} rx="2" />
      <text x="190" y="146" fontSize="7" fill="#0c1a0e" textAnchor="middle">SPACE</text>
      <rect x="270" y="134" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 96 || animatedKeys.includes(96) ? 'key-pressed' : ''}`} rx="2" />
      <text x="282.5" y="146" fontSize="6" fill="#0c1a0e" textAnchor="middle">ALT</text>
      <rect x="300" y="134" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 97 || animatedKeys.includes(97) ? 'key-pressed' : ''}`} rx="2" />
      <text x="312.5" y="146" fontSize="6" fill="#0c1a0e" textAnchor="middle">WIN</text>
      <rect x="330" y="134" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 98 || animatedKeys.includes(98) ? 'key-pressed' : ''}`} rx="2" />
      <text x="342.5" y="146" fontSize="6" fill="#0c1a0e" textAnchor="middle">MNU</text>
      <rect x="360" y="134" width="30" height="18" fill="currentColor" className={`key ${pressedKey === 99 || animatedKeys.includes(99) ? 'key-pressed' : ''}`} rx="2" />
      <text x="375" y="146" fontSize="6" fill="#0c1a0e" textAnchor="middle">CTRL</text>

      {/* Arrow Left, Down, Right */}
      <rect x="395" y="134" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 100 || animatedKeys.includes(100) ? 'key-pressed' : ''}`} rx="2" />
      <text x="407.5" y="146" fontSize="6" fill="#0c1a0e" textAnchor="middle">←</text>
      <rect x="425" y="134" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 101 || animatedKeys.includes(101) ? 'key-pressed' : ''}`} rx="2" />
      <text x="437.5" y="146" fontSize="6" fill="#0c1a0e" textAnchor="middle">↓</text>
      <rect x="455" y="134" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 102 || animatedKeys.includes(102) ? 'key-pressed' : ''}`} rx="2" />
      <text x="467.5" y="146" fontSize="6" fill="#0c1a0e" textAnchor="middle">→</text>

      {/* Numpad 0, . */}
      <rect x="500" y="134" width="55" height="18" fill="currentColor" className={`key ${pressedKey === 103 || animatedKeys.includes(103) ? 'key-pressed' : ''}`} rx="2" />
      <text x="527.5" y="146" fontSize="7" fill="#0c1a0e" textAnchor="middle">0</text>
      <rect x="560" y="134" width="25" height="18" fill="currentColor" className={`key ${pressedKey === 104 || animatedKeys.includes(104) ? 'key-pressed' : ''}`} rx="2" />
      <text x="572.5" y="146" fontSize="7" fill="#0c1a0e" textAnchor="middle">.</text>
    </svg>
  );
}
