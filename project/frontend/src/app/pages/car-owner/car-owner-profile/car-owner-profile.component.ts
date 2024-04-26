import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNewCarModalComponent } from '../../../components/add-new-car-modal/add-new-car-modal.component';
import { CarService } from '../../../services/car.service';
import { Car } from '../../../types/car.type';
import { CarCardComponent } from '../../../components/car-card/car-card.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-car-owner-profile',
  standalone: true,
  imports: [CarCardComponent, MatButtonModule],
  templateUrl: './car-owner-profile.component.html',
  styleUrl: './car-owner-profile.component.scss',
})
export class CarOwnerProfileComponent {
  private readonly dialog = inject(MatDialog);
  private readonly carsService = inject(CarService);
  cars: Car[] = [];
  
  ngOnInit() { 
    this.getMyCars();
  }

  getMyCars() {
    this.cars = []
    this.carsService.getMyCars().subscribe((cars:any) => {
      this.cars = cars;
    });
  }
  showAddNewCarModal() {
    const dialogRef = this.dialog.open(AddNewCarModalComponent, {
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.getMyCars();
    });
  }
}
