import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';
import { Ingredients } from './ingredients.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const userId = this.authService.userDetails.id;
    const recipes = this.recipeService.getRecipes();

    this.http
      .put(
        'https://ng-recipebook-31461.firebaseio.com/recipes/' +
          userId +
          '.json',
        recipes
      )
      .subscribe(res => {
        // console.log(res);
      });
  }

  fetchRecipes() {
    const userId = this.authService.userDetails.id;
    return this.http
      .get(
        'https://ng-recipebook-31461.firebaseio.com/recipes/' + userId + '.json'
      )
      .pipe(
        map((recipes: Recipe[]) => {
          if (recipes) {
            return recipes.map(recipe => {
              return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : []
              };
            });
          } else {
            return [
              new Recipe(
                'Rasmalai',
                // tslint:disable-next-line:max-line-length
                'Rasmalai, is a traditional Bengali dessert which is extremely delicious. It is made with chenna, milk, kesar, sugar and milk powder. Rasmalai is a dessert which has soft and spongy chenna balls dipped in sweet and delicious milk. It is an easy-to-make recipe and will be ready to serve in 30 minutes. Prepare it for a birthday party or anniversary and kitty parties. it can also be prepared on festive occasions. Try the simple recipe now and enjoy it with your friends and family.',
                'https://recipes.timesofindia.com/thumb/73583420.cms?imgsize=32710&width=800&height=800',
                [
                  new Ingredients('1 litre full cream milk', 1),
                  new Ingredients('1 tablespoon lemon juice', 1),
                  new Ingredients('1 tablespoon sugar', 1),
                  new Ingredients('1/2 teaspoon green cardamom', 1),
                  new Ingredients('1 tablespoon milk powder', 1)
                ]
              ),
              new Recipe(
                'Fried Rice',
                // tslint:disable-next-line:max-line-length
                'Fried Rice is most simple and delicious dish, which is extremely easy to cook. This quick rice recipe can be cooked in various interesting ways in the shortest possible time. This is a perfect go-to dish for every rice lover. You just need a few easily available ingredients and you are good to go! Here’s how you make this lip-smacking recipe at home by following four simple steps. Made with vegetables and cooked rice, it is a wholesome meal, which can be served for lunch or dinner. You can add your own twist to this delectable rice recipe, if like it spicy you can start by frying some dried red chilies, once the veggies are fried and ooze out a smoky flavour you can add cooked rice and stir fry this amazing amalgamation of spices and soy sauce. The best thing about this recipe is that you can tweak ingredients as per your palate preference.',
                'https://recipes.timesofindia.com/thumb/53111677.cms?imgsize=160141&width=800&height=800',
                [
                  new Ingredients('500 gm boiled basmati rice', 1),
                  new Ingredients('1 bunch chopped spring onions', 1),
                  new Ingredients('1/2 cup chopped carrot', 1),
                  new Ingredients('1/2 cup sunflower oil', 1),
                  new Ingredients('1/2 cup chopped capsicum', 1)
                ]
              )
            ];
          }
        }),
        tap((recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
