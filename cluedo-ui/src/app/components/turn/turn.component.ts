import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameboardService} from '../../services/gameboard.service';
import {CharacterType} from '../../models/enums';
import {PossibilitiesDto} from '../../models/PossibilitiesDto';
import {Turn} from '../../models/Turn';

@Component({
  selector: 'turn',
  templateUrl: './turn.component.html',
  styleUrls: ['./turn.component.css']
})

export class TurnComponent implements OnInit {
  possibilities: PossibilitiesDto;
  @Input() currentTurn: Turn;
  private _character: CharacterType;
  @Output() passage = new EventEmitter<boolean>();
  @Output() roll = new EventEmitter<number>();
  @Input() gameId : number;

  @Input() set character(value: CharacterType) {
    this._character = value;
    if (value != undefined) this.getPossibilities()
  }
  get character():CharacterType {
    return this._character;
  }

  constructor(private gameApi: GameboardService) {}

  ngOnInit(){this.possibilities = {hasTurn:false, movesPossible: false, roomWithPassage: null}}

  getPossibilities(){
    this.gameApi.getChoices(this.character, this.gameId).subscribe(data => this.possibilities=(<PossibilitiesDto>data))
  }

  getRoll(roll: number){if(this.possibilities.movesPossible)this.roll.emit(roll)}

  takePassage(){if(this.possibilities.roomWithPassage != null)this.passage.emit(true)}

  getReason(){
    const message = "You can't play right now";
    if(!this.possibilities.hasTurn){
      return `${message}, it's not your turn yet.
      Player making their move: ${this.currentTurn.player.name} (${this.currentTurn.player.characterType})`;
    }
    if(!this.possibilities.movesPossible) return `${message}, you are unable to move.`;
    return message;
  }
}
