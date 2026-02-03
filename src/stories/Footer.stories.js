import './Footer.css';

export default {
  title: 'Components/Footer',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

const createFooter = () => {
  const container = document.createElement('footer');
  container.className = 'footer';
  container.innerHTML = `
    <div class="footer__grid">
      <div class="footer__col footer__col--brand">
        <img src="/logo.png" alt="HEBO Jeugd" class="footer__logo" />
        <p class="footer__manifesto">
          Geboren uit fusie.<br/>
          <span>Gedreven door passie.</span>
        </p>
      </div>
      
      <div class="footer__col">
        <h4>Club</h4>
        <a href="/" class="footer__link">Home</a>
        <a href="/jeugdwerking" class="footer__link">Jeugdwerking</a>
        <a href="/trainers" class="footer__link">Trainers</a>
        <a href="/kalender" class="footer__link">Kalender</a>
      </div>
      
      <div class="footer__col">
        <h4>Praktisch</h4>
        <a href="/inschrijven" class="footer__link">Inschrijven</a>
        <a href="/kledij" class="footer__link">Kledij</a>
        <a href="/paastoernooi" class="footer__link">Paastoernooi</a>
        <a href="mailto:info@hebojeugd.be" class="footer__link">Contact</a>
      </div>
      
      <div class="footer__col">
        <h4>Extern</h4>
        <a href="https://www.voetbalvlaanderen.be/club/9732" target="_blank" class="footer__link">Voetbal Vlaanderen ↗</a>
        <a href="https://www.voetbalvlaanderen.be/club/9732/komende-wedstrijden" target="_blank" class="footer__link">Wedstrijden ↗</a>
        <a href="https://www.facebook.com/share/1AJQuHjTBZ/" target="_blank" class="footer__link">Facebook ↗</a>
      </div>
    </div>
    
    <div class="footer__bottom">
      <div class="footer__stamp">STAMNR 09827</div>
      <div class="footer__copy">© 2026</div>
      <div class="footer__signature">Getraind door <a href="https://svenpeeters.be" target="_blank">Sven Peeters</a></div>
    </div>
    
    <div class="footer__ticker">
      <div class="footer__ticker-track">
        <div class="footer__ticker-item">
          <span class="footer__ticker-team">U15</span>
          <span class="footer__ticker-match">FC Bilzen</span>
          <span class="footer__ticker-date">15 feb • 14:00</span>
          <span class="footer__ticker-badge">THUIS</span>
          <span class="footer__ticker-divider">◆</span>
        </div>
        <div class="footer__ticker-item">
          <span class="footer__ticker-team">U11</span>
          <span class="footer__ticker-match">SK Tongeren</span>
          <span class="footer__ticker-date">16 feb • 10:30</span>
          <span class="footer__ticker-badge">UIT</span>
          <span class="footer__ticker-divider">◆</span>
        </div>
        <div class="footer__ticker-item">
          <span class="footer__ticker-team">U17</span>
          <span class="footer__ticker-match">Racing Mechelen</span>
          <span class="footer__ticker-date">16 feb • 15:00</span>
          <span class="footer__ticker-badge">THUIS</span>
          <span class="footer__ticker-divider">◆</span>
        </div>
        <div class="footer__ticker-item">
          <span class="footer__ticker-team">U9</span>
          <span class="footer__ticker-match">KVV Heusden</span>
          <span class="footer__ticker-date">22 feb • 09:00</span>
          <span class="footer__ticker-badge">UIT</span>
          <span class="footer__ticker-divider">◆</span>
        </div>
        <div class="footer__ticker-item">
          <span class="footer__ticker-team">U15</span>
          <span class="footer__ticker-match">FC Bilzen</span>
          <span class="footer__ticker-date">15 feb • 14:00</span>
          <span class="footer__ticker-badge">THUIS</span>
          <span class="footer__ticker-divider">◆</span>
        </div>
        <div class="footer__ticker-item">
          <span class="footer__ticker-team">U11</span>
          <span class="footer__ticker-match">SK Tongeren</span>
          <span class="footer__ticker-date">16 feb • 10:30</span>
          <span class="footer__ticker-badge">UIT</span>
          <span class="footer__ticker-divider">◆</span>
        </div>
        <div class="footer__ticker-item">
          <span class="footer__ticker-team">U17</span>
          <span class="footer__ticker-match">Racing Mechelen</span>
          <span class="footer__ticker-date">16 feb • 15:00</span>
          <span class="footer__ticker-badge">THUIS</span>
          <span class="footer__ticker-divider">◆</span>
        </div>
        <div class="footer__ticker-item">
          <span class="footer__ticker-team">U9</span>
          <span class="footer__ticker-match">KVV Heusden</span>
          <span class="footer__ticker-date">22 feb • 09:00</span>
          <span class="footer__ticker-badge">UIT</span>
          <span class="footer__ticker-divider">◆</span>
        </div>
      </div>
    </div>
  `;
  return container;
};

export const Default = {
  render: () => createFooter(),
};
