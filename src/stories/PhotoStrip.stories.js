import './PhotoStrip.css';

export default {
  title: 'Components/PhotoStrip',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    images: {
      control: 'object',
      description: 'Array of image URLs',
    },
    speed: {
      control: { type: 'range', min: 10, max: 40, step: 2 },
      description: 'Animation speed in seconds',
    },
  },
};

const createPhotoStrip = ({ 
  images = [
    'https://placehold.co/160x110/1e3264/ffffff?text=1',
    'https://placehold.co/160x110/c8202f/ffffff?text=2',
    'https://placehold.co/160x110/4ade80/ffffff?text=3',
    'https://placehold.co/160x110/f59e0b/ffffff?text=4',
    'https://placehold.co/160x110/1e3264/ffffff?text=5',
    'https://placehold.co/160x110/c8202f/ffffff?text=6',
  ],
  speed = 20
}) => {
  const container = document.createElement('div');
  container.className = 'photo-strip';
  
  // Double the images for seamless loop
  const doubledImages = [...images, ...images];
  
  container.innerHTML = `
    <div class="photo-strip__track" style="animation-duration: ${speed}s;">
      ${doubledImages.map(src => `<img src="${src}" alt="" />`).join('')}
    </div>
  `;
  return container;
};

export const Default = {
  render: (args) => createPhotoStrip(args),
  args: {
    images: [
      'https://placehold.co/160x110/1e3264/ffffff?text=1',
      'https://placehold.co/160x110/c8202f/ffffff?text=2',
      'https://placehold.co/160x110/4ade80/ffffff?text=3',
      'https://placehold.co/160x110/f59e0b/ffffff?text=4',
      'https://placehold.co/160x110/1e3264/ffffff?text=5',
      'https://placehold.co/160x110/c8202f/ffffff?text=6',
    ],
    speed: 20,
  },
};

export const SlowStrip = {
  render: (args) => createPhotoStrip(args),
  args: {
    images: [
      'https://placehold.co/160x110/1e3264/ffffff?text=1',
      'https://placehold.co/160x110/c8202f/ffffff?text=2',
      'https://placehold.co/160x110/4ade80/ffffff?text=3',
      'https://placehold.co/160x110/f59e0b/ffffff?text=4',
    ],
    speed: 35,
  },
};
