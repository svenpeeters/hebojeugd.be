import './ContactCard.css';

export default {
  title: 'Components/ContactCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title',
    },
    description: {
      control: 'text',
      description: 'Card description',
    },
    buttonText: {
      control: 'text',
      description: 'Button/email text',
    },
    buttonHref: {
      control: 'text',
      description: 'Button link',
    },
    imageSrc: {
      control: 'text',
      description: 'Image URL for the figure',
    },
    imageAlt: {
      control: 'text',
      description: 'Image alt text',
    },
  },
};

const createContactCard = ({ 
  title = 'Vragen over de sportieve werking?',
  description = 'Timothy en de leden van de sportieve cel helpen je graag verder!',
  buttonText = 'timothy@hebojeugd.be',
  buttonHref = 'mailto:timothy@hebojeugd.be',
  imageSrc = '/images/jeugdwerking-contact.png',
  imageAlt = 'Timothy'
}) => {
  const container = document.createElement('div');
  container.className = 'contact-card';
  container.innerHTML = `
    <div class="contact-card__info">
      <h3 class="contact-card__title">${title}</h3>
      <p class="contact-card__text">${description}</p>
      <a href="${buttonHref}" class="contact-card__button">${buttonText}</a>
    </div>
    <div class="contact-card__figure">
      <div class="contact-card__figure-inner">
        <img src="${imageSrc}" alt="${imageAlt}" class="contact-card__avatar" />
      </div>
    </div>
  `;
  return container;
};

export const Default = {
  render: (args) => createContactCard(args),
  args: {
    title: 'Vragen over de sportieve werking?',
    description: 'Timothy en de leden van de sportieve cel helpen je graag verder!',
    buttonText: 'timothy@hebojeugd.be',
    buttonHref: 'mailto:timothy@hebojeugd.be',
    imageSrc: 'https://placehold.co/200x340/1e3264/ffffff?text=Contact',
    imageAlt: 'Timothy',
  },
};

export const AlternativeContact = {
  render: (args) => createContactCard(args),
  args: {
    title: 'Vragen over inschrijvingen?',
    description: 'Neem contact op met ons secretariaat voor alle administratieve vragen.',
    buttonText: 'info@hebojeugd.be',
    buttonHref: 'mailto:info@hebojeugd.be',
    imageSrc: 'https://placehold.co/200x340/c8202f/ffffff?text=Info',
    imageAlt: 'Secretariaat',
  },
};
