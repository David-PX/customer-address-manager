import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import { CustomersComponent } from './customers.component';
import { CustomerService } from '../../services/customer.service';
import { Customer } from 'src/app/core/models/customer.model';
import Swal from 'sweetalert2';

class MockCustomerService {
    getCustomers() {
      return of([
        { id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890', addresses: [] },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', addresses: [] },
      ]);
    }
  
    deleteCustomer(id: string): Observable<void> {
      return of();
    }
  
    createCustomer(customer: Customer) {
      return of(customer);
    }
  
    updateCustomer(id: string, customer: Customer) {
      return of(customer);
    }
  }

  describe('CustomersComponent', () => {
    let component: CustomersComponent;
    let fixture: ComponentFixture<CustomersComponent>;
    let customerService: CustomerService;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [CustomersComponent],
        imports: [
          HttpClientTestingModule,
          FormsModule,
          ReactiveFormsModule,
          NgbModalModule,
          ToastrModule.forRoot(),
          RouterTestingModule,
        ],
        providers: [
          { provide: CustomerService, useClass: MockCustomerService },
          NgbModal,
        ],
      }).compileComponents();
    });
  
    beforeEach(() => {
      fixture = TestBed.createComponent(CustomersComponent);
      component = fixture.componentInstance;
      customerService = TestBed.inject(CustomerService);
      fixture.detectChanges();
    });
  
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  
    it('should load customers on initialization', () => {
      spyOn(customerService, 'getCustomers').and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
  
      expect(customerService.getCustomers).toHaveBeenCalled();
      expect(component.customers.length).toBe(2); // Mock data contains 2 customers
    });
  
    it('should filter customers based on search query', () => {
      component.customers = [
        { id: '1', name: 'John Doe', email: 'john@example.com', phone: '1234567890', addresses: [] },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', addresses: [] },
      ];

      component.paginatedCustomers = component.customers;
  
      component.onSearchInput({ target: { value: 'John' } } as unknown as Event);
      fixture.detectChanges();
  
      expect(component.paginatedCustomers.length).toBe(2);
      expect(component.paginatedCustomers[0].name).toBe('John Doe');
    });
  
    it('should update pagination correctly', () => {
      component.customers = Array.from({ length: 15 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `123456${i}`,
        addresses: [],
      }));
  
      component.filteredCustomers = [...component.customers];

      component.updatePagination();
      expect(component.totalPages).toBe(3); // 15 customers, 5 per page
      expect(component.paginatedCustomers.length).toBe(5); // First page contains 5 customers
    });
  
    it('should delete a customer and reload the list', async () => {
      // Mock SweetAlert to confirm deletion
      spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));
    
      // Mock CustomerService methods
      spyOn(customerService, 'deleteCustomer').and.returnValue(of(undefined));
      spyOn(customerService, 'getCustomers').and.returnValue(of([]));
    
      // Mock customer
      const customer = { id: '1', name: 'John Doe', email: '', phone: '', addresses: [] };
    
      // Call the method
      await component.deleteCustomer(customer);
    
      // Assertions
      expect(Swal.fire).toHaveBeenCalled(); // Ensure the confirmation dialog was shown
      expect(customerService.deleteCustomer).toHaveBeenCalledWith(customer.id); // Ensure delete service was called
      expect(customerService.getCustomers).toHaveBeenCalled(); // Ensure customer list was reloaded
    });
  
    it('should add a new customer', async () => {
      // Mock the modal service to simulate form submission
      const modalService = TestBed.inject(NgbModal);
      spyOn(modalService, 'open').and.returnValue({
        componentInstance: { customerForm: {} }, // Mock the modal component instance
        result: Promise.resolve({ 
          name: 'New Customer', 
          email: 'newcustomer@example.com', 
          phone: '1234567890', 
          addresses: [] 
        }), // Simulate modal result
      } as any);
    
      // Mock createCustomer and getCustomers service methods
      spyOn(customerService, 'createCustomer').and.returnValue(of({
        id: '3',
        name: 'New Customer',
        email: 'newcustomer@example.com',
        phone: '1234567890',
        addresses: []
      }));
      spyOn(customerService, 'getCustomers').and.returnValue(of([])); // Simulate refreshing the list
    
      // Call the method
      await component.openAddCustomerModal();
    
      // Assertions
      expect(modalService.open).toHaveBeenCalled(); // Ensure modal was opened
      expect(customerService.createCustomer).toHaveBeenCalledWith(jasmine.objectContaining({
        name: 'New Customer',
        email: 'newcustomer@example.com',
        phone: '1234567890',
      })); // Ensure service was called with correct data
      expect(customerService.getCustomers).toHaveBeenCalled(); // Ensure customer list was refreshed
    });
  
});