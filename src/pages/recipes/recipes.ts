import { Component, OnInit } from '@angular/core';
import {
  NavController,
  NavParams,
  PopoverController,
  LoadingController,
  AlertController
} from 'ionic-angular';

import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { RecipePage } from '../recipe/recipe';
import { DatabaseOptionsPage } from '../database-options/database-options';

import { RecipesService } from '../../services/recipes';
import { AuthService } from '../../services/auth';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage implements OnInit {
  recipes : Recipe[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private recipesService: RecipesService,
    private popoverCtrl: PopoverController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.loadItems();
  }

  ionViewWillEnter() {
    this.loadItems();
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
  }

  loadItems() {
    this.recipes = this.recipesService.getRecipes();
  }

  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onShowOptions(event: MouseEvent) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);

    popover.present({ev: event});

    popover.onDidDismiss(data => {

      if (data && data.action == 'load') {
        loading.present();

        this.authService.getActiveUser().getToken()
          .then((token: string) => {
            this.recipesService.fetchList(token)
            .subscribe(
              (list: Recipe[]) => {
                loading.dismiss();
                if (list) {
                  this.recipes = list;
                } else {
                  this.recipes = [];
                }
              },
              error => {
                loading.dismiss();
                this.handleError(error.json().error);
              }
            );
          });

      } else if (data && data.action == 'store') {
        loading.present();

        this.authService.getActiveUser().getToken()
          .then((token: string) => {
            this.recipesService.storeList(token)
            .subscribe(
              () => loading.dismiss(),
              error => {
                loading.dismiss();
                this.handleError(error.json().error);
              }
            );
          });
      }
    })
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

}
