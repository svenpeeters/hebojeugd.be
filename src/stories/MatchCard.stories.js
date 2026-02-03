import './MatchCard.css';

export default {
  title: 'Components/MatchCard',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    team: {
      control: 'text',
      description: 'Team name (e.g. U7, U9)',
    },
    opponent: {
      control: 'text',
      description: 'Opponent team name',
    },
    date: {
      control: 'text',
      description: 'Match date',
    },
    time: {
      control: 'text',
      description: 'Match time',
    },
    isHome: {
      control: 'boolean',
      description: 'Is it a home match',
    },
  },
};

const createMatchCard = ({ 
  team = 'U7',
  opponent = 'KVK Tienen',
  date = 'Zaterdag 15 februari',
  time = '10:00',
  isHome = true
}) => {
  const container = document.createElement('div');
  container.className = `match-card ${isHome ? 'match-card--home' : 'match-card--away'}`;
  container.innerHTML = `
    <div class="match-card__num">${team}</div>
    <div class="match-card__content">
      <div class="match-card__team">${team}</div>
      <div class="match-card__opponent">${opponent}</div>
      <div class="match-card__meta">
        <span class="match-card__date">${date}</span>
        <span class="match-card__time">${time}</span>
      </div>
    </div>
    <div class="match-card__badge">${isHome ? 'THUIS' : 'UIT'}</div>
  `;
  return container;
};

export const HomeMatch = {
  render: (args) => createMatchCard(args),
  args: {
    team: 'U7',
    opponent: 'KVK Tienen',
    date: 'Zaterdag 15 februari',
    time: '10:00',
    isHome: true,
  },
};

export const AwayMatch = {
  render: (args) => createMatchCard(args),
  args: {
    team: 'U9',
    opponent: 'Tongeren VV',
    date: 'Zondag 16 februari',
    time: '11:00',
    isHome: false,
  },
};

// Match list
const createMatchList = ({ matches }) => {
  const container = document.createElement('div');
  container.className = 'matches-list';
  container.innerHTML = matches.map(m => `
    <div class="match-card ${m.isHome ? 'match-card--home' : 'match-card--away'}">
      <div class="match-card__num">${m.team}</div>
      <div class="match-card__content">
        <div class="match-card__team">${m.team}</div>
        <div class="match-card__opponent">${m.opponent}</div>
        <div class="match-card__meta">
          <span class="match-card__date">${m.date}</span>
          <span class="match-card__time">${m.time}</span>
        </div>
      </div>
      <div class="match-card__badge">${m.isHome ? 'THUIS' : 'UIT'}</div>
    </div>
  `).join('');
  return container;
};

export const MatchList = {
  render: (args) => createMatchList(args),
  args: {
    matches: [
      { team: 'U7', opponent: 'KVK Tienen', date: 'Zaterdag 15 feb', time: '10:00', isHome: true },
      { team: 'U9', opponent: 'Tongeren VV', date: 'Zaterdag 15 feb', time: '11:00', isHome: false },
      { team: 'U11', opponent: 'Sint-Truiden', date: 'Zondag 16 feb', time: '09:30', isHome: true },
      { team: 'U13', opponent: 'RC Genk', date: 'Zondag 16 feb', time: '14:00', isHome: false },
    ],
  },
};
