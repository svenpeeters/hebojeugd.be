import './Footer.css';

export default {
  title: 'Components/Footer',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    clubName: {
      control: 'text',
      description: 'Club name',
    },
    year: {
      control: 'text',
      description: 'Copyright year',
    },
    email: {
      control: 'text',
      description: 'Contact email',
    },
  },
};

const createFooter = ({ clubName = 'VC HEBO Jeugd', year = '2025', email = 'info@hebojeugd.be' }) => {
  const container = document.createElement('footer');
  container.className = 'footer';
  container.innerHTML = `
    <div class="footer__container">
      <div class="footer__top">
        <div class="footer__brand">
          <img src="/logo.png" alt="${clubName}" class="footer__logo" />
          <span class="footer__name">${clubName}</span>
        </div>
        <div class="footer__links">
          <a href="/" class="footer__link">Home</a>
          <a href="/jeugdwerking" class="footer__link">Jeugdwerking</a>
          <a href="/trainers" class="footer__link">Trainers</a>
          <a href="/kalender" class="footer__link">Kalender</a>
          <a href="/inschrijven" class="footer__link">Inschrijven</a>
        </div>
      </div>
      <div class="footer__bottom">
        <div class="footer__locations">
          <div class="footer__location">
            <strong>Heers</strong>
            <span>Raes van Heerslaan, 3870 Heers</span>
          </div>
          <div class="footer__location">
            <strong>EMBO</strong>
            <span>Gelindenstraat z/n, 3870 Mechelen-Bovelingen</span>
          </div>
        </div>
        <div class="footer__contact">
          <a href="mailto:${email}">${email}</a>
        </div>
      </div>
      <div class="footer__copyright">
        © ${year} ${clubName}. Alle rechten voorbehouden.
      </div>
    </div>
  `;
  return container;
};

export const Default = {
  render: (args) => createFooter(args),
  args: {
    clubName: 'VC HEBO Jeugd',
    year: '2025',
    email: 'info@hebojeugd.be',
  },
};
