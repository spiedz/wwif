// This file contains any setup code that should run before each test
// For example, you can add global mocks or extend Jest with custom matchers

// Mock fetch globally
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
    status: 200,
  })
);

// Reset all mocks after each test
afterEach(() => {
  jest.resetAllMocks();
});

// Add any other global test setup here 