import { TestBed } from '@angular/core/testing';

import { withDummyTracker } from './matomo-features';
import { provideMatomoTracking } from './matomo-providers';
import { MatomoTracker } from './matomo-tracker.service';

describe('MatomoTrackerService', () => {
  let service: MatomoTracker;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMatomoTracking(withDummyTracker())],
    });
    service = TestBed.inject(MatomoTracker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
