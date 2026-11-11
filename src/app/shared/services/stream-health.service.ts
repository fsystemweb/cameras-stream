import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';
import { CameraItem } from '../models/camera-item';
import { ActiveCamerasService } from './active-cameras.service';
import { StreamHelperService } from './stream-helper.service';

const AVAILABILITY_PROBE_INTERVAL_MS = 60_000;

/**
 * Periodically probes every configured URL-based camera stream and exposes a
 * live/offline status per camera id, so stale public IPTV links can be
 * spotted in the UI. Local webcams are treated as always live.
 */
@Injectable({
  providedIn: 'root',
})
export class StreamHealthService {
  private readonly activeCamerasService = inject(ActiveCamerasService);
  private readonly streamHelperService = inject(StreamHelperService);

  private readonly statusesSubject = new BehaviorSubject<
    Record<string, StreamHealthStatus>
  >({});

  private readonly probing = new Set<string>();

  private intervalSubscription: Subscription | null = null;

  get statuses$(): Observable<Record<string, StreamHealthStatus>> {
    return this.statusesSubject.asObservable();
  }

  getHealthStatus(cameraId: string): StreamHealthStatus {
    return this.statusesSubject.value[cameraId] ?? 'unknown';
  }

  start(intervalMs: number = AVAILABILITY_PROBE_INTERVAL_MS): void {
    if (this.intervalSubscription) return;

    this.checkAll();
    this.intervalSubscription = interval(intervalMs).subscribe(() =>
      this.checkAll(),
    );
  }

  stop(): void {
    this.intervalSubscription?.unsubscribe();
    this.intervalSubscription = null;
  }

  /**
   * Probes every non-local camera with a stream URL immediately.
   */
  checkAll(): void {
    const cameras = this.activeCamerasService.getCamerasSnapshot();

    for (const camera of cameras) {
      if (camera.localWebcam || !camera.streamUrl) continue;
      this.probe(camera);
    }
  }

  private probe(camera: CameraItem): void {
    // Skip cameras that are already being checked, so overlapping probes do
    // not stack up on slow networks or long check intervals.
    if (this.probing.has(camera.id)) return;

    this.probing.add(camera.id);

    this.streamHelperService
      .validateStreamUrl(camera.streamUrl as string)
      .then((isLive) => {
        this.setStatus(camera.id, isLive ? 'live' : 'offline');
      })
      .catch(() => {
        this.setStatus(camera.id, 'offline');
      })
      .finally(() => {
        this.probing.delete(camera.id);
      });
  }

  private setStatus(cameraId: string, status: StreamHealthStatus): void {
    this.statusesSubject.next({
      ...this.statusesSubject.value,
      [cameraId]: status,
    });
  }
}

export type StreamHealthStatus = 'live' | 'offline' | 'unknown';
