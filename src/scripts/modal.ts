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
let messagesInput: HTMLTextAreaElement | null = null;
let footerTextInput: HTMLInputElement | null = null;
let footerUrlInput: HTMLInputElement | null = null;

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

  if (!startDateInput || !endDateInput || !messagesInput || !footerTextInput || !footerUrlInput) {
    return;
  }

  // Build query parameters
  const params = new URLSearchParams();

  // Append day (1st) and time (noon) to the month/year
  params.set('startDate', `${startDateInput.value}-01T12:00:00`);
  params.set('endDate', `${endDateInput.value}-01T12:00:00`);

  // Convert messages from newline-separated to JSON array
  const messagesArray = messagesInput.value
    .split('\n')
    .filter(m => m.trim() !== '');
  params.set('messages', encodeURIComponent(JSON.stringify(messagesArray)));

  params.set('footerText', footerTextInput.value);
  params.set('footerUrl', footerUrlInput.value);

  // Reload with new params
  window.location.href = `${window.location.pathname}?${params.toString()}`;
}

export function initModal(
  startDate: string,
  endDate: string,
  messages: string[],
  footerText: string,
  footerUrl: string
) {
  // Get DOM elements
  modalBackdrop = document.getElementById('modal-backdrop');
  modalContent = document.getElementById('modal-content');
  customizeBtn = document.getElementById('customize-btn');
  closeBtn = document.getElementById('modal-close');
  cancelBtn = document.getElementById('modal-cancel');
  form = document.getElementById('customize-form') as HTMLFormElement;

  startDateInput = document.getElementById('form-start-date') as HTMLInputElement;
  endDateInput = document.getElementById('form-end-date') as HTMLInputElement;
  messagesInput = document.getElementById('form-messages') as HTMLTextAreaElement;
  footerTextInput = document.getElementById('form-footer-text') as HTMLInputElement;
  footerUrlInput = document.getElementById('form-footer-url') as HTMLInputElement;

  // Populate form with current values
  if (startDateInput) startDateInput.value = startDate.slice(0, 7); // YYYY-MM
  if (endDateInput) endDateInput.value = endDate.slice(0, 7); // YYYY-MM
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
