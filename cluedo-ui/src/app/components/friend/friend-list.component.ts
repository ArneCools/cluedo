import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GameboardService } from "../../services/gameboard.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/User";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "friend-list",
  templateUrl: "./friend-list.component.html",
  styleUrls: ["./friend-list.component.css"]
})
export class FriendListComponent implements OnInit {
  friends: Array<User>;
  hasFriends: Boolean = false;
  requests: Array<User>;
  hasRequests: Boolean = false;
  addFriendForm: FormGroup;
  loading = true;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.refresh();
    this.addFriendForm = this.formBuilder.group({
      username: [""]
    });
  }

  refresh() {
    this.userService.getFriends().subscribe(f => {
      this.friends = <Array<User>>f;
      this.hasFriends = true;
    });
    this.userService.getPendings().subscribe(r => {
      this.requests = <Array<User>>r;
      this.hasRequests = true;
    });
  }

  open(friend: User) {}

  confirm(friend: User) {
    this.userService.confirmFriend(friend).subscribe(
      () => this.refresh(),
      error =>
        this._snackBar.open("An unexpected error has occured.", "Close", {
          duration: 5000
        })
    );
  }

  add() {
    const friend = this.addFriendForm.controls.username.value;
    this.userService.addFriend(friend).subscribe(
      () =>
        this._snackBar.open("A request has been sent to " + friend, "Close", {
          duration: 5000
        }),
      error =>
        this._snackBar.open("This user does not exist.", "Close", {
          duration: 5000
        })
    );
  }
}
