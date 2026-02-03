import './PricingCard.css';

export default {
  title: 'Components/PricingCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Card label',
    },
    ageRange: {
      control: 'text',
      description: 'Age range description',
    },
    price: {
      control: 'text',
      description: 'Price',
    },
    isAccent: {
      control: 'boolean',
      description: 'Use accent styling',
    },
  },
};

const createPricingCard = ({ 
  label = 'Onderbouw',
  ageRange = 'U6, U7, U8, U9',
  price = '€ 250',
  isAccent = false
}) => {
  const container = document.createElement('div');
  container.className = `pricing-card ${isAccent ? 'pricing-card--accent' : ''}`;
  container.innerHTML = `
    <span class="pricing-card__label">${label}</span>
    <span class="pricing-card__age">${ageRange}</span>
    <span class="pricing-card__price">${price}</span>
  `;
  return container;
};

export const Default = {
  render: (args) => createPricingCard(args),
  args: {
    label: 'Onderbouw',
    ageRange: 'U6, U7, U8, U9',
    price: '€ 250',
    isAccent: false,
  },
};

export const Accent = {
  render: (args) => createPricingCard(args),
  args: {
    label: 'Kleuters (U5)',
    ageRange: 'Vanaf 3,5 jaar',
    price: '€ 75',
    isAccent: true,
  },
};

export const Middenbouw = {
  render: (args) => createPricingCard(args),
  args: {
    label: 'Middenbouw',
    ageRange: 'U10, U11, U12, U13',
    price: '€ 250',
    isAccent: false,
  },
};

export const Bovenbouw = {
  render: (args) => createPricingCard(args),
  args: {
    label: 'Bovenbouw',
    ageRange: 'U14, U15, U17',
    price: '€ 275',
    isAccent: false,
  },
};

// Grid of all pricing cards
const createPricingGrid = ({ cards, showDiscount = true }) => {
  const container = document.createElement('div');
  container.className = 'pricing-grid-wrapper';
  container.innerHTML = `
    <div class="pricing-grid">
      ${cards.map(c => `
        <div class="pricing-card ${c.isAccent ? 'pricing-card--accent' : ''}">
          <span class="pricing-card__label">${c.label}</span>
          <span class="pricing-card__age">${c.ageRange}</span>
          <span class="pricing-card__price">${c.price}</span>
        </div>
      `).join('')}
    </div>
    ${showDiscount ? '<div class="pricing-discount">-€25 voor 2e kind</div>' : ''}
  `;
  return container;
};

export const PricingGridActive = {
  render: (args) => createPricingGrid(args),
  args: {
    cards: [
      { label: 'Kleuters (U5)', ageRange: 'Vanaf 3,5 jaar', price: '€ 75', isAccent: true },
      { label: 'Onderbouw', ageRange: 'U6, U7, U8, U9', price: '€ 250', isAccent: false },
      { label: 'Middenbouw', ageRange: 'U10, U11, U12, U13', price: '€ 250', isAccent: false },
      { label: 'Bovenbouw', ageRange: 'U14, U15, U17', price: '€ 275', isAccent: false },
    ],
    showDiscount: true,
  },
};

export const PricingGridNew = {
  render: (args) => createPricingGrid(args),
  args: {
    cards: [
      { label: 'Kleuters (U5)', ageRange: 'Vanaf 3,5 jaar', price: '€ 75', isAccent: true },
      { label: 'Onderbouw', ageRange: 'U6, U7, U8, U9', price: '€ 275', isAccent: false },
      { label: 'Middenbouw', ageRange: 'U10, U11, U12, U13', price: '€ 275', isAccent: false },
      { label: 'Bovenbouw', ageRange: 'U14, U15, U17', price: '€ 300', isAccent: false },
    ],
    showDiscount: true,
  },
};
