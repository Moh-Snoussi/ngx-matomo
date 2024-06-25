import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideMatomoTracking, withConfig } from 'ngx-matomo';

import { MediaComponent } from './media.component';

describe('MediaComponent', () => {
  let component: MediaComponent;
  let fixture: ComponentFixture<MediaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MediaComponent],
      providers: [provideMatomoTracking(withConfig({ trackers: [] }))],
    });
    fixture = TestBed.createComponent(MediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
