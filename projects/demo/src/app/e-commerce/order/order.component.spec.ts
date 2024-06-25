import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideMatomoTracking, withConfig } from 'ngx-matomo';

import { ArticleComponent } from '../article/article.component';
import { ARTICLES } from '../articles';
import { CATALOG } from '../e-commerce.tokens';
import { OrderComponent } from './order.component';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderComponent, ArticleComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideMatomoTracking(withConfig({ trackers: [] })),
        { provide: CATALOG, useValue: ARTICLES },
      ],
    });
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
