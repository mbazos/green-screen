// Client-side query parameter parsing module

interface PageParams {
  startDate: string;
  endDate: string;
  title: string;
  showTitle: boolean;
  showKeyboard: boolean;
  footerText: string;
  showFooter: boolean;
  footerUrl: string;
  messages: string[];
  showMessages: boolean;
}

const defaultMessages = [
  'Application Developer Single Sign On (SSO) - 2006',
  'Senior Application Developer EAS - 2008',
  'Senior Application Developer SE&I - 2011',
  'Senior Software Engineer Rental Car Services - 2013',
  'Principal Engineer Rental Car Services - 2016',
  'Distinguished Engineer Rental Car Services - 2018',
  'Senior Director Rental Car Services - 2024',
  'Mobility Search & Book Development Manager - 2025',
];

export function parseQueryParams(): PageParams {
  const urlParams = new URLSearchParams(window.location.search);

  const startDate = urlParams.get('startDate') || '2006-06-01T12:00:00';
  const endDate = urlParams.get('endDate') || '2046-06-01T12:00:00';
  const titleParam = urlParams.get('title');
  const title = titleParam !== null && titleParam.trim() !== '' ? titleParam : 'Retirement Countdown';
  const showTitle = titleParam === null || titleParam.trim() !== ''; // Hide only if explicitly set to empty
  const showKeyboard = urlParams.get('showKeyboard') !== 'false'; // Default to true
  const footerTextParam = urlParams.get('footerText');
  const footerText = footerTextParam !== null && footerTextParam.trim() !== '' ? footerTextParam : 'Michael Bazos';
  const showFooter = footerTextParam === null || footerTextParam.trim() !== ''; // Hide only if explicitly set to empty
  const footerUrl = urlParams.get('footerUrl') || 'https://michaelbazos.com/';

  // Parse messages from JSON or use defaults
  let messages = defaultMessages;
  const messagesParam = urlParams.get('messages');
  if (messagesParam !== null) {
    try {
      const parsed = JSON.parse(decodeURIComponent(messagesParam));
      if (Array.isArray(parsed)) {
        messages = parsed;
      }
    } catch (e) {
      console.error('Failed to parse messages parameter:', e);
    }
  }
  const showMessages = messages.length > 0;

  return {
    startDate,
    endDate,
    title,
    showTitle,
    showKeyboard,
    footerText,
    showFooter,
    footerUrl,
    messages,
    showMessages,
  };
}

export function applyParamsToPage(params: PageParams): void {
  const container = document.getElementById('app-container');
  if (container) {
    container.dataset.startDate = params.startDate;
    container.dataset.endDate = params.endDate;
    container.dataset.title = params.title;
    container.dataset.showKeyboard = params.showKeyboard.toString();
    container.dataset.messages = JSON.stringify(params.messages);
    container.dataset.footerText = params.footerText;
    container.dataset.footerUrl = params.footerUrl;
  }

  // Update title
  const titleElement = document.getElementById('countdown-title');
  if (titleElement) {
    titleElement.textContent = params.title;
    titleElement.parentElement?.classList.toggle('hidden', !params.showTitle);
  }

  // Update footer
  const footerLink = document.getElementById('footer-link') as HTMLAnchorElement;
  if (footerLink) {
    footerLink.textContent = params.footerText;
    footerLink.href = params.footerUrl;
    footerLink.parentElement?.classList.toggle('hidden', !params.showFooter);
  }

  // Update keyboard visibility
  const keyboardContainer = document.querySelector('.keyboard-typing-container');
  if (keyboardContainer) {
    keyboardContainer.classList.toggle('hidden', !params.showKeyboard);
  }

  // Update messages visibility
  const messagesContainer = document.querySelector('.mt-6.sm\\:mt-8.h-\\[3\\.5rem\\]');
  if (messagesContainer) {
    messagesContainer.classList.toggle('hidden', !params.showMessages);
  }

  const typingCursor = document.querySelector('.typing-cursor');
  if (typingCursor) {
    typingCursor.classList.toggle('hidden', !params.showMessages);
  }
}
