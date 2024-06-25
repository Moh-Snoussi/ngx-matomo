import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideMatomoTracking, withMockedTracker } from 'ngx-matomo';

import { ConsentComponent } from './consent.component';

describe('ConsentComponent', () => {
  let component: ConsentComponent;
  let fixture: ComponentFixture<ConsentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsentComponent],
      providers: [provideMatomoTracking(withMockedTracker())],
    });
    fixture = TestBed.createComponent(ConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
