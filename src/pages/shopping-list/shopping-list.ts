import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { SLOptionsPage } from './sl-options/sl-options';

import { ShoppingListService } from '../../services/shopping-list';

import { Ingredient } from '../../models/ingredient';

@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  listItems: Ingredient[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private slService: ShoppingListService,
    private popoverCtrl: PopoverController
  ) {

  }

  ionViewWillEnter() {
    this.loadItems();
  }

  onAddItem(form: NgForm) {
    this.slService.addItem(form.value.ingredientName, form.value.amount);
    form.reset();
    this.loadItems();
  }

  onCheckItem(index: number) {
    this.slService.removeItem(index);
    this.loadItems();
  }

  onShowOptions(event: MouseEvent) {
    const popover = this.popoverCtrl.create(SLOptionsPage);
    popover.present({ev: event});
  }

  private loadItems() {
    this.listItems = this.slService.getItems();
  }

}
