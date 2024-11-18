import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Customer } from 'src/app/core/models/customer.model';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.css']
})
export class CustomerModalComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add'; // Determines the context
  @Input() customer: Customer | undefined; // Customer data for edit

  customerForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.customer) {
      this.customerForm.patchValue(this.customer); // Populate form for editing
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const result = { ...this.customer, ...this.customerForm.value };
      this.activeModal.close(result); // Pass back updated customer data
    }
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
