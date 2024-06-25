import { filter, map } from 'rxjs/operators';

import { AsyncPipe, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { isDefined } from '../../../helpers';
import { CATALOG } from '../e-commerce.tokens';

@Component({
  selector: 'demo-article',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, CurrencyPipe, AsyncPipe],
  templateUrl: './article.component.html',
  styleUrls: [],
})
export class ArticleComponent {
  private readonly catalog = inject(CATALOG);
  public readonly article$ = inject(ActivatedRoute).params.pipe(
    map((params) => this.catalog.find((a) => a.id === +params['id'])),
    filter(isDefined),
  );
}
