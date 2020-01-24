import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  userEmail = null;
  private userSub: Subscription;
  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuth = !!user;
      this.userEmail = user ? user.email : null;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  onSave() {
    this.dataStorageService.storeRecipes();
  }

  logout() {
    this.authService.logout();
  }

  onFetch() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
