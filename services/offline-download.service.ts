import { STORAGE_KEYS, storage } from "@/utils/storage";
import * as FileSystem from "expo-file-system/legacy";

const DOWNLOADS_DIR = `${FileSystem.documentDirectory}downloads/`;

export type DownloadedVideo = {
  videoId: string;
  title: string;
  channelName?: string;
  channelAvatar?: string;
  thumbnailUrl?: string;
  playbackUrl: string;
  localUri: string;
  downloadedAt: string;
  sizeBytes?: number;
};

type DownloadVideoInput = {
  videoId: string;
  title: string;
  channelName?: string;
  channelAvatar?: string;
  thumbnailUrl?: string;
  playbackUrl: string;
  onProgress?: (progress: number) => void;
};

class OfflineDownloadService {
  private async ensureDownloadsDir(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(DOWNLOADS_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, {
        intermediates: true,
      });
    }
  }

  private getFileExtension(url: string): string {
    const cleanUrl = url.split("?")[0].toLowerCase();
    const dotIndex = cleanUrl.lastIndexOf(".");
    if (dotIndex === -1) {
      return "mp4";
    }

    const ext = cleanUrl.slice(dotIndex + 1);
    if (!ext || ext.length > 5) {
      return "mp4";
    }

    return ext;
  }

  private isHlsUrl(url: string): boolean {
    return url.split("?")[0].toLowerCase().endsWith(".m3u8");
  }

  private resolveAbsoluteUrl(baseUrl: string, value: string): string {
    try {
      return new URL(value, baseUrl).toString();
    } catch {
      return value;
    }
  }

  private getExtensionFromUrl(url: string, fallback: string): string {
    const cleanUrl = url.split("?")[0];
    const dotIndex = cleanUrl.lastIndexOf(".");
    if (dotIndex === -1) {
      return fallback;
    }

    const ext = cleanUrl.slice(dotIndex);
    if (!ext || ext.length > 8) {
      return fallback;
    }

    return ext;
  }

  private async fetchText(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unable to download playlist (${response.status})`);
    }
    return response.text();
  }

  private async downloadHlsVideo(input: DownloadVideoInput): Promise<string> {
    const reportProgress = (value: number) => {
      if (!input.onProgress) {
        return;
      }
      input.onProgress(Math.max(0, Math.min(value, 1)));
    };

    const videoDir = `${DOWNLOADS_DIR}${input.videoId}/`;
    await FileSystem.makeDirectoryAsync(videoDir, { intermediates: true });
    reportProgress(0.02);

    const masterUrl = input.playbackUrl;
    const masterContent = await this.fetchText(masterUrl);
    reportProgress(0.08);
    const masterLines = masterContent.split(/\r?\n/);
    const masterCandidates = masterLines.filter(
      (line) => line.trim().length > 0 && !line.startsWith("#"),
    );

    const mediaRef = masterCandidates.find((line) =>
      line.toLowerCase().includes(".m3u8"),
    );
    const mediaUrl = mediaRef
      ? this.resolveAbsoluteUrl(masterUrl, mediaRef)
      : masterUrl;

    const mediaContent = await this.fetchText(mediaUrl);
    reportProgress(0.15);
    const mediaLines = mediaContent.split(/\r?\n/);

    const references = mediaLines.filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return false;
      }
      if (trimmed.startsWith("#")) {
        return (
          trimmed.startsWith("#EXT-X-KEY") || trimmed.startsWith("#EXT-X-MAP")
        );
      }
      return true;
    });

    const total = Math.max(references.length, 1);
    let completed = 0;
    const localFileByRemoteUri = new Map<string, string>();
    let segmentCount = 0;
    let keyCount = 0;
    let mapCount = 0;

    const getOrDownloadLocalFile = async (
      remoteUrl: string,
      kind: "segment" | "key" | "map",
    ) => {
      const existing = localFileByRemoteUri.get(remoteUrl);
      if (existing) {
        return existing;
      }

      const fallbackExt = kind === "segment" ? ".ts" : ".bin";
      const ext = this.getExtensionFromUrl(remoteUrl, fallbackExt);
      const name =
        kind === "segment"
          ? `segment-${++segmentCount}${ext}`
          : kind === "key"
            ? `key-${++keyCount}${ext}`
            : `map-${++mapCount}${ext}`;

      const localUri = `${videoDir}${name}`;
      await FileSystem.downloadAsync(remoteUrl, localUri);
      localFileByRemoteUri.set(remoteUrl, name);

      completed += 1;
      reportProgress(0.15 + 0.8 * Math.min(completed / total, 1));

      return name;
    };

    const rewrittenLines: string[] = [];
    for (const line of mediaLines) {
      const trimmed = line.trim();

      if (!trimmed) {
        rewrittenLines.push(line);
        continue;
      }

      if (
        trimmed.startsWith("#EXT-X-KEY") ||
        trimmed.startsWith("#EXT-X-MAP")
      ) {
        const uriMatch = line.match(/URI="([^"]+)"/);
        if (!uriMatch) {
          rewrittenLines.push(line);
          continue;
        }

        const remoteUri = this.resolveAbsoluteUrl(mediaUrl, uriMatch[1]);
        const localName = await getOrDownloadLocalFile(
          remoteUri,
          trimmed.startsWith("#EXT-X-KEY") ? "key" : "map",
        );
        rewrittenLines.push(line.replace(uriMatch[1], localName));
        continue;
      }

      if (!trimmed.startsWith("#")) {
        const remoteUri = this.resolveAbsoluteUrl(mediaUrl, trimmed);
        const localName = await getOrDownloadLocalFile(remoteUri, "segment");
        rewrittenLines.push(localName);
        continue;
      }

      rewrittenLines.push(line);
    }

    const localPlaylistUri = `${videoDir}index.m3u8`;
    await FileSystem.writeAsStringAsync(
      localPlaylistUri,
      rewrittenLines.join("\n"),
    );
    reportProgress(1);

    return localPlaylistUri;
  }

  private async saveDownloads(items: DownloadedVideo[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.DOWNLOAD_QUEUE, items);
  }

  async getDownloads(): Promise<DownloadedVideo[]> {
    const items =
      (await storage.getItem<DownloadedVideo[]>(STORAGE_KEYS.DOWNLOAD_QUEUE)) ||
      [];
    return items.sort(
      (a, b) =>
        new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime(),
    );
  }

  async getDownloadedVideo(videoId: string): Promise<DownloadedVideo | null> {
    const items = await this.getDownloads();
    const item = items.find((entry) => entry.videoId === videoId);
    if (!item) {
      return null;
    }

    const fileInfo = await FileSystem.getInfoAsync(item.localUri);
    if (!fileInfo.exists) {
      await this.removeDownloadedVideo(videoId);
      return null;
    }

    return item;
  }

  async downloadVideo(input: DownloadVideoInput): Promise<DownloadedVideo> {
    const existing = await this.getDownloadedVideo(input.videoId);
    if (existing) {
      return existing;
    }

    await this.ensureDownloadsDir();
    let localUri = "";

    if (this.isHlsUrl(input.playbackUrl)) {
      localUri = await this.downloadHlsVideo(input);
    } else {
      const ext = this.getFileExtension(input.playbackUrl);
      const destination = `${DOWNLOADS_DIR}${input.videoId}.${ext}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        input.playbackUrl,
        destination,
        {},
        ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          if (!input.onProgress || totalBytesExpectedToWrite <= 0) {
            return;
          }
          input.onProgress(totalBytesWritten / totalBytesExpectedToWrite);
        },
      );

      const result = await downloadResumable.downloadAsync();
      if (!result?.uri) {
        throw new Error("Download was interrupted");
      }

      localUri = result.uri;
    }

    const fileInfo = await FileSystem.getInfoAsync(localUri);

    const entry: DownloadedVideo = {
      videoId: input.videoId,
      title: input.title,
      channelName: input.channelName,
      channelAvatar: input.channelAvatar,
      thumbnailUrl: input.thumbnailUrl,
      playbackUrl: input.playbackUrl,
      localUri,
      downloadedAt: new Date().toISOString(),
      sizeBytes: fileInfo.exists ? fileInfo.size : undefined,
    };

    const items = await this.getDownloads();
    await this.saveDownloads([
      entry,
      ...items.filter((it) => it.videoId !== input.videoId),
    ]);

    return entry;
  }

  async removeDownloadedVideo(videoId: string): Promise<void> {
    const items = await this.getDownloads();
    const target = items.find((item) => item.videoId === videoId);

    if (target) {
      const videoDir = `${DOWNLOADS_DIR}${videoId}/`;
      const videoDirInfo = await FileSystem.getInfoAsync(videoDir);
      if (videoDirInfo.exists) {
        await FileSystem.deleteAsync(videoDir, { idempotent: true });
      }

      const fileInfo = await FileSystem.getInfoAsync(target.localUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(target.localUri, { idempotent: true });
      }
    }

    await this.saveDownloads(items.filter((item) => item.videoId !== videoId));
  }

  async clearAllDownloads(): Promise<void> {
    const items = await this.getDownloads();
    await Promise.all(
      items.map(async (item) => {
        const videoDir = `${DOWNLOADS_DIR}${item.videoId}/`;
        const videoDirInfo = await FileSystem.getInfoAsync(videoDir);
        if (videoDirInfo.exists) {
          await FileSystem.deleteAsync(videoDir, { idempotent: true });
        }

        const fileInfo = await FileSystem.getInfoAsync(item.localUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(item.localUri, { idempotent: true });
        }
      }),
    );
    await this.saveDownloads([]);
  }
}

export const offlineDownloadService = new OfflineDownloadService();
