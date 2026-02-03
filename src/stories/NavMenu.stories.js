import './NavMenu.css';

export default {
  title: 'Components/NavMenu',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the menu overlay is open',
    },
  },
};

const createNavMenu = ({ isOpen = false }) => {
  const container = document.createElement('div');
  container.innerHTML = `
    <button class="nav-toggle ${isOpen ? 'nav-toggle--open' : ''}" aria-label="Menu">
      <span class="nav-toggle__line"></span>
      <span class="nav-toggle__line"></span>
      <span class="nav-toggle__line"></span>
    </button>
    
    <nav class="nav-overlay ${isOpen ? 'nav-overlay--open' : ''}">
      <div class="nav-overlay__content">
        <a href="/" class="nav-overlay__link">Home</a>
        <a href="/jeugdwerking" class="nav-overlay__link">Jeugdwerking</a>
        <a href="/trainers" class="nav-overlay__link">Trainers</a>
        <a href="/kalender" class="nav-overlay__link">Kalender</a>
        <a href="/inschrijven" class="nav-overlay__link">Inschrijven</a>
        <a href="/paastoernooi" class="nav-overlay__link nav-overlay__link--accent">Paastoernooi</a>
      </div>
    </nav>
  `;

  // Add toggle functionality
  const toggle = container.querySelector('.nav-toggle');
  const overlay = container.querySelector('.nav-overlay');
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('nav-toggle--open');
    overlay.classList.toggle('nav-overlay--open');
  });

  return container;
};

export const Closed = {
  render: (args) => createNavMenu(args),
  args: {
    isOpen: false,
  },
};

export const Open = {
  render: (args) => createNavMenu(args),
  args: {
    isOpen: true,
  },
};
