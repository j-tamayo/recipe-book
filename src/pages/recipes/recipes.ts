import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EditRecipePage } from '../edit-recipe/edit-recipe';

import { RecipesService } from '../../services/recipes';
import { Recipe } from '../../models/recipe';

@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage implements OnInit {
  recipes : Recipe[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private recipesService: RecipesService
  ) {
  }

  ngOnInit() {
    this.loadItems();
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  onLoadRecipe() {

  }

  loadItems() {
    this.recipes = this.recipesService.getRecipes();
  }

  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

}
