import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  constructor(private recipeService: RecipeService) {}
  recipes: Recipe[];
  recipesChangedSub: Subscription;

  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
    this.recipesChangedSub = this.recipeService.recipesChanged.subscribe(() => {
      this.recipes = this.recipeService.getRecipes();
    });
  }
  ngOnDestroy(): void {
    this.recipesChangedSub.unsubscribe();
  }
}
