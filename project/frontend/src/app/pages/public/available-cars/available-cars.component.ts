import { Component, inject } from '@angular/core';
import { CarService } from '../../../services/car.service';
import { AuthService } from '../../../services/auth.service';
import { Car } from '../../../types/car.type';
import { MatDialog } from '@angular/material/dialog';
import { CarDetailModalComponent } from '../../../components/car-detail-modal/car-detail-modal.component';
import { CarCardComponent } from '../../../components/car-card/car-card.component';

@Component({
  selector: 'app-available-cars',
  standalone: true,
  imports: [CarCardComponent],
  templateUrl: './available-cars.component.html',
  styleUrl: './available-cars.component.scss',
})
export class AvailableCarsComponent {
  private readonly carService = inject(CarService);
  private readonly authSerivce = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  cars: Car[] = [];

  getAllCars() {
    this.cars = []
    this.carService.getAllCars().subscribe((cars:any[]) => {
      this.cars = cars;
      return this.cars;
    });
  }

  showDetailsModal(car: Car) {
    if (this.authSerivce.isLoggedIn()) {
      this.dialog.open(CarDetailModalComponent, {
        data: {
          car: car,
          view:
            this.authSerivce.getUser()?.type === 'customer' ? 'rent' : 'view',
        },
      });
    }
    else {
      alert("please login first")
    }
  }

  ngOnInit() {
    this.getAllCars();
    this.authSerivce.onSigninStatusChange().subscribe(() => { 
      this.getAllCars();
    })
  }
}
