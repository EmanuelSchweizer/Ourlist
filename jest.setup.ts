import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
} as unknown as typeof IntersectionObserver;

Object.assign(global, { TextDecoder, TextEncoder });
