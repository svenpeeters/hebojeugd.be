import './TournamentInfo.css';

export default {
  title: 'Components/TournamentInfo',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    cards: {
      control: 'object',
      description: 'Array of info cards',
    },
  },
};

const createTournamentInfo = ({ 
  cards = [
    { title: 'Wanneer', content: 'Dinsdag 7 april\nWoensdag 8 april\nDonderdag 9 april\n<strong>18:00 - 21:00</strong>', variant: 'default' },
    { title: 'Waar', content: '<strong>Gelindenstraat\n3870 Heers</strong>', variant: 'featured' },
  ]
}) => {
  const container = document.createElement('div');
  container.className = 'tournament-info';
  container.innerHTML = cards.map(card => `
    <div class="tournament-info__card tournament-info__card--${card.variant}">
      <h3 class="tournament-info__title">${card.title}</h3>
      <p class="tournament-info__content">${card.content.replace(/\n/g, '<br/>')}</p>
    </div>
  `).join('');
  return container;
};

export const Default = {
  render: (args) => createTournamentInfo(args),
  args: {
    cards: [
      { title: 'Wanneer', content: 'Dinsdag 7 april\nWoensdag 8 april\nDonderdag 9 april\n<strong>18:00 - 21:00</strong>', variant: 'default' },
      { title: 'Waar', content: '<strong>Gelindenstraat\n3870 Heers</strong>', variant: 'featured' },
    ],
  },
};

export const SingleCard = {
  render: (args) => {
    const container = document.createElement('div');
    container.className = `tournament-info__card tournament-info__card--${args.variant}`;
    container.innerHTML = `
      <h3 class="tournament-info__title">${args.title}</h3>
      <p class="tournament-info__content">${args.content.replace(/\n/g, '<br/>')}</p>
    `;
    return container;
  },
  args: {
    title: 'Wanneer',
    content: 'Dinsdag 7 april\nWoensdag 8 april\nDonderdag 9 april\n<strong>18:00 - 21:00</strong>',
    variant: 'default',
  },
};

export const FeaturedCard = {
  render: (args) => {
    const container = document.createElement('div');
    container.className = `tournament-info__card tournament-info__card--${args.variant}`;
    container.innerHTML = `
      <h3 class="tournament-info__title">${args.title}</h3>
      <p class="tournament-info__content">${args.content.replace(/\n/g, '<br/>')}</p>
    `;
    return container;
  },
  args: {
    title: 'Waar',
    content: '<strong>Gelindenstraat\n3870 Heers</strong>',
    variant: 'featured',
  },
};
