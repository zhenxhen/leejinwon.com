import { DeviceType, Project, WorkItem } from './types';

export const PLATFORM_CONCEPTS: Project[] = [
  {
    id: 'xr-calendar',
    title: 'Spatial Experience',
    category: 'Spatial Computing',
    deviceType: DeviceType.XR_HEADSET,

    details: 'An infinite canvas that transcends physical boundaries. It provides deep immersion through natural interaction with your gaze and gestures.',
    color: '#8b5cf6', // Violet
  },
  {
    id: 'mobile-music',
    title: 'Mobile Experience',
    category: 'On-the-Go',
    deviceType: DeviceType.MOBILE,
    details: 'The most personal and immediate device. It provides new experiences intuitively and efficiently within the user\'s daily life.',
    color: '#ec4899', // Pink
  },

  {
    id: 'watch-alarm',
    title: 'Wearable Experience',
    category: 'Wearable',
    deviceType: DeviceType.WATCH,

    details: 'The device that understands your context most intimately. Managing user data, it accompanies you through your daily life.',
    color: '#10b981', // Emerald
  }
];

// Re-export as PROJECTS for backward compatibility if needed, or refactor consumers
export const PROJECTS = PLATFORM_CONCEPTS;

export const MONITOR_DATA: Project = {
  id: 'monitor',
  title: 'Web Design',
  category: 'Development',
  deviceType: DeviceType.MONITOR,

  details: 'Delivers digital experiences that satisfy both performance and aesthetics by leveraging the latest web standards technologies.',
  color: '#000000'
};

export const HEADPHONE_DATA: Project = {
  id: 'headphone',
  title: 'Play Ground',
  category: 'Creative',
  deviceType: DeviceType.HEADPHONE,

  details: 'Personal Interactive Lab. Explore a collection of synesthetic digital artworks combining music, sound effects, and visual elements.',
  color: '#333333'
};

export const PUBLICATION_DATA: Project = {
  id: 'publication',
  title: 'Publication',
  category: 'Research',
  deviceType: DeviceType.PUBLICATION,

  details: 'A collection of magazines, news, or invited talks featuring my works and thoughts on design and technology.',
  color: '#444444'
};

export const NAVIGATION_ORDER = [
  'mobile-music',
  'watch-alarm',
  'monitor',
  'publication',
  'xr-calendar',
  'headphone'
];

export const WORK_ITEMS: WorkItem[] = [
  {
    id: 'ectomnesia',
    title: 'Ectomnesia',
    category: 'MS Thesis · Research through Design',
    medium: 'ChatGPT MCP plugin',
    image: '/thumbnail/10.webp',
    year: '2026'
  },
  {
    id: 'post-literature',
    title: 'Post Literature',
    category: 'New Media Installation',
    image: '/thumbnail/9.webp',
    year: '2026'
  },
  {
    id: 'interplay',
    title: 'InterPlay',
    category: 'Exhibition Identity & Website',
    image: '/thumbnail/8.webp',
    year: '2026'
  },
  {
    id: 'review',
    title: 'REVIEW',
    category: 'AI Computing Project',
    image: '/thumbnail/5.webp',
    year: '2025'
  },
  {
    id: 'digital-garden',
    title: 'Digital Garden',
    category: 'Sound Engineering Project',
    image: '/thumbnail/7.webp',
    year: '2026'
  },
  {
    id: 'samsung-reminder',
    title: 'Samsung Reminder',
    category: 'Galaxy One UI',
    image: '/thumbnail/1.webp',
    year: '2025'
  },
  {
    id: 'samsung-calendar',
    title: 'Samsung Calendar',
    category: 'Galaxy One UI',
    image: '/thumbnail/2.webp',
    year: '2025'
  },
  {
    id: 'galaxy-one-ui-widget',
    title: 'Galaxy One UI Widget',
    category: 'Galaxy One UI',
    image: '/thumbnail/3.webp',
    year: '2024'
  },
  {
    id: 'samsung-clock',
    title: 'Samsung Clock',
    category: 'Galaxy One UI',
    image: '/thumbnail/4.webp',
    year: '2024'
  },
  {
    id: 'bloomy',
    title: 'Bloomy',
    category: 'Universal Wearable Product',
    image: '/thumbnail/6.webp',
    year: '2023'
  }
];