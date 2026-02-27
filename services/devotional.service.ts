import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@/config/api.config';

const SHOWN_KEY = '@ror_devotional_shown_slot';
const CACHE_KEY = '@ror_devotional_cache';
const CACHE_TS_KEY = '@ror_devotional_cache_ts';
const CACHE_LIFETIME_MS = 30 * 60 * 1000; // cache for 30 min
let sessionModalSlotLock: string | null = null;

export interface DevotionalData {
  id: number;
  title: string;
  pdate: string;
  fulldate: string;
  body: string;
  image: string;
  confess: string;
  study: string;
  BA: string;
  BB: string;
  excerpt: string;
  opening_scripture: string;
  audioUrl: string;
  plainBody: string;
}

function getTodayDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Returns "morning" before 3 PM, "evening" after 3 PM */
function getCurrentSlot(): 'morning' | 'evening' {
  return new Date().getHours() < 15 ? 'morning' : 'evening';
}

function getCurrentShowSlotKey(): string {
  return `${getTodayDate()}_${getCurrentSlot()}`;
}

export const devotionalService = {
  async getTodayDevotional(options?: { forceRefresh?: boolean }): Promise<DevotionalData | null> {
    try {
      const forceRefresh = options?.forceRefresh === true;

      if (!forceRefresh) {
        // Check cache first
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        const cachedTs = await AsyncStorage.getItem(CACHE_TS_KEY);
        if (cached && cachedTs && Date.now() - Number(cachedTs) < CACHE_LIFETIME_MS) {
          const parsed = JSON.parse(cached) as DevotionalData;
          // Only use cache if it's for today
          if (parsed.pdate === getTodayDate()) {
            return parsed;
          }
        }
      }

      // Fetch from our backend proxy
      const baseUrl = API_CONFIG.BASE_URL.replace(/\/+$/, '');
      const date = getTodayDate();
      const resp = await fetch(`${baseUrl}/homepage/daily-devotional?date=${encodeURIComponent(date)}`);
      const json = await resp.json();

      if (!json?.success || !json?.data) return null;

      const devotional = json.data as DevotionalData;

      // Cache it
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(devotional));
      await AsyncStorage.setItem(CACHE_TS_KEY, String(Date.now()));

      return devotional;
    } catch {
      return null;
    }
  },

  /**
   * Shows twice per day: morning (before 3 PM) and evening (3 PM+).
   */
  async shouldShowNow(): Promise<boolean> {
    try {
      const lastShown = await AsyncStorage.getItem(SHOWN_KEY);
      const currentKey = getCurrentShowSlotKey();
      return lastShown !== currentKey;
    } catch {
      return true;
    }
  },

  async markShownNow(): Promise<void> {
    const currentKey = getCurrentShowSlotKey();
    await AsyncStorage.setItem(SHOWN_KEY, currentKey);
  },

  /**
   * Prevents duplicate modal instances for the same day/slot within a single app session.
   * Returns the slot key if acquired, otherwise null.
   */
  tryAcquireSessionModalSlotLock(): string | null {
    const currentKey = getCurrentShowSlotKey();
    if (sessionModalSlotLock === currentKey) return null;
    sessionModalSlotLock = currentKey;
    return currentKey;
  },

  releaseSessionModalSlotLock(slotKey: string): void {
    if (sessionModalSlotLock === slotKey) {
      sessionModalSlotLock = null;
    }
  },
};
