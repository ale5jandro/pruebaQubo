'use strict';

/**
 * @ngdoc function
 * @name pruebaQubodmApp.controller:DivgrandeCtrl
 * @description
 * # DivgrandeCtrl
 * Controller of the pruebaQubodmApp
 */
angular.module('pruebaQubodmApp')
  .controller('DivgrandeCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })


.controller('AppCtrl', function($rootScope,$scope,$mdSidenav,$mdDialog,conectorWS,pestanas,localize){


	$scope.nodoSeleccionado={};
	$scope.arbolActivo="treedata";
	$scope.cambioDireccion=0;
	$scope.indiceGeneral=0;
	$scope.prueba=0;

	$scope.arrayMovedor = [];
	$scope.arrayMovedor2 = [];
	$scope.selectMovedor=1;

	


///////////////////////////////////ARBOL/////////////////////////////////////////////////
	$scope.treedata = [ { label: '/', id: '/',path: '/',  children: []}];
	// { "label" : "cclip", "id" : "/home/cclip",path: '/home', "children" : [] },
 //    { "label" : "ivan", "id" : "/home/ivan",path: '/home', "children" : [] } ]}];

	$scope.treedata2 = [ { label: '/', id: '/',path: '/', children: [] } ];

	//conectorWS.buscarCarpetas("/home/",function(carpetas){});
// $scope.arbolPrueba=[
//     { "label" : "User", "id" : "role1", "children" : [
//         { "label" : "subUser1", "id" : "role11", "children" : [] },
//         { "label" : "subUser2", "id" : "role12", "children" : [
//             { "label" : "subUser2-1", "id" : "role121", "children" : [
//                 { "label" : "subUser2-1-1", "id" : "role1211", "children" : [] },
//                 { "label" : "subUser2-1-2", "id" : "role1212", "children" : [] }
//             ]}
//         ]}
//     ]},
//     { "label" : "Admin", "id" : "role2", "children" : [] },
//     { "label" : "Guest", "id" : "role3", "children" : [] }
// ];   


	// $(".gray").on('click', function(e) { 
	//    if( e.which == 2 ) {
	//       e.preventDefault();
	//       alert("middle button"); 
	//    }
	// });


	

	// $scope.$watch('nodoSeleccionado',function(){
	// 	// alert("existe");
	// if($scope.nodoSeleccionado!=null){
	// 	if($scope.nodoSeleccionado.children.length>0){
	// 		console.log("existe");
	// 		// console.log(aux);
	// 	}else{
	// 		console.log("no existe");
	// 		// console.log(aux);

			
	// 		//console.log($scope.arbolActivo);
	// 		// if($scope.arbolActivo=='treedata'){
	// 			$rootScope.$broadcast('acomodarArbol',$scope.nodoSeleccionado.path+"/"+$scope.nodoSeleccionado.label+"/");
	// 		// }else{
	// 		// 	$rootScope.$broadcast('acomodarArbol2',$scope.nodoSeleccionado.path+"/"+$scope.nodoSeleccionado.label+"/");
	// 		// }

			
	// 	}
	// 	$rootScope.$broadcast('cambiarSoloRelleno',$scope.nodoSeleccionado.path+"/"+$scope.nodoSeleccionado.label+"/");
	// 	if($scope.nodoSeleccionado.id!="/")	
	// 	{
	// 		var aux=$scope.nodoSeleccionado.id.split("/");
	// 		aux[0]="/";
	// 		$rootScope.$broadcast('irADireccion',aux);
	// 	}else{
	// 		$rootScope.$broadcast('irADireccion',"/");
	// 	}

	// 	}

	
	// }); 
	// $scope.$watch('nodoSeleccionado',function(current, old){
	// 	console.log("anda");
	// });



	$scope.seleccionarMovedor = function(index){
		$scope.carpetaSelecciondaMovedora=index;
	};

	$scope.abrirCarpetaMovedora = function(carpeta){
		conectorWS.buscarCarpetas(carpeta.path+"/"+carpeta.label+"/",function(carpetas){
			if($scope.selectMovedor==1){
				$scope.arrayMovedor=carpetas;
			}else{
				$scope.arrayMovedor2=carpetas;
			}
		});
	};

	$scope.subirNivelMovedor = function(){
		var aux= $scope.arrayMovedor[0].path.substring(0, $scope.arrayMovedor[0].path.lastIndexOf("/"));
		conectorWS.buscarCarpetas(aux+"/",function(carpetas){
			if($scope.selectMovedor==1){
				$scope.arrayMovedor=carpetas;
			}else{
				$scope.arrayMovedor2=carpetas;
			}
		});
	}


	$rootScope.$on('seleccionNodo', function(event, nodo) { 
		if(nodo!=null){
			if(nodo.children.length>0){//El nodo del arbol no tiene nada adentro, se va a buscar info para llenarlo
				//console.log("existe");
				// console.log(aux);
			}else{
				//console.log("no existe");
				// console.log(aux);

				
				//console.log($scope.arbolActivo);
				// if($scope.arbolActivo=='treedata'){
					$rootScope.$broadcast('acomodarArbol',nodo.path+"/"+nodo.label+"/");
				// }else{
				// 	$rootScope.$broadcast('acomodarArbol2',$scope.nodoSeleccionado.path+"/"+$scope.nodoSeleccionado.label+"/");
				// }
			}
			$rootScope.$broadcast('cambiarSoloRelleno',nodo.path+"/"+nodo.label+"/");
			if(nodo.id!="/")	
			{
				var aux=nodo.id.split("/");
				aux[0]="/";
				$rootScope.$broadcast('irADireccion',aux);
			}else{
				$rootScope.$broadcast('irADireccion',"/");
			}
		}
	});

	var buscarNodo = function(idBuscado, arregloBuscar,pedazitoBuscadoIteracion,ramaAAgregar){
		// console.log(pedazitoBuscadoIteracion);
		for(var i=0;i<arregloBuscar.length;i++){
			if(pedazitoBuscadoIteracion[0]==arregloBuscar[i].label){	
				//console.log(pedazitoBuscadoIteracion[0]);
				if(pedazitoBuscadoIteracion.length<=2){
						// console.log(pedazitoBuscadoIteracion);
						if(arregloBuscar[i].children.length==0){//La primera parte es para crear el arbol, la segunda es para cuando hay q actualizarlo porque se creo una carpeta nueva
							arregloBuscar[i].children=ramaAAgregar;
							$rootScope.$broadcast('cambioEnDireccion',arregloBuscar[i]);
						}
						if(arregloBuscar[i].id+"/" == idBuscado){
							arregloBuscar[i].children=ramaAAgregar;
						}
						
						//arregloBuscar[i].selected = 'selectedTree';
						return;	
				}else{
						pedazitoBuscadoIteracion.shift();
						// console.log("Estoy pasando:");
						// console.log(pedazitoBuscadoIteracion);
						// console.log(arregloBuscar[i].children);
						// console.log(idBuscado);
						// console.log("children");
						// console.log(arregloBuscar[i].children);
						// console.log(pedazitoBuscadoIteracion);
						// console.log(ramaAAgregar);
						buscarNodo(idBuscado,arregloBuscar[i].children,pedazitoBuscadoIteracion,ramaAAgregar);
						break;
				}
			}
		}
	}

//primera carga de la aplicacion
	conectorWS.buscarCarpetas("/",function(carpetas){
	 			$scope.treedata[0].children=carpetas;
	 			$rootScope.$broadcast('cambioEnDireccion',$scope.treedata[0]);

	 			$scope.arrayMovedor=$scope.treedata[0].children;
	 			// $scope.treedata2[0].children=carpetas;
	 			// $rootScope.$broadcast('cambioEnDireccion',$scope.treedata2[0]);
	 });

	conectorWS.buscarCarpetas("/",function(carpetas){
 			$scope.treedata2[0].children=carpetas;
	 		$rootScope.$broadcast('cambioEnDireccion',$scope.treedata2[0]);
	 		$scope.arrayMovedor2=$scope.treedata2[0].children;
	});



	$rootScope.$on('acomodarArbol', function(event, path, tree) { 
		conectorWS.buscarCarpetas(path,function(carpetas){
			var aux=path.split("/");
			aux.shift();
			// aux.shift();
			//cuando este definido bien hay q componerlo por el tema del path absoluto
			// console.log(aux);
			if(carpetas.length<1)//Si el webService que busca las carpetas no trae nada, no hay nada q agregar
				return;
			if(tree==null){
				if(path=='/'||path=='//'||path==""||path=='///'||path=='////'||path=='/////'||path=='//////'){
					if($scope.pestanaGeneralSeleccionada==0){
						if($scope.treedata[0].children.length==0)
							$scope.treedata[0].children=carpetas;
						$rootScope.$broadcast('cambioEnDireccion',$scope.treedata[0]);
					}else{
						if($scope.treedata2[0].children.length==0)
							$scope.treedata2[0].children=carpetas;
						$rootScope.$broadcast('cambioEnDireccion',$scope.treedata2[0]);
					}
				}else{
					if($scope.pestanaGeneralSeleccionada==0){
						//console.log("se agrego al 1");
						buscarNodo(path,$scope.treedata[0].children,aux,carpetas);
					}else{
						//console.log("se agrego al 2");
						buscarNodo(path,$scope.treedata2[0].children,aux,carpetas);
					}
				}
			}else{
				//console.log(tree);
				buscarNodo(path,tree[0].children,aux,carpetas);
			}
		});
		
	});

	$rootScope.$on('acomodarArbolXSocket', function(event, path, tree) { 
		conectorWS.buscarCarpetas(path,function(carpetas){
			var aux=path.split("/");
			aux.shift();
			// aux.shift();
			//cuando este definido bien hay q componerlo por el tema del path absoluto
			// console.log(aux);
			if(tree==null){
				if(path=='/'||path=='//'||path==""||path=='///'||path=='////'||path=='/////'||path=='//////'){
					if($scope.pestanaGeneralSeleccionada==0){
						if($scope.treedata[0].children.length==0)
							$scope.treedata[0].children=carpetas;

					}else{
						if($scope.treedata2[0].children.length==0)
							$scope.treedata2[0].children=carpetas;

					}
				}else{
					if($scope.pestanaGeneralSeleccionada==0){
						//console.log("se agrego al 1");
						buscarNodoXSocket(path,$scope.treedata[0].children,aux,carpetas);
					}else{
						//console.log("se agrego al 2");
						buscarNodoXSocket(path,$scope.treedata2[0].children,aux,carpetas);
					}
				}
			}else{
				//console.log(tree);
				buscarNodoXSocket(path,tree[0].children,aux,carpetas);
			}
		});
		
	});

	var buscarNodoXSocket = function(idBuscado, arregloBuscar,pedazitoBuscadoIteracion,ramaAAgregar){
		// console.log(pedazitoBuscadoIteracion);
		for(var i=0;i<arregloBuscar.length;i++){
			if(pedazitoBuscadoIteracion[0]==arregloBuscar[i].label){	
				//console.log(pedazitoBuscadoIteracion[0]);
				if(pedazitoBuscadoIteracion.length<=2){
						// console.log(pedazitoBuscadoIteracion);
						if(arregloBuscar[i].children.length==0){//La primera parte es para crear el arbol, la segunda es para cuando hay q actualizarlo porque se creo una carpeta nueva
							arregloBuscar[i].children=ramaAAgregar;
						}
						if(arregloBuscar[i].id+"/" == idBuscado){
							arregloBuscar[i].children=ramaAAgregar;
						}
						
						//arregloBuscar[i].selected = 'selectedTree';
						return;	
				}else{
						pedazitoBuscadoIteracion.shift();
						// console.log("Estoy pasando:");
						// console.log(pedazitoBuscadoIteracion);
						// console.log(arregloBuscar[i].children);
						// console.log(idBuscado);
						// console.log("children");
						// console.log(arregloBuscar[i].children);
						// console.log(pedazitoBuscadoIteracion);
						// console.log(ramaAAgregar);
						buscarNodoXSocket(idBuscado,arregloBuscar[i].children,pedazitoBuscadoIteracion,ramaAAgregar);
						break;
				}
			}
		}
	}
	

	// $rootScope.$on('acomodarArbol2', function(event, path, tree) { 
	// 	console.log("AUX");
	// 	conectorWS.buscarCarpetas(path,function(carpetas){
	// 		var aux=path.split("/");
	// 		aux.shift();
			
	// 		if(tree==null){
	// 			if(path=='/'||path=='//'||path==""||path=='///'||path=='////'||path=='/////'||path=='//////'){
	// 				$scope.treedata2[0].children=carpetas;
	// 				$rootScope.$broadcast('cambioEnDireccion'+$scope.arbolActivo,$scope.treedata2[0]);
	// 			}else{
	// 				buscarNodo(path,$scope.treedata2[0].children,aux,carpetas);
	// 			}
	// 		}else{
	// 			console.log(tree);
	// 			buscarNodo(path,tree[0].children,aux,carpetas);
	// 		}
	// 	});
	// });

	

	var mostrarMascaraOscura = function(){
		if($("#mascaraOscura").css("display")=="none"){
			$("#mascaraOscura").css("display","block");
		}else{
			$("#mascaraOscura").css("display","none");
		}
	}

	$scope.volverAtras = function(){
			$rootScope.$broadcast('subir:nivel', function(nivel) {
				$scope.SelectedDoc=null;
				$rootScope.$broadcast('cambiarRelleno',nivel.path);//+"/"
			});
	}

	$scope.nuevaCarpeta = function(){
		$( "#divCarpetaNueva" ).draggable();
		$('#divCarpetaNueva').css("display","block");
		mostrarMascaraOscura();
		$('#divCarpetaNueva').css( 'top', window.pageYOffset + 200 );
	}

	$scope.botonVentanaCarpetaNueva = function(accion){
		if(accion=="aceptar"){
				$rootScope.$broadcast('getCarpetaActual', function(nivel) {
					$('#divCarpetaNueva').css("display","none");
					mostrarMascaraOscura();
					$rootScope.$broadcast('crearCarpeta', $scope.cosaMedio.nuevoNombre, nivel, function(resultado){
						if(resultado=='nombreRepetido'){
							$mdDialog.show(
						    $mdDialog.alert()
						    .title('Nombre duplicado')
						    .content('La carpeta no se creo.')
						    .ariaLabel('Alert Dialog Demo')
						    .ok('Aceptar')
						    );						
						}else if(resultado=='exito'){
						}
					});	
				});
		}else{
			$('#divCarpetaNueva').css("display","none");
			mostrarMascaraOscura();
		}
	}

	$scope.botonVentanaObtenerEnlace = function(){
		$('#divObtenerEnlace').css("display","none");
		mostrarMascaraOscura();
	}


	$scope.ObtenerEnlace = function(){
		$( "#divObtenerEnlace" ).draggable();
		$('#divObtenerEnlace').css("display","block");
		$('#divObtenerEnlace').css( 'top', window.pageYOffset + 200 );
		mostrarMascaraOscura();
	}

	$scope.moverElemento = function(){
		$( "#divMoverElemento" ).draggable();
		$('#divMoverElemento').css("display","block");
		$('#divMoverElemento').css( 'top', window.pageYOffset + 200 );
		mostrarMascaraOscura();
	}

	$scope.copiarElemento = function(){

		var json = {};
		json.nombre=$scope.SelectedDoc.nombre;
		json.path=$scope.SelectedDoc.path;
		json.tipo=$scope.SelectedDoc.tipo;
		json.pathImg=$scope.SelectedDoc.pathImg
		json.id=Math.random()*100;

		$rootScope.$broadcast('crearDocumento', json, function(resultado){
			if(resultado=='algoMalo'){//NO IMPLEMENTADO					
			}else if(resultado=='exito'){
			}
		});	
	}

	$scope.abrirEnPestana = function(){
		$scope.agregarPestana($scope.SelectedDoc.path,$scope.SelectedDoc.nombre);
	}


	$scope.renombrarElemento = function(){
		$( "#divCambioNombre" ).draggable();
		$('#divCambioNombre').css("display","block");
		$('#divCambioNombre').css("z-index","9999");
		$('#divCambioNombre').css( 'top', window.pageYOffset + 200 );
		mostrarMascaraOscura();
	}

	$scope.botonVentanaMoverElemento = function(accion){
		if(accion=="aceptar"){
			if($scope.selectMovedor==1){
				console.log("Movi "+ $scope.SelectedDoc.nombre + " a " + $scope.arrayMovedor[$scope.carpetaSelecciondaMovedora].label + " (Arbol Personal)");
			}else{
				console.log("Movi "+ $scope.SelectedDoc.nombre + " a " + $scope.arrayMovedor2[$scope.carpetaSelecciondaMovedora].label + " (Arbol institucional)");
			}
			// $rootScope.$broadcast('cambiarNombreDocumento', $scope.cosaMedio.nuevoNombre, function(resultado){
			// 	if(resultado=='nombreRepetido'){
			// 		$mdDialog.show(
			// 	    $mdDialog.alert()
			// 	    .title('Nombre duplicado')
			// 	    .content('El documento no se renombro.')
			// 	    .ariaLabel('Alert Dialog Demo')
			// 	    .ok('Aceptar')
			// 	    );						
			// 	}else if(resultado=='exito'){

					

			// 	}
			// });	


			$('#divMoverElemento').css("display","none");
			mostrarMascaraOscura();
		}else{
			$('#divMoverElemento').css("display","none");
			mostrarMascaraOscura();
		}


	}

	$scope.subirArchivo = function(file){
		conectorWS.upload(file, function(nombre){

				var json = {};
					json.nombre=nombre;
					json.path=$scope.getCarpetaActual();
					json.tipo="pdf";
					json.pathImg="/images/pdf.png";
					json.id=Math.random()*100;

					$rootScope.$broadcast('crearDocumento', json, function(resultado){
						if(resultado=='algoMalo'){//NO IMPLEMENTADO					
						}else if(resultado=='exito'){
						}
					});	

		});
	}


	$scope.botonVentanaCambiarNombre = function(accion){
		if(accion=="aceptar"){

			$rootScope.$broadcast('cambiarNombreDocumento', $scope.cosaMedio.nuevoNombre, function(resultado){
				if(resultado=='nombreRepetido'){
					$mdDialog.show(
				    $mdDialog.alert()
				    .title('Nombre duplicado')
				    .content('El documento no se renombro.')
				    .ariaLabel('Alert Dialog Demo')
				    .ok('Aceptar')
				    );						
				}else if(resultado=='exito'){
				}
			});	


			$('#divCambioNombre').css("display","none");
			mostrarMascaraOscura();
		}else{
			$('#divCambioNombre').css("display","none");
			mostrarMascaraOscura();
		}


	}

	$scope.cambiarVista = function(){
		$rootScope.$broadcast('cambiarTipoVista');
	};

	$scope.toggleRight = function() {
	    $mdSidenav('right').toggle()
	                        .then(function(){
	                        });
	  };

	 $scope.toggleLeft = function() {
	    $mdSidenav('left').toggle()
	                      .then(function(){
	                      });
	  };


	  	$scope.opcionMenu = function(unaCosa){
	  //   	console.log("aleleleleleleelele");
			// console.log($scope.funcionesContextMenu);
			for(var i=0;i<$scope.funcionesContextMenu.length;i++){
				if($scope.funcionesContextMenu[i].funcion==unaCosa){
					$scope.funcionesContextMenu[i].ejecucion();
				}
			}
		}

		$scope.$watch('selectMovedor',function(current,old){
			//alert($scope.selectMovedor);
		});

	})




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DIRECTIVA DEL CLICK DERECHO, USA UNA FACTORY PARA SINCRONIZAR (CAPAZ HAYA Q CAMBIARLO).
//EVENTOS
//	- seleccionarElemento: DISPARA EL EVENTO PASANDO COMO PARAMETRO EL OBJETO SELECCIONADO
//
//	PARAMETROS
	// OBJETO A PASAR A LA FUNCION PARA QUE SE SELECCIONE 
	// clickAfuera: PARA ELEMENTOS EN LOS QUE NO SE QUIERE EL COMPORTAMIENTO ESTANDARD NI REALIZAR SELECCION

//ES COMO UN SEMAFORO PARA SABER SI EL DIV DEL CLOCK DERECHO ESTA ABIERTO EN OTRO OBJETO (PORQUE SE ATA A OBJETOS HERMANOS)
  .factory('documentReady', function(){
    
    var factory = {}
    var isReady=false;
    var contextMenu=false;


    factory.isReady = function(){
    	if(!isReady){
      		isReady=true;
      		return false;	
    	}else{
      		return true;
      	}
    }

    factory.setContextMenu = function(estado){
    	contextMenu=estado;
    }

    factory.getContextMenu = function(){
    	return contextMenu;
    }

    return factory;
  })

  .factory('conectorWS', function($http,$upload,$mdDialog, $rootScope){
    

    var conectorWS = {};
    var direccion="http://172.16.248.194:8081";

    var iosocket = io.connect("http://172.16.248.194:8081");

	iosocket.on('recargar', function(path){
			$rootScope.$broadcast('recargarRelleno', path.path);
			console.log("me llego: "+path.path);
			$rootScope.$broadcast('acomodarArbolXSocket',path.path);
	});


	conectorWS.upload = function (files, callback) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: direccion+'/subirArchivo',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    //console.log('file ' + config.file.name + ' uploaded. Response: ' + data);
                    callback(config.file.name)
					

                });
            }
        }
    };

	conectorWS.buscarWS = function(aDonde, callback, callbackError, pathViejo){
			 $http.get(direccion+'/jobs',{
			 	params: {
			 		path: aDonde,
			 		pathViejo: pathViejo
			 	}
			 }).
       		 success(function(data) {
       		 	
       		  	callback(data);
        }).
       		 error(function(data){
       		 	$mdDialog.show(
			      $mdDialog.alert()
			        .title('Error')
			        .content('No se ha podido acceder al directorio especificado.')
			        .ariaLabel('Alert Dialog Demo')
			        .ok('Got it!')
			    );
			    if(callbackError!=null){
       		 		return callbackError();
			    }
       		 })
			iosocket.emit('unime', { room: aDonde, roomVieja: pathViejo });//NO PUEDE ESTAR EN EL CALLBACK PORQUE PIERDO EL ACCESO A LOS PARAMETRO DE LA FUNCION AHI
       		 
       		 aDonde="";
	}

	conectorWS.renombrarWS = function(direccion, nombreViejo, nombreNuevo){
			 $http.get(direccion+'/renombrar',{
			 	params: {
			 		path: direccion,
			 		nombreViejo: nombreViejo,
			 		nombreNuevo: nombreNuevo
			 	}
			 }).
       		 success(function(data) {
       });
	}

	conectorWS.borrarCarpetaWS = function(direccion){
			 $http.get(direccion+'/borrarCarpeta',{
			 	params: {
			 		nombre: direccion
			 	}
			 }).
       		 success(function(data) {
       });
	}


	conectorWS.crearCarpeta = function(path,nombre){
			 $http.get(direccion+'/crearCarpeta',{
			 	params: {
			 		path: path,
			 		nombre: nombre
			 	}
			 }).
       		 success(function(data) {
       		 	iosocket.emit('carpetaCreada', { path: path });
       });
	}

	conectorWS.buscarCarpetas = function(path,callback){
		$http.get(direccion+'/buscarCarpetas',{
			 	params: {
			 		path: path,
			 	}
			 }).
       		 success(function(data) {
       		 	callback(data);
       });
	}

    return conectorWS;
  })


 .factory('pestanas', function(){
    
    var factory = {};
    var pestanaActiva = 0;
    var pestana1 = {};
    var pestana2 = {};
    pestana1.pestanas=[];
    pestana2.pestanas=[];

    factory.printPestanas = function(){
    	console.log("Pestaña 1");
    	console.log(pestana1);
    	console.log("Pestaña 2");
    	console.log(pestana2);
    	console.log("Seleccionado");
    	console.log(pestanaActiva);
    }

    factory.cambiarPestana = function(){
    	if(pestanaActiva==0){
    		pestanaActiva=1;
    	}else{
    		pestanaActiva=0;
    	}
    }

    factory.actualizarPestana = function(indice,nombre,vista,docs,path){
    	console.log("actualizo"+indice);
    	console.log(nombre);
    	if(pestanaActiva==0){
    		if(nombre)
    			pestana1.pestanas[indice].nombre=nombre;
    		if(vista)
    			pestana1.pestanas[indice].vista=vista;
    		if(docs)
    			pestana1.pestanas[indice].docs=docs;
    		if(path)
    			pestana1.pestanas[indice].path=path;
    	}else{
    		if(nombre)
    			pestana2.pestanas[indice].nombre=nombre;
    		if(vista)
    			pestana2.pestanas[indice].vista=vista;
    		if(docs)
    			pestana2.pestanas[indice].docs=docs;
    		if(path)
    			pestana2.pestanas[indice].path=path;
    	}
    }

    factory.getContenidoPestana = function(indice){
    	if(pestanaActiva==0){
    		return pestana1.pestanas[indice];
    	}else{
    		return pestana2.pestanas[indice];
    	}
    }
    
    factory.agregarPestana = function(nombre,vista,docs,path){
    	var pestana = {};
    	pestana.nombre=nombre;
    	pestana.vista=vista;
    	pestana.docs=docs;
    	pestana.path=path;
    	if(pestanaActiva==0){
    		pestana1.pestanas.push(pestana);
    	}else{
    		pestana2.pestanas.push(pestana);
    	}
    }

    factory.eliminarPestana = function(indice){
    	if(pestanaActiva==0){
    		pestana1.splice(indice,1);
    	}else{
    		pestana2.splice(indice,1);
    	}
    }

    factory.getPestanas = function(){
    	if(pestanaActiva==0){
    		return pestana1.pestanas;
    	}else{
    		return pestana2.pestanas;
    	}
    }

    factory.getPestanaActiva = function(){
    	return pestanaActiva;
    }

    return factory;
  });

	