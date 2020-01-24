import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredients } from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: []
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  constructor(private shoppingListService: ShoppingListService) {}
  ingredients: Ingredients[];
  private igChangedSub: Subscription;

  ngOnDestroy(): void {
    this.igChangedSub.unsubscribe();
  }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.igChangedSub = this.shoppingListService.ingredientsChanged.subscribe(
      () => {
        this.ingredients = this.shoppingListService.getIngredients();
      }
    );
  }
  onEditItem(id: number) {
    this.shoppingListService.startedEditing.next(id);
  }
}
