import { Ingredients } from '../shared/ingredients.model';

export class Recipe {
  public name: string;
  public description: string;
  public imgUrl: string;
  public ingredients: Ingredients[];

  constructor(name: string, desc: string, imgUrl: string, ing: Ingredients[]) {
    this.name = name;
    this.description = desc;
    this.imgUrl = imgUrl;
    this.ingredients = ing;
  }
}
