import './NeededItems.css';

export default {
  title: 'Components/NeededItems',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of needed items with icon and text',
    },
  },
};

const createNeededItems = ({ 
  items = [
    { icon: '👟', text: 'Voetbalschoenen' },
    { icon: '🦵', text: 'Scheenbeschermers' },
    { icon: '🧥', text: 'Trainingskledij / Regenjas / Winterjas' },
    { icon: '🏠', text: 'Indoorschoenen voor indoortrainingen' },
  ]
}) => {
  const container = document.createElement('div');
  container.className = 'needed-items';
  container.innerHTML = `
    <div class="needed-items__grid">
      ${items.map(item => `
        <div class="needed-items__item">
          <span class="needed-items__icon">${item.icon}</span>
          <span class="needed-items__text">${item.text}</span>
        </div>
      `).join('')}
    </div>
  `;
  return container;
};

export const Default = {
  render: (args) => createNeededItems(args),
  args: {
    items: [
      { icon: '👟', text: 'Voetbalschoenen' },
      { icon: '🦵', text: 'Scheenbeschermers' },
      { icon: '🧥', text: 'Trainingskledij / Regenjas / Winterjas' },
      { icon: '🏠', text: 'Indoorschoenen voor indoortrainingen' },
    ],
  },
};

export const Minimal = {
  render: (args) => createNeededItems(args),
  args: {
    items: [
      { icon: '👟', text: 'Voetbalschoenen' },
      { icon: '🦵', text: 'Scheenbeschermers' },
    ],
  },
};
