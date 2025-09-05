import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MediaBlurController } from '../../src/renderer/MediaBlurController';

// Mock DOM elements
const mockElement = {
  classList: {
    contains: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
  },
  setAttribute: vi.fn(),
  style: {
    setProperty: vi.fn(),
  },
} as any;

const mockDocument = {
  documentElement: {
    style: {
      setProperty: vi.fn(),
    },
  },
  querySelectorAll: vi.fn().mockReturnValue([]), // Return empty array
  addEventListener: vi.fn(),
} as any;

// Mock MutationObserver
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock document
global.document = mockDocument;

describe('MediaBlurController', () => {
  let controller: MediaBlurController;
  let mockObserver: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create a fresh mock observer for each test
    mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    };

    // Mock the MutationObserver constructor
    (global as any).MutationObserver = vi.fn().mockImplementation(() => mockObserver);

    controller = new MediaBlurController({
      blurImages: true,
      blurVideos: true,
      blurRadiusPx: 6,
    });
  });

  it('should initialize with correct options', () => {
    const options = controller.getOptions();
    expect(options.blurImages).toBe(true);
    expect(options.blurVideos).toBe(true);
    expect(options.blurRadiusPx).toBe(6);
  });

  it('should update options correctly', () => {
    controller.updateOptions({ blurImages: false, blurRadiusPx: 10 });

    const options = controller.getOptions();
    expect(options.blurImages).toBe(false);
    expect(options.blurRadiusPx).toBe(10);
    expect(options.blurVideos).toBe(true); // Should remain unchanged
  });

  it('should start and observe DOM changes', () => {
    controller.start();

    expect(mockObserver.observe).toHaveBeenCalledWith(
      document.documentElement,
      expect.objectContaining({
        childList: true,
        subtree: true,
        attributes: true,
      })
    );
  });

  it('should stop observing when stopped', () => {
    controller.start();
    controller.stop();

    expect(mockObserver.disconnect).toHaveBeenCalled();
  });
});
