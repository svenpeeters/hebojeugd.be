import './TrainersBlock.css';

export default {
  title: 'Components/TrainersBlock',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Group title',
    },
    subtitle: {
      control: 'text',
      description: 'Group subtitle',
    },
    trainers: {
      control: 'object',
      description: 'Array of trainer objects',
    },
    variant: {
      control: 'select',
      options: ['green', 'orange', 'red', 'navy'],
      description: 'Header color variant',
    },
  },
};

const createTrainersBlock = ({ 
  title = 'Onderbouw',
  subtitle = 'U5 - U9',
  trainers = [
    { team: 'U5', name: 'Claudine Hartjesveld', phone: '0478 81 30 94' },
    { team: 'U6', name: 'Kenji Jossa', phone: '0468 01 16 73' },
    { team: 'U7', name: 'Timothy Fontaine', phone: '0496 21 24 41' },
    { team: 'U9', name: 'Dave Daniels', phone: '0486 62 83 52' },
  ],
  variant = 'green'
}) => {
  const container = document.createElement('div');
  container.className = 'trainers-block';
  container.innerHTML = `
    <div class="trainers-block__header trainers-block__header--${variant}">
      <h2>${title}</h2>
      <span>${subtitle}</span>
    </div>
    <div class="trainers-block__grid">
      ${trainers.map(t => `
        <div class="trainer-card">
          <span class="trainer-card__team">${t.team}</span>
          <span class="trainer-card__name">${t.name}</span>
          <a href="tel:${t.phone.replace(/\s/g, '')}" class="trainer-card__phone">${t.phone}</a>
        </div>
      `).join('')}
    </div>
  `;
  return container;
};

export const Onderbouw = {
  render: (args) => createTrainersBlock(args),
  args: {
    title: 'Onderbouw',
    subtitle: 'U5 - U9',
    trainers: [
      { team: 'U5', name: 'Claudine Hartjesveld', phone: '0478 81 30 94' },
      { team: 'U6', name: 'Kenji Jossa', phone: '0468 01 16 73' },
      { team: 'U7', name: 'Timothy Fontaine', phone: '0496 21 24 41' },
      { team: 'U9', name: 'Dave Daniels', phone: '0486 62 83 52' },
    ],
    variant: 'green',
  },
};

export const Middenbouw = {
  render: (args) => createTrainersBlock(args),
  args: {
    title: 'Middenbouw',
    subtitle: 'U10 - U13',
    trainers: [
      { team: 'U10', name: 'Willy Missotten', phone: '0478 81 30 94' },
      { team: 'U10', name: 'Jurgen Polders', phone: '0499 82 01 41' },
      { team: 'U11/12', name: 'Andy Bex', phone: '0490 58 23 12' },
      { team: 'U11/12', name: 'Frank Missotten', phone: '0469 65 82 72' },
    ],
    variant: 'orange',
  },
};

export const Bovenbouw = {
  render: (args) => createTrainersBlock(args),
  args: {
    title: 'Bovenbouw',
    subtitle: 'U14 - U17',
    trainers: [
      { team: 'U15', name: 'Jean-Marie Cloesen', phone: '0498 48 80 92' },
      { team: 'U15', name: 'Roger Vanhaeren', phone: '0476 27 77 62' },
      { team: 'U17', name: 'Joeri Fontaine', phone: '0488 49 67 10' },
    ],
    variant: 'red',
  },
};

export const Keeperstrainer = {
  render: (args) => createTrainersBlock(args),
  args: {
    title: 'Keeperstrainer',
    subtitle: 'Alle teams',
    trainers: [
      { team: '🧤 Alle teams', name: 'Gilles Vanswijgenhoven', phone: '0471 91 34 82' },
    ],
    variant: 'navy',
  },
};
