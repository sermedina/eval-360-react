/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];

export const theme = {
  extend: {
    colors: {
      darkModeBg: '#1a202c',
      darkModeText: '#e2e8f0',
      lightModeBg: '#ffffff',
      lightModeText: '#2d3748',
    },
  },
};

export const plugins = [];

export const darkMode = 'class';