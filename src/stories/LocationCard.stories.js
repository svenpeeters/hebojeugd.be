import './LocationCard.css';

export default {
  title: 'Components/LocationCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Location name',
    },
    address: {
      control: 'text',
      description: 'Location address',
    },
    href: {
      control: 'text',
      description: 'Google Maps link',
    },
  },
};

const createLocationCard = ({ 
  name = 'Heers',
  address = 'Raes van Heerslaan, 3870 Heers',
  href = 'https://maps.google.com/?q=Raes+van+Heerslaan+Heers'
}) => {
  const container = document.createElement('a');
  container.className = 'location-card';
  container.href = href;
  container.target = '_blank';
  container.innerHTML = `
    <div class="location-card__name">${name}</div>
    <div class="location-card__address">${address}</div>
    <div class="location-card__arrow">↗</div>
  `;
  return container;
};

export const Heers = {
  render: (args) => createLocationCard(args),
  args: {
    name: 'Heers',
    address: 'Raes van Heerslaan, 3870 Heers',
    href: 'https://maps.google.com/?q=Raes+van+Heerslaan+Heers',
  },
};

export const EMBO = {
  render: (args) => createLocationCard(args),
  args: {
    name: 'EMBO',
    address: 'Gelindenstraat z/n, 3870 Mechelen-Bovelingen',
    href: 'https://maps.google.com/?q=Gelindenstraat+Mechelen-Bovelingen',
  },
};

// Grid of locations
const createLocationGrid = ({ locations }) => {
  const container = document.createElement('div');
  container.className = 'locations-grid';
  container.innerHTML = locations.map(loc => `
    <a href="${loc.href}" target="_blank" class="location-card">
      <div class="location-card__name">${loc.name}</div>
      <div class="location-card__address">${loc.address}</div>
      <div class="location-card__arrow">↗</div>
    </a>
  `).join('');
  return container;
};

export const LocationGrid = {
  render: (args) => createLocationGrid(args),
  args: {
    locations: [
      { name: 'Heers', address: 'Raes van Heerslaan, 3870 Heers', href: '#' },
      { name: 'EMBO', address: 'Gelindenstraat z/n, 3870 Mechelen-Bovelingen', href: '#' },
    ],
  },
};
