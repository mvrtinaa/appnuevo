export class Usuario { public email:String;
    public password:String;
    public nombre:String;
    public preguntaSecreta:String;
    public respuestaSecreta:String;


    constructor(email:String,password:String,nombre: String,preguntaSecreta: String,respuestaSecreta: String){
        this.email=email;
        this.password=password;
        this.nombre = nombre;
        this.preguntaSecreta = preguntaSecreta;
        this.respuestaSecreta = respuestaSecreta;
    }

    public setUsuario(email:String,password:String):void{
        this.email=email;
        this.password=password;
    }

    public llenarUsuariosValidos():Usuario[]{
        const lista=[];
        lista.push(new Usuario('atorres@duocuc.cl', '1234', 'Ana Torres Leiva', '¿Cuál es tu animal favorito?', 'gato'));
        lista.push(new Usuario('jperez@duocuc.cl', '5678', 'Juan Pérez González', '¿Cuál es tu postre favorito?', 'panqueques'));
        lista.push(new Usuario('cmujica@duocuc.cl', '0987', 'Carla Mujica Sáez','¿Cuál es tu vehículo favorito?', 'moto'));
        return lista;
    }

    public validarUsuario(usuario:Usuario):boolean{
        let pivot:boolean=false;
        this.llenarUsuariosValidos().forEach(ele => {
            if(ele.email==usuario.email && ele.password==usuario.password){
                pivot=true;
            }
        });
        return pivot;
    }

    public buscarUsuarioPorCorreo(email: string): Usuario | undefined {

        return this.llenarUsuariosValidos().find(
          usu => usu.email ===email);
    }
}
