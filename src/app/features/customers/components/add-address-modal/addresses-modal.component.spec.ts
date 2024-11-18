import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressesModalComponent } from './addresses-modal.component';

describe('AddAddressModalComponent', () => {
  let component: AddressesModalComponent;
  let fixture: ComponentFixture<AddressesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressesModalComponent]
    });
    fixture = TestBed.createComponent(AddressesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
