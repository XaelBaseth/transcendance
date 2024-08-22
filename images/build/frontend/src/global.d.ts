import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Add any custom elements here if needed
      [elemName: string]: any;
    }
  }
}

export {};