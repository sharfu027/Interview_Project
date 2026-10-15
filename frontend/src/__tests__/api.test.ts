import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../services/api';

const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
});

describe('Frontend API Service Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('Authentication and Token Management', () => {
    it('should include Authorization Bearer header when token exists in localStorage', async () => {
      localStorage.setItem('interviewos_token', 'test-valid-jwt-token');

      const mockData = {
        userId: 'test-user-id',
        email: 'engineer@interviewos.dev',
        firstName: 'Alice',
        lastName: 'Engineer',
      };

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Profile retrieved',
          data: mockData,
          timestamp: new Date().toISOString(),
        }),
      } as Response);

      const profile = await api.user.getProfile();

      expect(fetchSpy).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/users/me/profile',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-valid-jwt-token',
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(profile.email).toBe('engineer@interviewos.dev');
    });

    it('should provide deterministic offline fallback when network is unavailable', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch (offline)'));

      const result = await api.auth.login({
        email: 'recruiter@interviewos.dev',
        password: 'Password123!',
      });

      expect(result).toBeDefined();
      expect(result.roles).toContain('ROLE_RECRUITER');
      expect(result.accessToken).toBe('mock-jwt-token-production-ready');
    });

    it('should provide candidate fallback when candidate logs in offline', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      const result = await api.auth.login({
        email: 'candidate@interviewos.dev',
        password: 'Password123!',
      });

      expect(result.roles).toContain('ROLE_CANDIDATE');
      expect(result.email).toBe('candidate@interviewos.dev');
    });
  });

  describe('User Settings Integrity', () => {
    it('should enforce light theme default in user settings', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network unreachable'));

      const settings = await api.user.getSettings();
      expect(settings.theme).toBe('light');
    });
  });
});
