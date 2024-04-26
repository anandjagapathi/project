import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  input,
} from '@angular/core';
import { Car } from '../../types/car.type';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CarDetailModalComponent } from '../car-detail-modal/car-detail-modal.component';
import { AuthService } from '../../services/auth.service';
import { CarService } from '../../services/car.service';
import { AddNewCarModalComponent } from '../add-new-car-modal/add-new-car-modal.component';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.scss',
})
export class CarCardComponent {
  env = environment
  @Input() car!: Car;
  @Output() refreshItems: EventEmitter<boolean> = new EventEmitter();

  private readonly dialog = inject(MatDialog);
  private readonly carService = inject(CarService);
  private readonly authSerivce = inject(AuthService);
  // is_owner: boolean = this.car.ownerName === this.authSerivce.getUser()?.name;
  is_owner: boolean = false;

  ngOnInit() {
    this.is_owner = this.car.ownerName === this.authSerivce.getUser()?.name;
  }

  showDetailsModal(car: Car) {
    if (this.authSerivce.isLoggedIn()) {
      this.dialog.open(CarDetailModalComponent, {
        data: {
          car: car,
          view:
            this.authSerivce.getUser()?.type === 'customer' ? 'rent' : 'simple',
        },
      });
    } else {
      alert('please login first');
    }
  }

  deleteCar(car: Car) {
    this.carService.deleteCar(car.id).subscribe({
      next: () => {
        alert('car deleted');
        this.refreshItems.emit(true);
      },
    });
  }

  editCar(car: Car) {
    const dialogRef = this.dialog.open(AddNewCarModalComponent, {
      data: car,
      height: '600px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshItems.emit(true);
    });
  }
}
