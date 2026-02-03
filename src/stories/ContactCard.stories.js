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

export const Timothy = {
  render: (args) => createContactCard(args),
  args: {
    title: 'Vragen over de sportieve werking?',
    description: 'Timothy en de leden van de sportieve cel helpen je graag verder!',
    buttonText: 'timothy@hebojeugd.be',
    buttonHref: 'mailto:timothy@hebojeugd.be',
    imageSrc: '/images/jeugdwerking-contact.png',
    imageAlt: 'Timothy',
  },
};

export const Jurgen = {
  render: (args) => createContactCard(args),
  args: {
    title: 'Vragen over kledij?',
    description: 'Spreek gerust Jurgen aan of stuur een mailtje. Hij helpt je graag verder!',
    buttonText: 'jurgen@hebojeugd.be',
    buttonHref: 'mailto:jurgen@hebojeugd.be',
    imageSrc: '/images/kledij-contact.png',
    imageAlt: 'Jurgen',
  },
};
