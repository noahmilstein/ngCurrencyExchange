import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketHistoryComponent } from './market-history.component';

describe('MarketHistoryComponent', () => {
  let component: MarketHistoryComponent;
  let fixture: ComponentFixture<MarketHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
