import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import { DialogData } from "../note/note.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material";
import { MakeSuggestionService } from "../../services/make-suggestion.service";
import { CardType } from "../../models/enums";

@Component({
  selector: "app-make-suggestion",
  templateUrl: "./make-suggestion.component.html",
  styleUrls: ["./make-suggestion.component.css"]
})
export class MakeSuggestionComponent implements OnInit {
  readonly CARD_PATH = 'assets/img/cards';
  readonly errorString = 'Cards can not be loaded';
  @Input() asAccusation: boolean;
  @Input() gameId: number;
  @Input() character: any;
  @Output() canceller = new EventEmitter();
  constructor(
    public dialog: MatDialog,
    public suggestionService: MakeSuggestionService
  ) {}

  suggestionCards: Card[] = [
    {
      cardId: 0,
      cardType: CardType.CHARACTER,
      type: "",
      url: `${this.CARD_PATH}/character-card.png`
    },
    {
      cardId: 0,
      cardType: CardType.WEAPON,
      type: "",
      url: `${this.CARD_PATH}/weapon-card.png`
    },
    {
      cardId: 0,
      cardType: CardType.ROOM,
      type: "",
      url: `${this.CARD_PATH}/room-card.png`
    }
  ];
  allCards: Card[];

  ngOnInit() {
    this.suggestionService.getAllCards().subscribe((data: Card[]) => {
      this.allCards = data;
      // this.suggestionCards[2] = this.allCards.filter(c => c.cardId === givenCardId);
    });
  }

  get getCards() {
    return this.suggestionCards;
  }

  selectCard(type: CardType): void {
    if (this.allCards.filter(card => CardType[card.cardType as keyof typeof CardType] === type).length < 6) {
      this.dialog.open(ErrorScreen, {
        width: "available",
        panelClass: "my-dialog",
        data: this.errorString
      });
      throw new Error("Cards can not be loaded");
    }

    const dialogRef = this.dialog.open(ChooseCard, {
      width: "available",
      panelClass: "my-dialog",
      data: this.allCards.filter(
        card => CardType[card.cardType as keyof typeof CardType] === type
      )
    });

    dialogRef.componentInstance.cardPick.subscribe((card: Card) => {
      let index = 0;
      if (type === CardType.WEAPON) {
        index = 1;
      }
      this.suggestionCards[index] = card;
    });
  }

  sendSuggestion() {
    //const jsonCards = JSON.stringify(this.suggestionCards);
    //this.suggestionService.makeSuggestion(jsonCards).subscribe();
    //this.sentSuggestion = true;
  }

  cancel(){
    this.canceller.emit();
  }
}






export interface Card {
  cardId: number;
  cardType: CardType;
  type: string;
  url: string;
}

@Component({
  selector: "choose-card",
  templateUrl: "make-suggestion.card-dialog.html"
})
export class ChooseCard {
  @Output() cardPick = new EventEmitter<Card>();

  constructor(
    public dialogRef: MatDialogRef<ChooseCard>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  cardPicker(card) {
    this.cardPick.emit(card);
    this.dialogRef.close();
  }
}






@Component({
  selector: "error-screen",
  templateUrl: "error-screen.card-dialog.html"
})
export class ErrorScreen {
  constructor(
    public dialogRef: MatDialogRef<ErrorScreen>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
