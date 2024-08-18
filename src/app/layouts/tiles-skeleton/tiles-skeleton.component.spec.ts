import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesSkeletonComponent } from './tiles-skeleton.component';

describe('TilesSkeletonComponent', () => {
  let component: TilesSkeletonComponent;
  let fixture: ComponentFixture<TilesSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TilesSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TilesSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
