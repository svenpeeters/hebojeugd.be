import './PhaseCard.css';

export default {
  title: 'Components/PhaseCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    phase: {
      control: 'text',
      description: 'Phase label (Fase 1, Fase 2, etc.)',
    },
    title: {
      control: 'text',
      description: 'Phase title',
    },
    ages: {
      control: 'text',
      description: 'Age range',
    },
    description: {
      control: 'text',
      description: 'Phase description',
    },
    teams: {
      control: 'object',
      description: 'Array of team names',
    },
    variant: {
      control: 'select',
      options: ['onderbouw', 'middenbouw', 'bovenbouw'],
      description: 'Color variant',
    },
  },
};

const createPhaseCard = ({ 
  phase = 'Fase 1',
  title = 'Onderbouw',
  ages = 'U5 - U9',
  description = 'De basis van het voetbalplezier. Hier leren de jongste spelers spelenderwijs de bal kennen en maken ze hun eerste vriendjes op het veld.',
  teams = ['U5 (Kleuters)', 'U6', 'U7', 'U8', 'U9'],
  variant = 'onderbouw'
}) => {
  const container = document.createElement('div');
  container.className = `phase phase--${variant}`;
  container.innerHTML = `
    <div class="phase__header">
      <span class="phase__label">${phase}</span>
      <h2 class="phase__title">${title}</h2>
      <span class="phase__ages">${ages}</span>
    </div>
    <div class="phase__content">
      <p>${description}</p>
      <div class="phase__teams">
        ${teams.map(t => `<span>${t}</span>`).join('')}
      </div>
    </div>
  `;
  return container;
};

export const Onderbouw = {
  render: (args) => createPhaseCard(args),
  args: {
    phase: 'Fase 1',
    title: 'Onderbouw',
    ages: 'U5 - U9',
    description: 'De basis van het voetbalplezier. Hier leren de jongste spelers spelenderwijs de bal kennen en maken ze hun eerste vriendjes op het veld.',
    teams: ['U5 (Kleuters)', 'U6', 'U7', 'U8', 'U9'],
    variant: 'onderbouw',
  },
};

export const Middenbouw = {
  render: (args) => createPhaseCard(args),
  args: {
    phase: 'Fase 2',
    title: 'Middenbouw',
    ages: 'U10 - U13',
    description: 'De ontwikkelfase. Techniek, tactiek en teamplay worden verder uitgebouwd. Spelers groeien als individu én als team.',
    teams: ['U10', 'U11', 'U12', 'U13'],
    variant: 'middenbouw',
  },
};

export const Bovenbouw = {
  render: (args) => createPhaseCard(args),
  args: {
    phase: 'Fase 3',
    title: 'Bovenbouw',
    ages: 'U14 - U17',
    description: 'De perfectioneringsfase. Fysieke en mentale ontwikkeling, wedstrijdmentaliteit en voorbereiding op het volwassen voetbal.',
    teams: ['U14', 'U15', 'U17'],
    variant: 'bovenbouw',
  },
};
