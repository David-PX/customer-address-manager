import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address, Customer } from 'src/app/core/models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressesModalComponent } from '../../components/add-address-modal/addresses-modal.component';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {
  customer: Customer | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.customerService.getCustomerById(customerId).subscribe((data) => {
        this.customer = data;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/customers']); // Navega al listado de clientes
  }

  togglePrimary(address: Address): void {
    if (this.customer) {
      // Marcar todas las direcciones como no principales
      this.customer.addresses.forEach((addr) => {
        addr.isPrimary = false;
      });
  
      // Marcar la dirección seleccionada como principal
      address.isPrimary = true;
  
      // Actualizar al servidor (si es necesario)
      this.customerService.updateCustomer(this.customer.id, this.customer).subscribe(
        () => {
          // Mostrar toastr de éxito
          this.toastr.success(
            `The address "${address.name}" has been set as the primary address`,
            'Update Successful',
            {
              timeOut: 4000, // Duración más corta
              positionClass: 'toast-top-right', // Posición personalizada
            }
          );
        },
        (error) => {
          // Manejar errores (opcional)
          this.toastr.error(
            'Failed to set the primary address. Please try again.',
            'Update Failed'
          );
          console.error(error);
        }
      );
    }
  }
  

  setPrimaryAddress(addressId: number): void {
    if (this.customer) {
      this.customer.addresses.forEach((address) => {
        address.isPrimary = address.id === addressId.toString();
      });
      this.customerService.updateCustomer(this.customer.id, this.customer).subscribe();
    }
  }

  openAddAddressModal(): void {
    const modalRef = this.modalService.open(AddressesModalComponent);
    modalRef.componentInstance.mode = 'add';
  
    modalRef.result
      .then((newAddress) => {
        if (this.customer) {
          newAddress.id = Date.now(); // Assign a unique ID
          if (newAddress.isPrimary) {
            this.customer.addresses.forEach((addr) => (addr.isPrimary = false));
          }
          this.customer.addresses.push(newAddress);
  
          // Persist changes to the backend
          this.customerService.updateCustomer(this.customer.id, this.customer).subscribe(
            () => {
              this.toastr.success('Address added successfully.', 'Success');
            },
            (error) => {
              this.toastr.error('Failed to add the address.', 'Error');
              console.error(error);
            }
          );
        }
      })
      .catch((error) => {
        console.log('Modal dismissed without action:', error);
      });
  }

  openEditAddressModal(address: Address): void {
    const modalRef = this.modalService.open(AddressesModalComponent);
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.address = address;
  
    modalRef.result
      .then((updatedAddress) => {
        if (this.customer) {
          const index = this.customer.addresses.findIndex((addr) => addr.id === updatedAddress.id);
          if (index !== -1) {
            this.customer.addresses[index] = updatedAddress;
  
            // Persist changes to the backend
            this.customerService.updateCustomer(this.customer.id, this.customer).subscribe(
              () => {
                this.toastr.success('Address updated successfully.', 'Success');
              },
              (error) => {
                this.toastr.error('Failed to update the address.', 'Error');
                console.error(error);
              }
            );
          }
        }
      })
      .catch((error) => {
        console.log('Modal dismissed without changes:', error);
      });
  }

  deleteAddress(address: Address): void {
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
        if (this.customer) {
          // Remove the address from the local array
          this.customer.addresses = this.customer.addresses.filter(
            (addr) => addr.id !== address.id
          );
  
          // Persist changes to the backend
          this.customerService.updateCustomer(this.customer.id, this.customer).subscribe(
            () => {
              this.toastr.success('Address deleted successfully.', 'Success');
            },
            (error) => {
              this.toastr.success('Fail deleting address', 'Error');
              console.error(error);
            }
          );
        }
      }
    });
  }

}
