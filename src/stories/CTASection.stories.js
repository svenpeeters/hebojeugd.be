import './CTASection.css';

export default {
  title: 'Components/CTASection',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'CTA title text',
    },
    buttonText: {
      control: 'text',
      description: 'Button label',
    },
    buttonHref: {
      control: 'text',
      description: 'Button link',
    },
    variant: {
      control: 'select',
      options: ['red', 'navy'],
      description: 'Color variant',
    },
  },
};

const createCTASection = ({ 
  title = 'Klaar om<br/>mee te doen?', 
  buttonText = 'Bekijk wedstrijden', 
  buttonHref = '#',
  variant = 'red'
}) => {
  const container = document.createElement('section');
  container.className = `cta cta--${variant}`;
  container.innerHTML = `
    <div class="cta__container">
      <div class="cta__content">
        <h2 class="cta__title">${title}</h2>
        <a href="${buttonHref}" class="cta__button">
          <span>${buttonText}</span>
          <span class="cta__arrow">→</span>
        </a>
      </div>
    </div>
  `;
  return container;
};

export const Default = {
  render: (args) => createCTASection(args),
  args: {
    title: 'Klaar om<br/>mee te doen?',
    buttonText: 'Bekijk wedstrijden',
    buttonHref: '#',
    variant: 'red',
  },
};

export const NavyVariant = {
  render: (args) => createCTASection(args),
  args: {
    title: 'Ontmoet onze trainers',
    buttonText: 'Trainersstaf bekijken →',
    buttonHref: '/trainers',
    variant: 'navy',
  },
};

export const ContactCTA = {
  render: (args) => createCTASection(args),
  args: {
    title: 'Klaar om te starten?',
    buttonText: 'Contact opnemen →',
    buttonHref: 'mailto:info@hebojeugd.be',
    variant: 'red',
  },
};
