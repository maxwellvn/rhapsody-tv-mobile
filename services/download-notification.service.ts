/**
 * Download notification service – disabled.
 * All methods are intentional no-ops so callers don't need changes.
 */
class DownloadNotificationService {
  async start(_title: string, _isHls: boolean): Promise<void> {}
  async update(_progress: number, _title: string, _isHls: boolean): Promise<void> {}
  async complete(_title: string): Promise<void> {}
  async fail(_title: string): Promise<void> {}
}

export const downloadNotificationService = new DownloadNotificationService();
