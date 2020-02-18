import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../classes/usuario';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  // Variable que indica el estado del socket
  public socketStatus: boolean = false;

  // Variable que define el usuario
  public usuario: Usuario = null;

  constructor(private socket: Socket) { 
    this.cargarStorage();
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

  loginWS( nombre: string ) {
    return new Promise((resolve, reject) => {

      console.log('Configurando el nombre', nombre)
      // Usando el método emit de este servicio
      this.emit('configurar-usuario', {nombre: nombre}, resp => {
        // console.log(resp);

        this.usuario = new Usuario(
          nombre
        );

        this.guardarStorage();

        resolve();
      });
  
      // Esta es una forma de hacer lo mismo pero sin usar el método emit del servicio
      // this.socket.emit('configurar-usuario', {nombre: nombre}, (resp) => {
      //   console.log(resp)
      // });
    })
  }

  getUsuario() {
    return this.usuario;
  }

  guardarStorage() {
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
  }
  
  cargarStorage() {
    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.loginWS(this.usuario.nombre);
    }
  }

}
