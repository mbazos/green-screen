// Modal customization module

let modalBackdrop: HTMLElement | null = null;
let modalContent: HTMLElement | null = null;
let customizeBtn: HTMLElement | null = null;
let closeBtn: HTMLElement | null = null;
let cancelBtn: HTMLElement | null = null;
let form: HTMLFormElement | null = null;

// Form inputs
let startDateInput: HTMLInputElement | null = null;
let endDateInput: HTMLInputElement | null = null;
let titleInput: HTMLInputElement | null = null;
let showKeyboardInput: HTMLInputElement | null = null;
let messagesInput: HTMLTextAreaElement | null = null;
let footerTextInput: HTMLInputElement | null = null;
let footerUrlInput: HTMLInputElement | null = null;

// Store original values to use as fallbacks
let originalStartDate: string = '';
let originalEndDate: string = '';
let originalTitle: string = '';
let originalShowKeyboard: boolean = true;
let originalMessages: string[] = [];
let originalFooterText: string = '';
let originalFooterUrl: string = '';

function openModal() {
  if (modalBackdrop) {
    modalBackdrop.classList.remove('hidden');
  }
}

function closeModal() {
  if (modalBackdrop) {
    modalBackdrop.classList.add('hidden');
  }
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === modalBackdrop) {
    closeModal();
  }
}

function handleSubmit(e: Event) {
  e.preventDefault();

  if (!startDateInput || !endDateInput || !titleInput || !showKeyboardInput || !messagesInput || !footerTextInput || !footerUrlInput) {
    return;
  }

  // Build query parameters
  const params = new URLSearchParams();

  // Dates: Only set if the input has a value, otherwise use original
  const startDateValue = startDateInput.value
    ? `${startDateInput.value}-01T12:00:00`
    : originalStartDate;
  const endDateValue = endDateInput.value
    ? `${endDateInput.value}-01T12:00:00`
    : originalEndDate;

  params.set('startDate', startDateValue);
  params.set('endDate', endDateValue);

  // Title: Always use current input value (can be empty to hide)
  params.set('title', titleInput.value.trim());

  // Keyboard visibility
  const showKeyboardValue = showKeyboardInput.checked;
  params.set('showKeyboard', showKeyboardValue.toString());

  // Messages: Always use current input value (can be empty to hide)
  const messagesArray = messagesInput.value.trim()
    ? messagesInput.value.split('\n').filter(m => m.trim() !== '')
    : [];
  params.set('messages', encodeURIComponent(JSON.stringify(messagesArray)));

  // Footer: Always use current input values (can be empty to hide)
  params.set('footerText', footerTextInput.value.trim());
  params.set('footerUrl', footerUrlInput.value.trim() || originalFooterUrl);

  // Reload with new params
  window.location.href = `${window.location.pathname}?${params.toString()}`;
}

export function initModal(
  startDate: string,
  endDate: string,
  title: string,
  showKeyboard: boolean,
  messages: string[],
  footerText: string,
  footerUrl: string
) {
  // Store original values for fallback when fields are empty
  originalStartDate = startDate;
  originalEndDate = endDate;
  originalTitle = title;
  originalShowKeyboard = showKeyboard;
  originalMessages = messages;
  originalFooterText = footerText;
  originalFooterUrl = footerUrl;

  // Get DOM elements
  modalBackdrop = document.getElementById('modal-backdrop');
  modalContent = document.getElementById('modal-content');
  customizeBtn = document.getElementById('customize-btn');
  closeBtn = document.getElementById('modal-close');
  cancelBtn = document.getElementById('modal-cancel');
  form = document.getElementById('customize-form') as HTMLFormElement;

  startDateInput = document.getElementById('form-start-date') as HTMLInputElement;
  endDateInput = document.getElementById('form-end-date') as HTMLInputElement;
  titleInput = document.getElementById('form-title') as HTMLInputElement;
  showKeyboardInput = document.getElementById('form-show-keyboard') as HTMLInputElement;
  messagesInput = document.getElementById('form-messages') as HTMLTextAreaElement;
  footerTextInput = document.getElementById('form-footer-text') as HTMLInputElement;
  footerUrlInput = document.getElementById('form-footer-url') as HTMLInputElement;

  // Populate form with current values
  if (startDateInput) startDateInput.value = startDate.slice(0, 7); // YYYY-MM
  if (endDateInput) endDateInput.value = endDate.slice(0, 7); // YYYY-MM
  if (titleInput) titleInput.value = title;
  if (showKeyboardInput) showKeyboardInput.checked = showKeyboard;
  if (messagesInput) messagesInput.value = messages.join('\n');
  if (footerTextInput) footerTextInput.value = footerText;
  if (footerUrlInput) footerUrlInput.value = footerUrl;

  // Attach event listeners
  if (customizeBtn) {
    customizeBtn.addEventListener('click', openModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', handleBackdropClick);
  }

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  // Stop propagation on modal content to prevent backdrop click
  if (modalContent) {
    modalContent.addEventListener('click', (e) => e.stopPropagation());
  }
}
