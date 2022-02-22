var generarIdUnicoFecha = ()=>{
    let fecha = new Date();
    return Math.floor(fecha.getTime()/1000).toString(16);
};
var appSistema = new Vue({
    el: '#appSistema',
    data: {
        forms:{
            'cliente':{mostrar:false},
            'producto':{mostrar:false},
            'proveedor':{mostrar:false},
            'categoria':{mostrar:false}
        }
    },
});
document.addEventListener('DOMContentLoaded', e=>{
    let formularios = document.querySelectorAll('.mostrar').forEach(formulario=>{
        formulario.addEventListener('click', evento=>{
            let formulario = evento.target.dataset.form;
            appSistema.forms[formulario].mostrar = true;
        });
    });
});