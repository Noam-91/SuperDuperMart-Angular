import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWatchlistDialogComponentComponent } from './create-watchlist-dialog-component.component';

describe('CreateWatchlistDialogComponentComponent', () => {
  let component: CreateWatchlistDialogComponentComponent;
  let fixture: ComponentFixture<CreateWatchlistDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWatchlistDialogComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateWatchlistDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
