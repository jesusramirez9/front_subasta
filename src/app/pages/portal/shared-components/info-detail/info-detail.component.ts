import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SubastaService } from 'src/app/services/subasta.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { PujaTemporal } from 'src/app/models/request/pujaTemporal.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialog2Component } from 'src/app/pages/portal/personal-components/comfirm-dialog2/confirm-dialog2.component';

@Component({
  selector: 'app-info-detail',
  templateUrl: './info-detail.component.html',
  styleUrls: ['./info-detail.component.css']
})
export class InfoDetailComponent implements OnInit {
  @Input() endAuction: any;
  @Input() endDay: any;
  @Input() typeUser: string;
  @Input() idSubasta: string;
  @Input() precioBase: number;
  @Input() precioBaseTemporal: number;
  @Input() estadoSubasta: string;

  pujaForm: FormGroup;
  usuario: any;
  arrayPujas: PujaTemporal[] = [];
  pujaActualTemporal: number;
  compradorTemporal: string;
  precioActualTemporal: number;
  idComprador: string;
  modalRef: BsModalRef;
  flagTerminado: boolean = false;

  constructor(private fb: FormBuilder, private subastaService: SubastaService, private ls: LocalStorageService, private webSocketService: WebSocketService, private router: Router, private modalService: BsModalService, public dialog: MatDialog) {
    this.initForm();
  }

  ngOnInit(): void {
    console.log(this.endDay);
    console.log(this.endAuction);
    console.log(this.estadoSubasta);
    let fechaActual = new Date();
    let fechaTermino = new Date(this.endDay);
    console.log(fechaActual);
    if(fechaActual >= fechaTermino){
      this.flagTerminado = true;
    }

    if(this.estadoSubasta == 'FINALIZADO'){
      this.flagTerminado = true;
    }

    this.usuario = JSON.parse(this.ls.getData('user'));
    this.obtenerPujasSubasta();
    this.webSocketService.listen(this.idSubasta).subscribe((data:any) => {
      console.log(data);
      if (data['mensaje'] === 'proceso') {
        this.compradorTemporal = data['user'].name;
        this.idComprador = data['user']._id;
        this.pujaActualTemporal = data['puja'].monto;
        this.precioActualTemporal = data['precioTemp'];
        if(data.subasta.estado == 'FINALIZADO'){
          this.flagTerminado = true;
        }
        this.arrayPujas = data['pujas'];
      } else {
        const dialogRef = this.dialog.open(ConfirmDialog2Component, {
          width: '400px',
          data: `SUBASTA FINALIZADA. El ganador de la subasta es el usuario: ${data['name']} pagando el precio total de: ${data['precio']}`,
        });
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(['/history']);
        });
      }
    });
  }

  get valorPuja() {
    return this.pujaForm.get('valorPuja');
  }

  initForm() {
    this.pujaForm = this.fb.group({
      valorPuja: ['', [Validators.required]],
    })
  }

  obtenerPujasSubasta() {
    this.subastaService.obtenerPujasSubasta(this.idSubasta).subscribe((data: any) => {
      console.log(data);
      this.arrayPujas = data.pujas;
      this.precioActualTemporal = data.precioTemp;
      if (this.arrayPujas.length != 0) {
        this.compradorTemporal = data.pujas[this.arrayPujas.length - 1]['comprador'].name;
        this.pujaActualTemporal = data.pujas[this.arrayPujas.length - 1].monto;
        this.idComprador = data.pujas[this.arrayPujas.length - 1]['comprador']._id;
      }
    });
  }

  puja50() {
    const monto = 50;
    this.subastaService.pujar(this.idSubasta, monto).subscribe((data: any) => {
    })
  }

  puja100() {
    const monto = 100;
    this.subastaService.pujar(this.idSubasta, monto).subscribe((data: any) => {
    })
  }

  puja150() {
    const monto = 150;
    this.subastaService.pujar(this.idSubasta, monto).subscribe((data: any) => {
    })
  }

  pujaDirecta() {
    this.subastaService.pujar(this.idSubasta, this.pujaForm.get('valorPuja').value).subscribe((data: any) => {
    })
  }

  finalizar() {
    if (confirm('¿Está seguro de terminar la subasta?')) {
      this.subastaService.finalizarSubasta(this.idSubasta, this.precioActualTemporal, this.idComprador)
        .subscribe((data: any) => {

        })
    }
  }

}
