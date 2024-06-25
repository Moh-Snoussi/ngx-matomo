import { Routes } from '@angular/router';

import { ArticleComponent } from './article/article.component';
import { ARTICLES } from './articles';
import { CATALOG } from './e-commerce.tokens';
import { OrderComponent } from './order/order.component';

export const E_COMMERCE_ROUTES: Routes = [
  {
    path: '',
    component: OrderComponent,
    title: 'eCommerce Order Page',
    providers: [{ provide: CATALOG, useValue: ARTICLES }],
  },
  {
    path: 'article/:id',
    component: ArticleComponent,
    title: 'eCommerce Article Page',
    data: {
      matomo: {
        idRegExp: /\d{3,}$/,
      },
    },
    providers: [{ provide: CATALOG, useValue: ARTICLES }],
  },
];
