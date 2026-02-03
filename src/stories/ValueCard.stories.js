import './ValueCard.css';

export default {
  title: 'Components/ValueCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Value title',
    },
    description: {
      control: 'text',
      description: 'Value description',
    },
    isFeatured: {
      control: 'boolean',
      description: 'Use featured (navy) styling',
    },
  },
};

const createValueCard = ({ 
  title = 'Respect',
  description = 'Voor jezelf, je team, je tegenstander.',
  isFeatured = false
}) => {
  const container = document.createElement('div');
  container.className = `value-card ${isFeatured ? 'value-card--featured' : ''}`;
  container.innerHTML = `
    <h3 class="value-card__title">${title}</h3>
    <p class="value-card__desc">${description}</p>
  `;
  return container;
};

export const Default = {
  render: (args) => createValueCard(args),
  args: {
    title: 'Respect',
    description: 'Voor jezelf, je team, je tegenstander.',
    isFeatured: false,
  },
};

export const Featured = {
  render: (args) => createValueCard(args),
  args: {
    title: 'Teamgeest',
    description: 'Alleen ga je sneller. Samen kom je verder.',
    isFeatured: true,
  },
};

// Values grid
const createValuesGrid = ({ values }) => {
  const container = document.createElement('div');
  container.className = 'values-grid';
  container.innerHTML = values.map(v => `
    <div class="value-card ${v.isFeatured ? 'value-card--featured' : ''}">
      <h3 class="value-card__title">${v.title}</h3>
      <p class="value-card__desc">${v.description}</p>
    </div>
  `).join('');
  return container;
};

export const ValuesGrid = {
  render: (args) => createValuesGrid(args),
  args: {
    values: [
      { title: 'Respect', description: 'Voor jezelf, je team, je tegenstander.', isFeatured: false },
      { title: 'Teamgeest', description: 'Alleen ga je sneller. Samen kom je verder.', isFeatured: true },
      { title: 'Plezier', description: 'Want waarom spelen we anders?', isFeatured: false },
    ],
  },
};
