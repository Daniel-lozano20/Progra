Vue.component('v-select-categoria',VueSelect.VueSelect);
Vue.component('producto',{
    data:()=>{
        return {
            buscar:'',
            productos:[],
            categorias:[],
            producto:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                categoria: {
                    id: '',
                    label: '',
                },
                idProducto : '',
                codigo: '',
                nombre: '',
                marca : '',
                precio : '',
            }
        }
    },
    methods:{
        buscandoProducto(){
            this.obtenerProductos(this.buscar);
        },
        eliminarProducto(producto){
            if( confirm(`Esta seguro de eliminar el producto ${producto.nombre}?`) ){
                this.producto.accion = 'eliminar';
                this.producto.idProducto = producto.idProducto;
                this.guardarProducto();
            }
            this.nuevoProducto();
        },
        modificarProducto(datos){
            this.producto = JSON.parse(JSON.stringify(datos));
            this.producto.accion = 'modificar';
        },
        guardarProducto(){
            this.obtenerProductos();
            let productos = JSON.parse(localStorage.getItem('productos')) || [];
            if(this.producto.accion=="nuevo"){
                this.producto.idProducto = generarIdUnicoFecha();
                productos.push(this.producto);
            } else if(this.producto.accion=="modificar"){
                let index = productos.findIndex(producto=>producto.idProducto==this.producto.idProducto);
                productos[index] = this.producto;
            } else if( this.producto.accion=="eliminar" ){
                let index = productos.findIndex(producto=>producto.idProducto==this.producto.idProducto);
                productos.splice(index,1);
            }
            localStorage.setItem('productos', JSON.stringify(productos));
            this.nuevoProducto();
            this.obtenerProductos();
            this.producto.msg = 'Producto procesado con exito';
        },
        obtenerProductos(valor=''){
            this.productos = [];
            let productos = JSON.parse(localStorage.getItem('productos')) || [];
            this.productos = productos.filter(producto=>producto.nombre.toLowerCase().indexOf(valor.toLowerCase())>-1);

            this.categorias = [];
            let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
            this.categorias = categorias.map(categoria=>{
                return {
                    id: categoria.idCategoria,
                    label: categoria.nombre,
                }
            });
        },
        nuevoProducto(){
            this.producto.accion = 'nuevo';
            this.producto.msg = '';
            this.producto.idProducto = '';
            this.producto.codigo = '';
            this.producto.nombre = '';
            this.producto.marca = '';
            this.producto.precio = '';
        }
    },
    created(){
        this.obtenerProductos();
    },
    template:`
        <div id="appCiente">
            <div class="card text-white" id="carProducto">
                <div class="card-header bg-primary">
                    Registro de Productos

                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carProducto" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarProducto" @reset="nuevoProducto">
                        <div class="row p-1">
                            <div class="col col-md-2">
                                Categoria:
                            </div>
                            <div class="col col-md-3">
                                <v-select-categoria v-model="producto.categoria" 
                                    :options="categorias" placeholder="Seleccione una categoria"/>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="producto.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el nombre" v-model="producto.nombre" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Marca:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese la marca" v-model="producto.marca" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Precio:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el Precio" v-model="producto.precio" pattern="[0-9.]{1,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="producto.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ producto.msg }}
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
            <div class="card text-white" id="carBuscarProducto">
                <div class="card-header bg-primary">
                    Busqueda de Productos

                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarProducto" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandoProducto" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>MARCA</th>
                                <th>PRECIO</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in productos" @click='modificarProducto( item )' :key="item.idProducto">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.marca}}</td>
                                <td>{{item.precio}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarProducto(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});