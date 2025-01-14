import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommentsComponent } from './edit-comments.component';

describe('EditCommentsComponent', () => {
  let component: EditCommentsComponent;
  let fixture: ComponentFixture<EditCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCommentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
