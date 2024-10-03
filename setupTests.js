import '@testing-library/jest-dom';
import React from 'react';

global.React = React; 



// setupTests.js
class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
