Vue.component('cliente',{
    data:()=>{
        return {
            buscar:'',
            clientes:[],
            cliente:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                idCliente : '',
                codigo: '',
                nombre: '',
                direccion: '',
                telefono: '',
                dui: ''
            }
        }
    },
    methods:{
        buscandoCliente(){
            this.obtenerClientes(this.buscar);
        },
        eliminarCliente(cliente){
            if( confirm(`Esta seguro de eliminar el cliente ${cliente.nombre}?`) ){
                this.cliente.accion = 'eliminar';
                this.cliente.idCliente = cliente.idCliente;
                this.guardarCliente();
            }
            this.nuevoCliente();
        },
        modificarCliente(datos){
            this.cliente = JSON.parse(JSON.stringify(datos));
            this.cliente.accion = 'modificar';
        },
        guardarCliente(){
            this.obtenerClientes();
            let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            if(this.cliente.accion=="nuevo"){
                this.cliente.idCliente = generarIdUnicoFecha();
                clientes.push(this.cliente);
            } else if(this.cliente.accion=="modificar"){
                let index = clientes.findIndex(cliente=>cliente.idCliente==this.cliente.idCliente);
                clientes[index] = this.cliente;
            } else if( this.cliente.accion=="eliminar" ){
                let index = clientes.findIndex(cliente=>cliente.idCliente==this.cliente.idCliente);
                clientes.splice(index,1);
            }
            localStorage.setItem('clientes', JSON.stringify(clientes));
            this.nuevoCliente();
            this.obtenerClientes();
            this.cliente.msg = 'Cliente procesado con exito';
        },
        obtenerClientes(valor=''){
            this.clientes = [];
            let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            this.clientes = clientes.filter(cliente=>cliente.nombre.toLowerCase().indexOf(valor.toLowerCase())>-1);
        },
        nuevoCliente(){
            this.cliente.accion = 'nuevo';
            this.cliente.msg = '';
            this.cliente.idCliente = '';
            this.cliente.codigo = '';
            this.cliente.nombre = '';
            this.cliente.direccion = '';
            this.cliente.telefono = '';
            this.cliente.dui = '';
        }
    },
    created(){
        this.obtenerClientes();
    },
    template:`
        <div id="appCiente">
            <div class="card text-white" id="carCliente">
                <div class="card-header bg-primary">
                    Registro de Clientes

                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carCliente" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarCliente" @reset="nuevoCliente">
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="cliente.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el nombre" v-model="cliente.nombre" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Direccion:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese la direccion" v-model="cliente.direccion" pattern="[A-Za-zñÑáéíóúü ]{3,100}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Telefono:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el tel" v-model="cliente.telefono" pattern="[0-9]{4}-[0-9]{4}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">DUI:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el DUI" v-model="cliente.dui" pattern="[0-9]{8}-[0-9]{1}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="cliente.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ cliente.msg }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div class="row m-2">
                            <div class="col col-md-5 text-center">
                                <input class="btn btn-success" type="submit" value="Guardar">
                                <input class="btn btn-warning" type="reset" value="Nuevo">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="card text-white" id="carBuscarCliente">
                <div class="card-header bg-primary">
                    Busqueda de Clientes

                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarCliente" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandoCliente" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>DIRECCION</th>
                                <th>TEL</th>
                                <th>DUI</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in clientes" @click='modificarCliente( item )' :key="item.idCliente">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.direccion}}</td>
                                <td>{{item.telefono}}</td>
                                <td>{{item.dui}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarCliente(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});