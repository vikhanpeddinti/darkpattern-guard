import '@testing-library/jest-dom';

describe('DarkPattern Guard - Unit Tests', () => {
  it('runs initial smoke test', () => {
    expect(true).toBe(true);
  });

  it('verifies application configuration', () => {
    const appName = 'DarkPattern Guard';
    expect(appName).toBe('DarkPattern Guard');
  });
});