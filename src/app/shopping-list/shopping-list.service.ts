import { Injectable } from '@angular/core';
import { Ingredients } from '../shared/ingredients.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  startedEditing = new Subject();
  ingredientsChanged = new Subject();

  private ingredients: Ingredients[] = [new Ingredients('salt', 1)];

  constructor() {}

  public getIngredients(): Ingredients[] {
    return this.ingredients.slice();
  }

  public getIngredint(index: number) {
    return this.ingredients[index];
  }

  public setIngredients(value: Ingredients[]) {
    this.ingredients = value;
  }

  public addIngredint(ingredient: Ingredients) {
    const index = this.ingredients.findIndex(e => e.name === ingredient.name);
    if (index !== -1) {
      this.ingredients[index].amount += ingredient.amount;
    } else {
      this.ingredients.push(ingredient);
    }
    this.ingredientsChanged.next();
  }

  public addIngredints(ingredients: Ingredients[]) {
    ingredients.forEach(ingredient => {
      this.addIngredint(ingredient);
    });
    // this.ingredients.push(...ingredients);
    this.ingredientsChanged.next();
  }

  public updateIngredint(index: number, newIngredint: Ingredients) {
    this.ingredients[index] = newIngredint;
    this.ingredientsChanged.next();
  }

  public deleteIngredint(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next();
  }
}
