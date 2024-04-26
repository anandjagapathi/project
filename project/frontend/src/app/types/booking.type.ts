export interface Booking {
  id: number;
  carId: number;
  carName?: string;
  startDate: Date;
  endDate: Date;
  isConfirmed: boolean;
}
