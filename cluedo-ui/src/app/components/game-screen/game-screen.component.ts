import { Component, OnInit } from '@angular/core';
import { LobbyDetails } from '../../models/LobbyDetails';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import {Turn} from '../../models/Turn';
import {TurnService} from '../../services/turn.service';
import {interval} from 'rxjs';

@Component({
  selector: 'app-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.css']
})
export class GameScreenComponent implements OnInit {

  lobbyDetails: LobbyDetails;
  currentTurn: Turn;
  timer = interval(10000);

  constructor(
    private router: Router,
    private noteService: NoteService,
    private turnService: TurnService
    ) { }

  ngOnInit() {
    this.lobbyDetails = <LobbyDetails> history.state.lobbyDetails;
    if (!this.lobbyDetails) this.router.navigate(['/lobbies']);

    this.getTurn()

    // this.fetchNoteBook();
  }

  getTurnLimit(){return `End of current turn: ${this.currentTurn.timeRemaining}m`}

  getTurn() {
    const callForTurn = ()=> this.turnService.getTurn(this.lobbyDetails.cluedoId).subscribe(data => this.currentTurn = (<Turn> data));

    if(this.currentTurn == undefined) callForTurn();
    this.timer.subscribe(callForTurn);
  }



}
