import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InfiniteScrollService {
  private observer: IntersectionObserver | null = null;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  setupInfiniteScroll(
    targetElement: Element,
    callback: () => Promise<void>,
    options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7,
    }
  ): void {
    this.observer = new IntersectionObserver(async (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        this.disconnect();
        this.loadingSubject.next(true);
        await callback();
      }
    }, options);

    this.observer.observe(targetElement);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
