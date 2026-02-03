import './BentoGrid.css';

export default {
  title: 'Components/BentoGrid',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    cards: {
      control: 'object',
      description: 'Array of bento card data',
    },
  },
};

const createBentoGrid = ({ 
  cards = [
    { day: '7', month: 'april', weekday: 'Dinsdag', time: '18:00 — 20:30', categories: ['U6', 'U8', 'U10'], formats: ['2vs2', '5vs5', '8vs8'], variant: 'navy' },
    { day: '8', month: 'april', weekday: 'Woensdag', time: '18:00 — 20:30', categories: ['U7', 'U9', 'U11'], formats: ['3vs3', '5vs5', '8vs8'], variant: 'default' },
    { day: '9', month: 'april', weekday: 'Donderdag', time: '18:00 — 21:00', categories: ['U12', 'U13'], formats: ['8vs8 formaat'], variant: 'red' },
  ]
}) => {
  const container = document.createElement('div');
  container.className = 'bento-grid';
  container.innerHTML = cards.map((card, i) => `
    <div class="bento-card bento-card--${card.variant} ${i === 0 ? 'bento-card--large' : ''}">
      <div class="bento-card__header">
        <div class="bento-card__date">
          <span class="bento-card__day">${card.day}</span>
          <span class="bento-card__month">${card.month}</span>
        </div>
        <span class="bento-card__weekday">${card.weekday}</span>
      </div>
      <div class="bento-card__info">
        <div class="bento-card__time">${card.time}</div>
        <div class="bento-card__categories">
          ${card.categories.map(c => `<span class="bento-card__badge">${c}</span>`).join('')}
        </div>
        <div class="bento-card__formats">
          ${card.formats.map(f => `<span>${f}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
  return container;
};

export const Default = {
  render: (args) => createBentoGrid(args),
  args: {
    cards: [
      { day: '7', month: 'april', weekday: 'Dinsdag', time: '18:00 — 20:30', categories: ['U6', 'U8', 'U10'], formats: ['2vs2', '5vs5', '8vs8'], variant: 'navy' },
      { day: '8', month: 'april', weekday: 'Woensdag', time: '18:00 — 20:30', categories: ['U7', 'U9', 'U11'], formats: ['3vs3', '5vs5', '8vs8'], variant: 'default' },
      { day: '9', month: 'april', weekday: 'Donderdag', time: '18:00 — 21:00', categories: ['U12', 'U13'], formats: ['8vs8 formaat'], variant: 'red' },
    ],
  },
};

// Single bento card
const createBentoCard = ({ day, month, weekday, time, categories, formats, variant }) => {
  const container = document.createElement('div');
  container.className = `bento-card bento-card--${variant}`;
  container.innerHTML = `
    <div class="bento-card__header">
      <div class="bento-card__date">
        <span class="bento-card__day">${day}</span>
        <span class="bento-card__month">${month}</span>
      </div>
      <span class="bento-card__weekday">${weekday}</span>
    </div>
    <div class="bento-card__info">
      <div class="bento-card__time">${time}</div>
      <div class="bento-card__categories">
        ${categories.map(c => `<span class="bento-card__badge">${c}</span>`).join('')}
      </div>
      <div class="bento-card__formats">
        ${formats.map(f => `<span>${f}</span>`).join('')}
      </div>
    </div>
  `;
  return container;
};

export const SingleNavy = {
  render: (args) => createBentoCard(args),
  args: {
    day: '7',
    month: 'april',
    weekday: 'Dinsdag',
    time: '18:00 — 20:30',
    categories: ['U6', 'U8', 'U10'],
    formats: ['2vs2', '5vs5', '8vs8'],
    variant: 'navy',
  },
};

export const SingleRed = {
  render: (args) => createBentoCard(args),
  args: {
    day: '9',
    month: 'april',
    weekday: 'Donderdag',
    time: '18:00 — 21:00',
    categories: ['U12', 'U13'],
    formats: ['8vs8 formaat'],
    variant: 'red',
  },
};
