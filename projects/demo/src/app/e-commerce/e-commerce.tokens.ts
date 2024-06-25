import { InjectionToken } from '@angular/core';
import { Article } from './article/article.model';

export const CATALOG = new InjectionToken<Article[]>('Catalog');
