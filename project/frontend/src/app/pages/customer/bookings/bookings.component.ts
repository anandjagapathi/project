import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../types/booking.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss',
})
export class BookingsComponent {
  private readonly bookingService = inject(BookingService);
  displayedColumns: string[] = ['carName', 'startDate', 'endDate', 'action'];
  dataSource: Booking[] = [];

  ngOnInit() {
    this.getBookings()
  }

  getBookings() {
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.dataSource = bookings;
      },
    });
  }

  cancelBooking(id: number) {
    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        this.getBookings();
        alert('Booking has been canceled');
      },
    });
  }
}
