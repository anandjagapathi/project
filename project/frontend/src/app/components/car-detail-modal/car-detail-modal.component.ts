import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Car } from '../../types/car.type';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { CarService } from '../../services/car.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment.development';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-car-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './car-detail-modal.component.html',
  styleUrl: './car-detail-modal.component.scss',
})
export class CarDetailModalComponent {
  env = environment;
  private readonly bookingService = inject(BookingService);
  private readonly carService = inject(CarService);

  car: Car = this.data.car;
  isBookingAvailable: boolean = false;
  bookingStartDate: Date | null = new Date();
  bookingEndDate: Date | null = new Date();

  campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  constructor(
    public dialogRef: MatDialogRef<CarDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { car: Car; view: 'simple' | 'rent' }
  ) {
    console.log(this.data);
    this.campaignOne.valueChanges.subscribe({
      next: (value) => {
        this.bookingStartDate = value.start ?? null;
        this.bookingEndDate = value.end ?? null;
      },
    });
  }

  async checkForBooking() {
    if (this.bookingStartDate && this.bookingEndDate) {

      this.bookingService
        .isBookingAvailablity(
          this.car.id,
          this.bookingStartDate,
          this.bookingEndDate
        )
        .then((res: boolean) => {
    
          this.isBookingAvailable = res;
          if (!this.isBookingAvailable) alert('booking not available');
        })
        .catch(() => {
          alert('booking not available');
          this.isBookingAvailable = false;
        });
    }
  }

  bookCar() {
    if (this.bookingStartDate && this.bookingEndDate) {
      this.bookingService
        .addBooking({
          carId: this.car.id,
          startDate: this.bookingStartDate,
          endDate: this.bookingEndDate,
          isConfirmed: false,
          carName: this.car.name,
          id: 0,
        })
        .subscribe((res) => {
          if (res) {
            alert('Booking added successfully');
            this.dialogRef.close();
          }
        });
    }
  }
}
