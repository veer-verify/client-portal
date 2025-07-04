import { TestBed } from '@angular/core/testing';

import { VideoConfigService } from './video-config.service';

describe('VideoConfigService', () => {
  let service: VideoConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
