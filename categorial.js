Vue.component('categoria',{
    data:()=>{
        return {
            buscar:'',
            categorias:[],
            categoria:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                idCategoria : '',
                codigo: '',
                nombre: '',
            }
        }
    },
    methods:{
        buscandoCategoria(){
            this.obtenerCategorias(this.buscar);
        },
        eliminarCategoria(categoria){
            if( confirm(`Esta seguro de eliminar el categoria ${categoria.nombre}?`) ){
                this.categoria.accion = 'eliminar';
                this.categoria.idCategoria = categoria.idCategoria;
                this.guardarCategoria();
            }
            this.nuevoCategoria();
        },
        modificarCategoria(datos){
            this.categoria = JSON.parse(JSON.stringify(datos));
            this.categoria.accion = 'modificar';
        },
        guardarCategoria(){
            this.obtenerCategorias();
            let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
            if(this.categoria.accion=="nuevo"){
                this.categoria.idCategoria = generarIdUnicoFecha();
                categorias.push(this.categoria);
            } else if(this.categoria.accion=="modificar"){
                let index = categorias.findIndex(categoria=>categoria.idCategoria==this.categoria.idCategoria);
                categorias[index] = this.categoria;
            } else if( this.categoria.accion=="eliminar" ){
                let index = categorias.findIndex(categoria=>categoria.idCategoria==this.categoria.idCategoria);
                categorias.splice(index,1);
            }
            localStorage.setItem('categorias', JSON.stringify(categorias));
            this.nuevoCategoria();
            this.obtenerCategorias();
            this.categoria.msg = 'Categoria procesado con exito';
        },
        obtenerCategorias(valor=''){
            this.categorias = [];
            let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
            this.categorias = categorias.filter(categoria=>categoria.nombre.toLowerCase().indexOf(valor.toLowerCase())>-1);
        },
        nuevoCategoria(){
            this.categoria.accion = 'nuevo';
            this.categoria.msg = '';
            this.categoria.idCategoria = '';
            this.categoria.codigo = '';
            this.categoria.nombre = '';
        }
    },
    created(){
        this.obtenerCategorias();
    },
    template:`
        <div id="appCiente">
            <div class="card text-white" id="carCategoria">
                <div class="card-header bg-primary">
                    Registro de Categorias

                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carCategoria" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarCategoria" @reset="nuevoCategoria">
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="categoria.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el nombre" v-model="categoria.nombre" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="categoria.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ categoria.msg }}
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
            <div class="card text-white" id="carBuscarCategoria">
                <div class="card-header bg-primary">
                    Busqueda de Categorias

                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarCategoria" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandoCategoria" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in categorias" @click='modificarCategoria( item )' :key="item.idCategoria">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarCategoria(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});