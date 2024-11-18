import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer } from 'src/app/core/models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { ToastrService } from 'ngx-toastr';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerModalComponent } from '../../components/customer-modal/customer-modal.component';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  customerForm: FormGroup;

  searchQuery: Subject<string> = new Subject<string>(); // Holds the current search input
  filteredCustomers: Customer[] = []; // Filtered customers list

  // properties for pagination
  paginatedCustomers: Customer[] = []; // Customers for the current page
  currentPage = 1; // Current page
  itemsPerPage = 5; // Number of customers per page
  totalPages = 0; // Total number of pages
  pages: number[] = [];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadCustomers();

    this.searchQuery.pipe(debounceTime(300)).subscribe((query) => {
      const lowerQuery = query.toLowerCase();


      this.filteredCustomers = this.customers.filter((customer) =>
        customer.name.toLowerCase().includes(lowerQuery) ||
        customer.email.toLowerCase().includes(lowerQuery) ||
        customer.phone.toLowerCase().includes(lowerQuery)
      );

      this.currentPage = 1;
      this.updatePagination();
    });
  }

  onSearchInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.searchQuery.next(input);
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe((data) => {
      this.customers = data;
      this.filteredCustomers = [...this.customers]; 
      this.updatePagination();// Initialize filtered list
    });
  }

  // filterCustomers(): void {
  //   const query = this.searchQuery.toLowerCase();
  //   this.filteredCustomers = this.customers.filter((customer) =>
  //     customer.name.toLowerCase().includes(query) ||
  //     customer.email.toLowerCase().includes(query) ||
  //     customer.phone.toLowerCase().includes(query)
  //   );
  // }

  getPrimaryAddress(customer: Customer): string {
    const primary = customer.addresses.find((address) => address.isPrimary);
    return primary ? `${primary.name}: ${primary.street}, ${primary.city}` : 'No definida';
  }

  openAddCustomerModal() {
    const modalRef = this.modalService.open(CustomerModalComponent);
    modalRef.componentInstance.mode = 'add';

    modalRef.componentInstance.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      addresses: this.fb.array([]) // Initialize addresses as an empty array
    });
  
    modalRef.result
      .then((result) => {
        // Ensure the addresses array exists and is initialized
        const newCustomer = {
          ...result,
          addresses: result.addresses || [] // Safeguard for empty addresses
        };
  
        this.customerService.createCustomer(newCustomer).subscribe(
          () => {
            this.toastr.success('Customer successfully added.', 'Success', {
              timeOut: 5000,
              positionClass: 'toast-bottom-right',
              closeButton: true,
              progressBar: true,
            });
            this.loadCustomers(); // Reload the customer list
          },
          (error) => {
            this.toastr.error('Failed to add the customer.', 'Error');
            console.error(error);
          }
        );
      })
      .catch((error) => {
        console.log('Modal closed without action:', error);
      });
  }

  openEditCustomerModal(customer: Customer): void {
    const modalRef = this.modalService.open(CustomerModalComponent); // Reuse the modal
    modalRef.componentInstance.mode = 'edit'; // Set the mode to "edit"
    modalRef.componentInstance.customer = customer; // Pass the customer data for editing
  
    modalRef.result
      .then((updatedCustomer) => {
        const index = this.customers.findIndex((c) => c.id === updatedCustomer.id);
        if (index !== -1) {
          // Update the customer locally
          this.customers[index] = updatedCustomer;
  
          // Persist changes to the backend
          this.customerService.updateCustomer(updatedCustomer.id, updatedCustomer).subscribe(
            () => {
              this.toastr.success('Customer updated successfully.', 'Success');
            },
            (error) => {
              this.toastr.error('Failed to update the customer.', 'Error');
              console.error(error);
            }
          );
        }
      })
      .catch((error) => {
        console.log('Modal dismissed without changes:', error);
      });
  }
  

  viewCustomerProfile(customerId: string): void {
    this.router.navigate([`customers/${customerId}/profile`]);
  }

  deleteCustomer(customer: Customer): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the address.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (customer) {
          // Persist changes to the backend
          this.customerService.deleteCustomer(customer.id).subscribe(
            () => {
              this.toastr.success('Customer deleted successfully.', 'Success');
              this.loadCustomers(); 
            },
            (error) => {
              this.toastr.success('Customer deleting address', 'Error');
              console.error(error);
            }
          );
        }
      }
    });
  }

// Pagination methods
// Calculate total pages and set paginated customers for the current page
updatePagination(): void {
  this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
  this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
}

// Navigate to a specific page
goToPage(page: number): void {
  this.currentPage = page;
  this.updatePagination();
}

// Navigate to the previous page
previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePagination();
  }
}

// Navigate to the next page
nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updatePagination();
  }
}
}
