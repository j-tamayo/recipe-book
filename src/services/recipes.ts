import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

import { AuthService } from './auth';

import { Recipe } from '../models/recipe';
import { Ingredient } from '../models/ingredient';

@Injectable()
export class RecipesService {
  private recipes: Recipe[] = [];

  constructor(private http: Http, private authService: AuthService) {

  }

  addRecipe(
    title: string,
    description: string,
    difficulty: string,
    ingredients: Ingredient[]
  ){
    this.recipes.push(new Recipe(title, description, difficulty, ingredients));
    console.log(this.recipes);
  }

  getRecipes() {
    return this.recipes.slice();
  }

  updateRecipe(
    index: number,
    title: string,
    description: string,
    difficulty: string,
    ingredients: Ingredient[]
  ) {
    this.recipes[index] = new Recipe(title, description, difficulty, ingredients);
  }

  removeRecipe(index: number) {
    this.recipes.splice(index, 1);
  }

  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;

    return this.http
      .put(
        'https://ionici2-recipebook.firebaseio.com/' + userId + '/recipes.json?auth=' + token,
        this.recipes
      )
      .map((response: Response) => response.json());
  }

  fetchList(token: string) {
    const userId = this.authService.getActiveUser().uid;

    return this.http.get(
      'https://ionici2-recipebook.firebaseio.com/' + userId + '/recipes.json?auth=' + token
    )
    .map((response: Response) => {
      return response.json();
    })
    .do((recipes: Recipe[]) => {
      if (recipes) {
        this.recipes = recipes;
      } else {
        this.recipes = [];
      }
    });
  }
}
