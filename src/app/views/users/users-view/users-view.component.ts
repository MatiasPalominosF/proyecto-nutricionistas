import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUserComponent } from '../add-user/add-user.component';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user/user.service';
import { User } from '../../../shared/models/user.interface';
import { FunctionalitiesViewComponent } from '../functionalities-view/functionalities-view.component';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss']
})
export class UsersViewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['position', 'rut', 'name', 'phone', 'email', 'enabled', 'functionalities', 'actions'];
  public dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  public loading: boolean = false;


  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  showFunctionalities(user: User) {
    const modalRef = this.modalService.open(FunctionalitiesViewComponent,
      {
        ariaLabelledBy: 'Modal usuario',
        windowClass: 'animated fadeInDown my-class',
        backdrop: 'static',
        size: 'lg'
      });
    modalRef.componentInstance.user = { ...user };
    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success('Funcionalidades editadas con éxito', 'Funcionalidades', { timeOut: 3000, closeButton: true, progressBar: true })
      }
    }, (reason) => {
      console.info(`Modal closed ${this.getDismissReason(reason)}`);
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getData() {
    this.loading = true;
    this.userService.getAllUsers().subscribe(users => {
      this.dataSource.data = users;
      this.loading = false;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingCustomAccesor;
    this.dataSource.filterPredicate = this.filterCustomAccessor();
  }


  sortingCustomAccesor = (item: User, property: string) => {
    switch (property) {
      case 'rut': return item.rut;
      case 'name': return item.name;
      case 'phone': return item.phone;
      case 'email': return item.email;
      default: return item[property];
    }
  };

  filterCustomAccessor() {
    const myFilterPredicate = (data: User, filter: string): boolean => {
      let searchString = JSON.parse(filter);

      // Para compara numbers usar: data.position.toString().trim().indexOf(searchString.position) !== -1
      return this.removeAccents(data.name).toString().trim().toLowerCase().indexOf(this.removeAccents(searchString.name).toString().trim().toLowerCase()) !== -1 ||
        this.removeAccents(data.rut).toString().trim().toLowerCase().indexOf(this.removeAccents(searchString.rut).toLowerCase()) !== -1 ||
        this.removeAccents(data.phone).toString().trim().toLowerCase().indexOf(this.removeAccents(searchString.phone).toLowerCase()) !== -1 ||
        this.removeAccents(data.email).toString().trim().toLowerCase().indexOf(this.removeAccents(searchString.email).toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }

  removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let filteredValues: User = {};

    filteredValues['name'] = filterValue;
    filteredValues['rut'] = filterValue;
    filteredValues['email'] = filterValue;
    filteredValues['phone'] = filterValue;
    this.dataSource.filter = JSON.stringify(filteredValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addUser() {
    const modalRef = this.modalService.open(AddUserComponent,
      {
        ariaLabelledBy: 'Modal usuario',
        windowClass: 'animated fadeInDown my-class',
        backdrop: 'static',
        size: 'lg'
      });
    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success('Usuario agregado con éxito', 'Nuevo usuario', { timeOut: 3000, closeButton: true, progressBar: true })
      }
    }, (reason) => {
      console.info('Modal close');
    });
  }

}
