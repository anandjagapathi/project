import { Injectable, inject } from '@angular/core';
import { Observable, finalize, from } from 'rxjs';
import { Booking } from '../types/booking.type';
import { AuthService } from './auth.service';
import { createItem, deleteItem, readItems } from '@directus/sdk';
import moment from 'moment';
import { UIService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly authService = inject(AuthService);
  private readonly ui = inject(UIService);
  private client = this.authService.directus_client;

  constructor() {}

  getBookings(): Observable<any> {
    this.ui.showSpinner();
    return from(
      this.client.request(
        readItems('bookings', {
          filter: {
            user: {
              _eq: '$CURRENT_USER',
            },
          },
          fields: ['*', 'car.*', 'user.*'],
        })
      )
    ).pipe(finalize(() => this.ui.hideSpinner())); ;
  }

  addBooking(booking: Booking) {
    this.ui.showSpinner();
    return from(
      this.client.request(
        createItem('bookings', {
          car: booking.carId,
          start_date: moment(booking.startDate).format('YYYY-MM-DD'),
          end_date: moment(booking.endDate).format('YYYY-MM-DD'),
          status: 'accepted',
          user: this.authService.getUser()?.id,
        })
      )
    ).pipe(finalize(() => this.ui.hideSpinner())); ;
  }

  async isBookingAvailablity(carId: number, _startDate: Date, _endDate: Date) {
    this.ui.showSpinner();
    const carBookings = await this.client.request(
      readItems('bookings', {
        filter: {
          car: {
            _eq: carId,
          },
          status: {
            _eq: 'accepted',
          },
        },
      })
    );

    const datesToBeChecked = this.getDatesBetween(_startDate, _endDate);

    for (let index = 0; index < carBookings.length; index++) {
      const carBooking: any = carBookings[index];
      const carBookingDates = this.getDatesBetween(
        new Date(carBooking.start_date),
        new Date(carBooking.end_date)
      );

      if (this.checkArrayMatch(carBookingDates, datesToBeChecked)) {
        this.ui.hideSpinner();
        return false;
      }
    }

    this.ui.hideSpinner()
    return true;
  }

  cancelBooking(id: number) {
    this.ui.showSpinner();
    return from(
      this.client.request(
        deleteItem('bookings', id)
      )
    ).pipe(
      finalize(() => this.ui.hideSpinner())
    ); 
  };

  private getDatesBetween(_startDate: Date, _endDate: Date): string[] {
    const startDate = moment(_startDate);
    const endDate = moment(_endDate);
    const datesToBeChecked = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      datesToBeChecked.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'days');
    }

    return datesToBeChecked;
  }

  private checkArrayMatch(array1: string[], array2: string[]) {
    return array1.some((value) => array2.includes(value));
  }
}
