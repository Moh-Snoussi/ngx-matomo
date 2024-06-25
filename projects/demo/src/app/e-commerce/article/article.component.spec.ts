import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';

import { provideMatomoTracking, withMockedTracker } from 'ngx-matomo';

import { CATALOG } from '../e-commerce.tokens';
import { ArticleComponent } from './article.component';
import { ARTICLES } from '../articles';

describe('ArticleComponent', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let router: Router;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let route: ActivatedRoute;
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ArticleComponent],
      providers: [
        { provide: CATALOG, useValue: ARTICLES },
        provideRouter([]),
        provideLocationMocks(),
        provideMatomoTracking(withMockedTracker()),
      ],
    });
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
