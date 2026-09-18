export const TOTAL_FRAMES = 181;
export const PRIORITY_FRAME_COUNT = 15;

export function getFramePath(frameIndex: number): string {
  // frameIndex is 0-indexed (0 to 180). Map to 1..181 padded 3 digits
  const frameNumber = Math.min(Math.max(frameIndex + 1, 1), TOTAL_FRAMES);
  const padded = String(frameNumber).padStart(3, '0');
  return `/hero-frames/ezgif-frame-${padded}.jpg`;
}

export class ImageSequenceManager {
  private images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
  private loadedMap: boolean[] = new Array(TOTAL_FRAMES).fill(false);
  private onProgressCallback?: (progress: number, loadedCount: number) => void;
  private isPriorityLoaded = false;
  private isLoading = false;

  constructor(onProgress?: (progress: number, loadedCount: number) => void) {
    this.onProgressCallback = onProgress;
  }

  public async loadPriorityFrames(): Promise<void> {
    if (this.isPriorityLoaded) return;
    this.isLoading = true;

    const priorityPromises: Promise<void>[] = [];
    for (let i = 0; i < PRIORITY_FRAME_COUNT; i++) {
      priorityPromises.push(this.loadSingleFrame(i));
    }

    await Promise.all(priorityPromises);
    this.isPriorityLoaded = true;

    // Start loading the rest in background chunks
    this.loadRemainingFramesInBackground();
  }

  private isDisposed = false;

  public dispose(): void {
    this.isDisposed = true;
    this.isLoading = false;
  }

  private loadSingleFrame(index: number): Promise<void> {
    return new Promise((resolve) => {
      if (this.images[index] && this.loadedMap[index]) {
        resolve();
        return;
      }

      const img = new Image();
      let settled = false;
      const done = (success: boolean) => {
        if (settled) return;
        settled = true;
        this.loadedMap[index] = success;
        if (success) {
          this.images[index] = img;
          this.notifyProgress();
        }
        resolve();
      };

      img.onload = () => done(true);
      img.onerror = () => done(false);
      setTimeout(() => done(false), 1500);
      img.src = getFramePath(index);
    });
  }

  private async loadRemainingFramesInBackground(): Promise<void> {
    const BATCH_SIZE = 12;
    for (let i = PRIORITY_FRAME_COUNT; i < TOTAL_FRAMES; i += BATCH_SIZE) {
      if (this.isDisposed) break;
      const batchPromises: Promise<void>[] = [];
      for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL_FRAMES); j++) {
        batchPromises.push(this.loadSingleFrame(j));
      }
      await Promise.all(batchPromises);
      await new Promise((r) => setTimeout(r, 20));
    }
    this.isLoading = false;
  }

  private notifyProgress(): void {
    if (!this.onProgressCallback) return;
    const loadedCount = this.loadedMap.filter(Boolean).length;
    // Initial priority progress scaled to 0-100% for preloader
    const priorityLoaded = this.loadedMap.slice(0, PRIORITY_FRAME_COUNT).filter(Boolean).length;
    const priorityProgress = (priorityLoaded / PRIORITY_FRAME_COUNT) * 100;
    this.onProgressCallback(priorityProgress, loadedCount);
  }

  public getFrame(index: number): HTMLImageElement | null {
    const safeIndex = Math.min(Math.max(Math.round(index), 0), TOTAL_FRAMES - 1);
    if (this.images[safeIndex] && this.loadedMap[safeIndex]) {
      return this.images[safeIndex];
    }
    // Fallback search to nearest loaded frame
    for (let offset = 1; offset < 20; offset++) {
      if (safeIndex - offset >= 0 && this.images[safeIndex - offset]) {
        return this.images[safeIndex - offset];
      }
      if (safeIndex + offset < TOTAL_FRAMES && this.images[safeIndex + offset]) {
        return this.images[safeIndex + offset];
      }
    }
    return this.images[0];
  }
}
