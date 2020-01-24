import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Ingredients } from 'src/app/shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  editMode = false;
  editedItem: Ingredients;
  editedItemId: number;

  constructor(private shoppingListService: ShoppingListService) {}
  startedEditingSubscription: Subscription;

  ngOnInit() {
    this.startedEditingSubscription = this.shoppingListService.startedEditing.subscribe(
      (id: number) => {
        this.editMode = true;
        this.editedItemId = id;
        this.editedItem = this.shoppingListService.getIngredint(id);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onAddItem(form: NgForm) {
    const newIngredient = new Ingredients(form.value.name, form.value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredint(
        this.editedItemId,
        newIngredient
      );
    } else {
      this.shoppingListService.addIngredint(newIngredient);
    }
    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.editedItem = null;
    this.editedItemId = null;
  }

  onDelete() {
    this.shoppingListService.deleteIngredint(this.editedItemId);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.startedEditingSubscription.unsubscribe();
  }
}
