import { TestBed } from '@angular/core/testing';
import { CameraItem } from '../models/camera-item';
import { ActiveCamerasService } from './active-cameras.service';
import { StreamHelperService } from './stream-helper.service';
import { StreamHealthService } from './stream-health.service';

describe('StreamHealthService', () => {
  let service: StreamHealthService;
  let activeCamerasService: { getCamerasSnapshot: jest.Mock };
  let streamHelperService: { validateStreamUrl: jest.Mock };
  let validateSpy: jest.Mock;

  const cameras: CameraItem[] = [
    { id: 'local', title: 'Local', localWebcam: true, selected: false },
    {
      id: 'live-cam',
      title: 'Live stream',
      streamUrl: 'https://example.com/live.m3u8',
      localWebcam: false,
      selected: false,
    },
    {
      id: 'broken-cam',
      title: 'Broken stream',
      streamUrl: 'https://example.com/broken.m3u8',
      localWebcam: false,
      selected: false,
    },
    {
      id: 'no-url-cam',
      title: 'No url camera',
      localWebcam: false,
      selected: false,
    },
  ];

  beforeEach(async () => {
    activeCamerasService = {
      getCamerasSnapshot: jest.fn(() => cameras),
    };
    validateSpy = jest.fn((url: string) =>
      url.includes('live') ? Promise.resolve(true) : Promise.resolve(false),
    );
    streamHelperService = {
      validateStreamUrl: validateSpy,
    };

    await TestBed.configureTestingModule({
      providers: [
        StreamHealthService,
        { provide: ActiveCamerasService, useValue: activeCamerasService },
        { provide: StreamHelperService, useValue: streamHelperService },
      ],
    }).compileComponents();

    service = TestBed.inject(StreamHealthService);
  });

  function allProbesSettled(): Promise<void> {
    return Promise.resolve();
  }

  it('reports unknown for cameras that have not been checked', () => {
    expect(service.getHealthStatus('live-cam')).toBe('unknown');
    expect(service.getHealthStatus('does-not-exist')).toBe('unknown');
  });

  it('marks URL-based cameras live or offline after probing', async () => {
    service.checkAll();
    await allProbesSettled();

    expect(service.getHealthStatus('live-cam')).toBe('live');
    expect(service.getHealthStatus('broken-cam')).toBe('offline');
  });

  it('never probes local webcams or cameras without a stream url', async () => {
    service.checkAll();
    await allProbesSettled();

    expect(validateSpy).toHaveBeenCalledTimes(2);
    const probedUrls = validateSpy.mock.calls.map((call) => String(call[0]));
    expect(probedUrls).not.toContain('local');
    expect(probedUrls).not.toContain('no-url-cam');
    expect(service.getHealthStatus('local')).toBe('unknown');
    expect(service.getHealthStatus('no-url-cam')).toBe('unknown');
  });

  it('publishes status updates through its statuses$ observable', async () => {
    const emittedStatuses: Record<string, string>[] = [];
    service.statuses$.subscribe((statuses) => emittedStatuses.push(statuses));

    service.checkAll();
    await allProbesSettled();

    expect(emittedStatuses.length).toBeGreaterThan(1);
    const latest = emittedStatuses[emittedStatuses.length - 1] as Record<
      string,
      string
    >;
    expect(latest['live-cam']).toBe('live');
    expect(latest['broken-cam']).toBe('offline');
  });

  it('turns a failed probe into an offline status', async () => {
    streamHelperService.validateStreamUrl = jest.fn(() =>
      Promise.reject(new Error('network error')),
    );

    service.checkAll();
    await Promise.resolve();
    await Promise.resolve();

    expect(service.getHealthStatus('live-cam')).toBe('offline');
  });
});
