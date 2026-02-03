import './IncludedItems.css';

export default {
  title: 'Components/IncludedItems',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Section title',
    },
    items: {
      control: 'object',
      description: 'Array of included items',
    },
    highlightItems: {
      control: 'object',
      description: 'Array of highlighted/extra items',
    },
  },
};

const createIncludedItems = ({ 
  title = 'Alle leden ontvangen',
  items = [
    'Wedstrijd-shirt',
    'Wedstrijd-short',
    'Wedstrijd-polo',
    '2x Kousen',
    'Trainingsvest',
    'Trainingsbroek',
    'Regenjas',
    'Voetbal',
    'Drinkbus',
  ],
  highlightItems = []
}) => {
  const container = document.createElement('div');
  container.className = 'included-items';
  container.innerHTML = `
    <h3 class="included-items__title">${title}</h3>
    <div class="included-items__grid">
      ${items.map(item => `<div class="included-items__item">${item}</div>`).join('')}
      ${highlightItems.map(item => `<div class="included-items__item included-items__item--highlight">${item}</div>`).join('')}
    </div>
  `;
  return container;
};

export const AllMembers = {
  render: (args) => createIncludedItems(args),
  args: {
    title: 'Alle leden ontvangen',
    items: [
      'Wedstrijd-shirt',
      'Wedstrijd-short',
      'Wedstrijd-polo',
      '2x Kousen',
      'Trainingsvest',
      'Trainingsbroek',
      'Regenjas',
      'Voetbal',
      'Drinkbus',
    ],
    highlightItems: [],
  },
};

export const NewMembersExtra = {
  render: (args) => createIncludedItems(args),
  args: {
    title: 'Nieuwe leden extra',
    items: [],
    highlightItems: ['+ Voetbaltas'],
  },
};

export const Combined = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'included-wrapper';
    
    const allMembers = createIncludedItems({
      title: 'Alle leden ontvangen',
      items: [
        'Wedstrijd-shirt',
        'Wedstrijd-short',
        'Wedstrijd-polo',
        '2x Kousen',
        'Trainingsvest',
        'Trainingsbroek',
        'Regenjas',
        'Voetbal',
        'Drinkbus',
      ],
      highlightItems: [],
    });
    
    const newMembers = createIncludedItems({
      title: 'Nieuwe leden extra',
      items: [],
      highlightItems: ['+ Voetbaltas'],
    });
    
    wrapper.appendChild(allMembers);
    wrapper.appendChild(newMembers);
    return wrapper;
  },
};
