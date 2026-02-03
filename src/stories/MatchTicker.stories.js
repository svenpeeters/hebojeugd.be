import './MatchTicker.css';

export default {
  title: 'Components/MatchTicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    matches: {
      control: 'object',
      description: 'Array of upcoming matches',
    },
    speed: {
      control: { type: 'range', min: 10, max: 60, step: 5 },
      description: 'Animation speed in seconds',
    },
  },
};

const createMatchTicker = ({ 
  matches = [
    { team: 'U7', opponent: 'KVK Tienen', date: 'Zaterdag 15 feb', time: '10:00', isHome: true },
    { team: 'U9', opponent: 'Tongeren', date: 'Zaterdag 15 feb', time: '11:00', isHome: false },
    { team: 'U11', opponent: 'Sint-Truiden', date: 'Zondag 16 feb', time: '09:30', isHome: true },
    { team: 'U13', opponent: 'Genk', date: 'Zondag 16 feb', time: '14:00', isHome: false },
  ],
  speed = 30
}) => {
  const container = document.createElement('div');
  container.className = 'match-ticker';
  
  const tickerContent = matches.map(m => `
    <div class="match-ticker__item">
      <span class="match-ticker__team">${m.team}</span>
      <span class="match-ticker__vs">vs</span>
      <span class="match-ticker__opponent">${m.opponent}</span>
      <span class="match-ticker__badge ${m.isHome ? 'match-ticker__badge--home' : ''}">${m.isHome ? 'THUIS' : 'UIT'}</span>
      <span class="match-ticker__date">${m.date} • ${m.time}</span>
    </div>
  `).join('<span class="match-ticker__separator">•</span>');

  container.innerHTML = `
    <div class="match-ticker__track" style="animation-duration: ${speed}s;">
      ${tickerContent}
      <span class="match-ticker__separator">•</span>
      ${tickerContent}
    </div>
  `;
  return container;
};

export const Default = {
  render: (args) => createMatchTicker(args),
  args: {
    matches: [
      { team: 'U7', opponent: 'KVK Tienen', date: 'Zaterdag 15 feb', time: '10:00', isHome: true },
      { team: 'U9', opponent: 'Tongeren', date: 'Zaterdag 15 feb', time: '11:00', isHome: false },
      { team: 'U11', opponent: 'Sint-Truiden', date: 'Zondag 16 feb', time: '09:30', isHome: true },
      { team: 'U13', opponent: 'Genk', date: 'Zondag 16 feb', time: '14:00', isHome: false },
    ],
    speed: 30,
  },
};

export const SlowTicker = {
  render: (args) => createMatchTicker(args),
  args: {
    matches: [
      { team: 'U7', opponent: 'KVK Tienen', date: 'Zaterdag 15 feb', time: '10:00', isHome: true },
      { team: 'U9', opponent: 'Tongeren', date: 'Zaterdag 15 feb', time: '11:00', isHome: false },
    ],
    speed: 45,
  },
};
