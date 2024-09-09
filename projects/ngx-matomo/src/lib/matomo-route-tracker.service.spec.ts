import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { withDummyTracker } from './matomo-features';
import { provideMatomoTracking } from './matomo-providers';
import { MatomoRouteTracker } from './matomo-route-tracker.service';

let service: MatomoRouteTracker;
TestBed.runInInjectionContext(() => {
  service = new MatomoRouteTracker();
});

TestBed.configureTestingModule({

    providers: [
      provideRouter([]),
      provideLocationMocks(),
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({}),
        },
      },
      provideMatomoTracking(withDummyTracker()),
    ],
  });

describe('MatomoRouteTrackerService', () => {


  beforeEach(() => {



  });

  it('should be created', async () => {
    expect(service).toBeTruthy();
  });
});
