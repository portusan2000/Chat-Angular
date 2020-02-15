import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  // Variable que indica el estado del socket
  public socketStatus: boolean = false;

  constructor(private socket: Socket) { 
    this.checkStatus();
  }

  // Este método nos dice cuando se conecta y se desconecta del servidor
  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
    })

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus = false;
    })

  }

  emit( evento: string, payload?: any, callback?: Function ) {
    console.log('Emitiendo Evento');
    // emit('Nombre Evento a emitir', payload? que es lo que quiero enviar,
    //  callback? o función que quiero hacer después que se ejecute el código)  
    this.socket.emit( evento, payload, callback );
  }

  listen(evento: string) {
    // Escuchando cualquier evento que viene del servidor
    return this.socket.fromEvent( evento );
  }

}
