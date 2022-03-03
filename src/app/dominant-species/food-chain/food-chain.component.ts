import { Component, OnInit } from '@angular/core';
import {AnimalType} from "../model";

@Component({
  selector: 'ds-food-chain',
  templateUrl: './food-chain.component.html',
  styleUrls: ['./food-chain.component.scss']
})
export class FoodChainComponent implements OnInit {

  foodChain = [
    AnimalType.MAMMALS,
    AnimalType.REPTILES,
    AnimalType.BIRDS,
    AnimalType.AMPHIBIANS,
    AnimalType.ARACHNIDS,
    AnimalType.INSECTS
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
