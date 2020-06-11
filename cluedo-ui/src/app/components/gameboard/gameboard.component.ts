import {Component, Input, OnInit} from '@angular/core';
import { GameboardService } from '../../services/gameboard.service';
import {CharacterType} from '../../models/enums';
import {Turn} from '../../models/Turn';

interface GameboardDimensions {
  width: number,
  height: number,
  squareCount: number
}

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.css']
})

export class GameboardComponent implements OnInit {
  gameboard : any;
  @Input() gameId: number;
  @Input() playerId: number;
  playerCharacter: CharacterType;
  dimensions : GameboardDimensions;
  gwidth: number;
  tempChoices: any[];
  asAccusation: boolean = false;
  visibleSuggestionScreen: boolean = false;
  @Input() currentTurn: Turn;


  constructor(private api: GameboardService) { }

  ngOnInit() {
    this.getGameboard();
    this.getCharacterType();
  }

  moveRoom(x,y,roomType){
    this.move(x,y);
    this.asAccusation = false;
    this.visibleSuggestionScreen = true;
  }

  startAccusation() {
    this.asAccusation = true;
    this.visibleSuggestionScreen = true;
  }

  move(x,y){
    let choice = this.tempChoices == undefined ? this.tempChoices : this.tempChoices.filter(t => t.xcoord === x && t.ycoord === y);
    if(choice == undefined || choice.length > 0){
      this.api.move(this.playerCharacter,this.gameId,x,y).subscribe(d => {
        this.tempChoices = [];
        this.getGameboard();
      });
    }
  }

  takePassage(){
    this.api.takePassage(this.playerCharacter,this.gameId).subscribe(d => this.getGameboard());
  }

  skipTurn(){
    this.api.skipTurn(this.playerCharacter, this.gameId).subscribe(res=>console.log(res))
  }

  getPositions(roll){
    this.api.getMovablePositions(this.playerCharacter, this.gameId, roll).subscribe(data => {
      this.tempChoices = (<any[]> data);
    })
  }

  getGameboard() {
    //need the gameId to get de game data
    this.api.getGame(this.gameId).subscribe(data =>{
      this.gameboard = data;
      let width = Math.max.apply(Math, this.gameboard.tiles.map(t => t.xcoord).concat(this.gameboard.spawnTiles.map(t => t.xcoord)))+2;
      let height = Math.max.apply(Math, this.gameboard.tiles.map(t => t.ycoord).concat(this.gameboard.spawnTiles.map(t => t.ycoord)))+2;
      this.gwidth = (100 / (width*1.25));
      this.dimensions = { height: height, width: width, squareCount: height*width};
      console.log(this.gwidth);
    });
  }

  getCharacterType() {
    this.api.getCharacterType(this.playerId).subscribe(data => this.playerCharacter = (<CharacterType> data));
  }

  getChoice(x,y){
    let choice = this.tempChoices == undefined ? this.tempChoices : this.tempChoices.find(t => t.xcoord === x && t.ycoord === y);
    if(choice != undefined) return 'choice ';
    return ''
  }

  getSpawnTile(spawntile: any) {
    let capitalize = (s) => s.toUpperCase().charAt(0)+s.toLowerCase().slice(1);
    return `tile${capitalize(spawntile.characterType.toString())}  ${this.getChoice(spawntile.xcoord, spawntile.ycoord)}`
  }

  getCharacters(x,y) {
    return this.gameboard.characters.filter(c => c.position.xcoord == x && c.position.ycoord == y).map(c => c.characterType);
  }

  convertToUnit(numb){
    return numb+'vh';
  }

  getRoom(xcoord: any, ycoord: any, roomType: any) {
    return `${roomType} ${this.getChoice(xcoord, ycoord)}`
  }
}
