import { Component, Inject, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarService } from '../../services/car.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Car } from '../../types/car.type';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-add-new-car-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: './add-new-car-modal.component.html',
  styleUrl: './add-new-car-modal.component.scss',
})
export class AddNewCarModalComponent {
  env = environment
  private readonly carService = inject(CarService);
  addNewCarForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    images: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    description: new FormControl(''),
    requirements: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<AddNewCarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Car
  ) {
    if (data) {
      this.addNewCarForm.patchValue({
        name: data.name,
        images: data.images,
        price: data.price,
        description: data.description,
        requirements: data.requirements,
      });
    }
  }

  onSave() {
    if (this.addNewCarForm.valid) {
      if (this.data) {
        console.log(this.addNewCarForm.value);
        this.carService
          .updateCar(
            this.data.id,
            this.addNewCarForm.value.name ?? '',
            +(this.addNewCarForm.value.price ?? 0),
            this.addNewCarForm.value.images ?? '',
            this.addNewCarForm.value.description ?? undefined,
            this.addNewCarForm.value.requirements ?? undefined
          )
          .subscribe({
            next: (res: any) => {
              alert('Car updated successfully');
              this.onNoClick();
            },
          });
      } else {
        this.carService
          .insertCar(
            this.addNewCarForm.value.name ?? '',
            +(this.addNewCarForm.value.price ?? 0),
            this.addNewCarForm.value.images ?? '',
            this.addNewCarForm.value.description ?? undefined,
            this.addNewCarForm.value.name ?? undefined
          )
          .subscribe({
            next: (res: any) => {
              alert('Car added successfully');
              this.onNoClick();
            },
          });
      }
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onImageChange(ev: any) {
    console.log(ev.target.files[0]);
    const file = ev.target.files[0];

    this.carService.uploadImage(file).subscribe({
      next: (res: any) => {
        this.addNewCarForm.patchValue({ images: `${res.id}` });
      },
    });
  }
}
