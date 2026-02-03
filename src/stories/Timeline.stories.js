import './Timeline.css';

export default {
  title: 'Components/Timeline',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    events: {
      control: 'object',
      description: 'Array of timeline events',
    },
  },
};

const createTimeline = ({ 
  events = [
    { date: '30 juli', title: 'Start trainingen', type: 'start' },
    { date: 'Augustus', title: 'Testwedstrijden en toernooien', type: 'event' },
    { date: 'September', title: 'Ploegenvoorstelling', type: 'event' },
    { date: 'Sept - Nov', title: 'Competitie - 1e helft', type: 'competition' },
    { date: '6-7 december', title: 'Kerststal @ Winterweekend Heers', type: 'event' },
    { date: '13 december', title: 'Winterstop', type: 'stop' },
    { date: '17 januari', title: 'Hervatting training en competitie - 2e helft', type: 'start' },
    { date: 'April', title: 'HEBO Jeugd Paastoernooi 2026', type: 'highlight' },
    { date: 'Mei', title: 'Toernooien', type: 'event' },
    { date: 'Begin juni', title: 'Eindeseizoens BBQ', type: 'event' },
    { date: 'Juni', title: 'Einde trainingen - Zomerstop', type: 'stop' },
  ]
}) => {
  const container = document.createElement('div');
  container.className = 'timeline';
  container.innerHTML = `
    <div class="timeline__container">
      <div class="timeline__line"></div>
      ${events.map(event => `
        <div class="timeline__item timeline__item--${event.type}">
          <div class="timeline__marker"></div>
          <div class="timeline__content">
            <span class="timeline__date">${event.date}</span>
            <h3 class="timeline__title">${event.title}</h3>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  return container;
};

export const FullSeason = {
  render: (args) => createTimeline(args),
  args: {
    events: [
      { date: '30 juli', title: 'Start trainingen', type: 'start' },
      { date: 'Augustus', title: 'Testwedstrijden en toernooien', type: 'event' },
      { date: 'September', title: 'Ploegenvoorstelling', type: 'event' },
      { date: 'Sept - Nov', title: 'Competitie - 1e helft', type: 'competition' },
      { date: '6-7 december', title: 'Kerststal @ Winterweekend Heers', type: 'event' },
      { date: '13 december', title: 'Winterstop', type: 'stop' },
      { date: '17 januari', title: 'Hervatting training en competitie - 2e helft', type: 'start' },
      { date: 'April', title: 'HEBO Jeugd Paastoernooi 2026', type: 'highlight' },
      { date: 'Mei', title: 'Toernooien', type: 'event' },
      { date: 'Begin juni', title: 'Eindeseizoens BBQ', type: 'event' },
      { date: 'Juni', title: 'Einde trainingen - Zomerstop', type: 'stop' },
    ],
  },
};

export const ShortTimeline = {
  render: (args) => createTimeline(args),
  args: {
    events: [
      { date: '30 juli', title: 'Start trainingen', type: 'start' },
      { date: 'September', title: 'Competitie', type: 'competition' },
      { date: 'April', title: 'Paastoernooi', type: 'highlight' },
    ],
  },
};
