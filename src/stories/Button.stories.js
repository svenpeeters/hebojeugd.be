/**
 * Button component stories
 */
export default {
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'cta'],
    },
  },
};

const createButton = ({ label, variant = 'primary' }) => {
  const btn = document.createElement('a');
  btn.href = '#';
  btn.textContent = label;
  btn.style.cssText = `
    display: inline-block;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    font-weight: 700;
    border-radius: 4px;
    transition: all 0.3s ease;
    font-family: 'Inter', sans-serif;
  `;
  
  if (variant === 'primary') {
    btn.style.background = '#1e3264';
    btn.style.color = '#fff';
  } else if (variant === 'secondary') {
    btn.style.background = '#f5f5f5';
    btn.style.color = '#1e3264';
  } else if (variant === 'cta') {
    btn.style.background = '#c8202f';
    btn.style.color = '#fff';
  }
  
  return btn;
};

export const Primary = {
  args: {
    label: 'Contact opnemen',
    variant: 'primary',
  },
  render: (args) => createButton(args),
};

export const Secondary = {
  args: {
    label: 'Meer info',
    variant: 'secondary',
  },
  render: (args) => createButton(args),
};

export const CTA = {
  args: {
    label: 'Lid worden →',
    variant: 'cta',
  },
  render: (args) => createButton(args),
};
