import { Injectable, inject } from '@angular/core';
import { finalize, from, map } from 'rxjs';
import { Car } from '../types/car.type';
import { AuthService } from './auth.service';
import {
  readItems,
  uploadFiles,
  createItem,
  deleteItem,
  updateItem,
} from '@directus/sdk';
import { UIService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private readonly authService = inject(AuthService);
  private client = this.authService.directus_client;
  private ui = inject(UIService);

  getAllCars() {
    this.ui.showSpinner();
    return from(
      this.client.request(
        readItems('cars', {
          fields: ['*', 'owner.id', 'owner.first_name', 'owner.last_name'],
        })
      )
    ).pipe(
      map((res) => {
        res = res.map((car: any) => {
          return {
            id: car.id,
            images: `${car.image}`,
            name: car.name,
            ownerName: car.owner.first_name + ' ' + car.owner.last_name,
            price: car.price,
            description: car.details,
            requirements: car.special_requirements,
          } as Car;
        });
        return res;
      }),
      finalize(() => this.ui.hideSpinner())
    );
  }

  getMyCars() {
    this.ui.showSpinner();
    return from(
      this.client.request(
        readItems('cars', {
          fields: ['*', 'owner.id', 'owner.first_name', 'owner.last_name'],
          filter: {
            owner: {
              id: {
                _eq: '$CURRENT_USER',
              },
            },
          },
        })
      )
    ).pipe(
      map((res) => {
        res = res.map((car: any) => {
          return {
            id: car.id,
            images: `${car.image}`,
            name: car.name,
            ownerName: car.owner.first_name + ' ' + car.owner.last_name,
            price: car.price,
            description: car.details,
            requirements: car.special_requirements,
          } as Car;
        });
        return res;
      }),
      finalize(() => this.ui.hideSpinner())
    );
  }

  insertCar(
    name: string,
    price: number,
    image: string,
    description?: string,
    requirements?: string
  ) {
    this.ui.showSpinner();
    return from(
      this.client.request(
        createItem('cars', {
          name: name,
          price: price,
          details: description,
          special_requirements: requirements,
          image: image,
          owner: this.authService.getUser()?.id,
        })
      )
    ).pipe(finalize(() => this.ui.hideSpinner()));
  }

  deleteCar(id: number) {
    this.ui.showSpinner();
    return from(this.client.request(deleteItem('cars', id))).pipe(
      finalize(() => this.ui.hideSpinner())
    );
  }

  updateCar(
    id: number,
    name: string,
    price: number,
    image: string,
    description?: string,
    requirements?: string
  ) {
    this.ui.showSpinner();
    return from(
      this.client.request(
        updateItem('cars', id, {
          name: name,
          price: price,
          details: description,
          special_requirements: requirements,
          image: image,
        })
      )
    ).pipe(finalize(() => this.ui.hideSpinner()));
  }

  uploadImage(file: File) {
    this.ui.showSpinner();
    const formData = new FormData();

    formData.append('file', file);

    return from(this.client.request(uploadFiles(formData))).pipe(
      finalize(() => this.ui.hideSpinner())
    );
  }
}
