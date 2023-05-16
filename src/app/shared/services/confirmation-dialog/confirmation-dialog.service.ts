import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from '../../components/confirm-dialog/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(
    private modalService: NgbModal
  ) { }

  public confirm(
    title: string,
    subtitle: string,
    message: string,
    name?: string,
    type?: boolean,
    btnCancelText?: string,
    btnOkText?: string,
    warning?: string,
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { ariaLabelledBy: 'Modal usuario', backdrop: 'static', centered: true, windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.subtitle = subtitle;
    modalRef.componentInstance.name = name;
    modalRef.componentInstance.type = type || false;
    modalRef.componentInstance.warning = warning;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText || 'Aceptar';
    modalRef.componentInstance.btnCancelText = btnCancelText || 'Cancelar';

    return modalRef.result;
  }
}
