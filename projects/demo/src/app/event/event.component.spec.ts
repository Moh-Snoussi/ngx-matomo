import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideMatomoTracking, withConfig } from 'ngx-matomo';

import { EventComponent } from './event.component';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventComponent],
      providers: [provideMatomoTracking(withConfig({ trackers: [] }))],
    });
    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
