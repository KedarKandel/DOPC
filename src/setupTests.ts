
import { vi } from 'vitest';
HTMLFormElement.prototype.requestSubmit = vi.fn();
import '@testing-library/jest-dom/vitest'