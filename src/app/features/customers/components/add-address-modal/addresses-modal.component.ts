import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Address } from 'src/app/core/models/customer.model';

@Component({
  selector: 'app-addresses-modal',
  templateUrl: './addresses-modal.component.html',
  styleUrls: ['./addresses-modal.component.css']
})
export class AddressesModalComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add'; // To receive the mode
  @Input() address: Address | undefined;
  @Input() existingAddresses: Address[] = []; // To receive existing addresses
  addressForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      name: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      isPrimary: [false],
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.address) {
      this.addressForm.patchValue(this.address); // Pre-fill the form for editing
    }
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      const result = { ...this.address, ...this.addressForm.value };
      this.activeModal.close(result); // Return the updated/new address
    }
  }

  // onSubmit(): void {
  //   if (this.addressForm.valid) {
  //     const newAddress = this.addressForm.value;
  //     newAddress.id = Date.now(); // Generate a unique ID

  //     // Mark other addresses as not primary if this is set as primary
  //     if (newAddress.isPrimary) {
  //       this.existingAddresses.forEach((addr) => (addr.isPrimary = false));
  //     }

  //     this.activeModal.close(newAddress); // Send data back to parent
  //   }
  // }
}
