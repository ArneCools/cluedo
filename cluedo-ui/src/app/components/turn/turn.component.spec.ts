import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnComponent } from './turn.component';
import {DiceComponent} from '../dice/dice.component';
import {MakeSuggestionComponent} from '../make-suggestion/make-suggestion.component';

describe('TurnComponent', () => {
  let component: TurnComponent;
  let fixture: ComponentFixture<TurnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnComponent, DiceComponent, MakeSuggestionComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
