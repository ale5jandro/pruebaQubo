'use strict';

angular.module('pruebaQubodmApp')

.directive('ngRightClick', [
	function(){
		var $window = angular.element( window );
		return{
		restrict:'A',
		controller:["$rootScope","$scope","documentReady","$window","$translate", function($rootScope,$scope, documentReady,$window,$translate){
		
	      this.$element = null;
	      this.$isOpen = false;

	    $scope.$parent.$parent.funcionesContextMenu = [];

	   	var opcionDelMenu = {};
	    opcionDelMenu.nombre=$translate.instant('MSG_ABRIR_PESTANA');
	    opcionDelMenu.funcion="abrirPestana";
	    opcionDelMenu.ejecucion=function(){$scope.abrirEnPestana();};
	    $scope.$parent.$parent.funcionesContextMenu.push(opcionDelMenu);

	    var opcionDelMenu = {};
	    opcionDelMenu.nombre=$translate.instant('MSG_BORRAR');
	    opcionDelMenu.funcion="Eliminar";
	    opcionDelMenu.ejecucion=function(){$scope.eliminarObjeto();};
	    $scope.$parent.$parent.funcionesContextMenu.push(opcionDelMenu);

	    opcionDelMenu = {};
	    opcionDelMenu.nombre=$translate.instant('MSG_RENOMBRAR');
	    opcionDelMenu.funcion="Renombrar";
	    opcionDelMenu.ejecucion=function(){$scope.renombrarElemento();};
	    $scope.$parent.$parent.funcionesContextMenu.push(opcionDelMenu);

	    opcionDelMenu = {};
	    opcionDelMenu.nombre=$translate.instant('MSG_DESCARGAR');
	    opcionDelMenu.funcion="descargar";
	    opcionDelMenu.ejecucion=function(){$scope.ObtenerEnlace();};
	    $scope.$parent.$parent.funcionesContextMenu.push(opcionDelMenu);

	    opcionDelMenu = {};
	    opcionDelMenu.nombre=$translate.instant('MSG_COPIAR_PUNTITOS');
	    opcionDelMenu.funcion="mover";
	    opcionDelMenu.ejecucion=function(){$scope.moverElemento();};
	    $scope.$parent.$parent.funcionesContextMenu.push(opcionDelMenu);

	    opcionDelMenu = {};
	    opcionDelMenu.nombre=$translate.instant('MSG_HACER_COPIA');
	    opcionDelMenu.funcion="copiar";
	    opcionDelMenu.ejecucion=function(){$scope.copiarElemento();};
	    $scope.$parent.$parent.funcionesContextMenu.push(opcionDelMenu);


	    if(!documentReady.isReady()){
	      	$(document).click(function(event) {
	      		console.log(event);
	      		if(event.button!=2){//En firefox tomaba el click derecho como click por lo que se cerraba
					$('#ClickMenu').css("display","none");
					documentReady.setContextMenu(false);
				}
			});
	    }

      	this.close1 = function() {
	        $('#ClickMenu').css("display","none");
	        this.$isOpen = false;
      	};

	    $scope.$parent.opcionMenu = function(unaCosa){
			for(var i=0;i<$scope.$parent.$parent.funcionesContextMenu.length;i++){
				if($scope.$parent.$parent.funcionesContextMenu[i].funcion==unaCosa){
					$scope.$parent.$parent.funcionesContextMenu[i].ejecucion();
				}
			}
		}

		 $scope.pruebaContextMenu = function(){

	  }



	    this.openWin = function(event,item,jason) {
   			if(jason.ngRightClick!="clickAfuera"){
   				$rootScope.$broadcast('seleccionarElemento',jQuery.parseJSON( jason.ngRightClick ))
   				//$scope.seleccionar(jQuery.parseJSON( jason.ngRightClick ));

				if(!this.$isOpen){

					var mousePosition = {};
					var menuPostion = {};
					var menuDimension = {};
					
				 	menuDimension.x = $("#ClickMenu").outerWidth();
				    menuDimension.y = $("#ClickMenu").outerHeight();
				    mousePosition.x = event.pageX;
				    mousePosition.y = event.pageY;
				    if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
				        menuPostion.x = mousePosition.x - menuDimension.x;
				    } else {
				        menuPostion.x = mousePosition.x;
				    }

				    if (mousePosition.y + menuDimension.y > $(window).height() + $(window).scrollTop()) {
				        menuPostion.y = mousePosition.y - menuDimension.y;
				    } else {
				        menuPostion.y = mousePosition.y;
				    }


			        //var top = event.pageY - $window.pageYOffset;
			        $('#ClickMenu').css("display","flex");
			        $('#ClickMenu').css( 'left', menuPostion.x );//event.screenX - 50 --- menuPostion.x
			        $('#ClickMenu').css( 'top', menuPostion.y  );//event.screenY - 50 --- menuPostion.y 
			        $('#ClickMenu').toggleClass( 'open', true );
			        documentReady.setContextMenu(true);
		        
		    	}else{
		    		$('#ClickMenu').css("display","none");
		    			documentReady.setContextMenu(false);
		    	}
   			}

      	};

		}],

		link: function($scope, $ele, $attrs, ctrl){

			var jason = ($attrs);
			//console.log($scope.$parent);
			var iam = $scope[( $attrs.contextmenuItem )];
			$ele.bind("contextmenu",function(e){

				e.preventDefault();
				ctrl.$element=$ele;
				ctrl.openWin(e, iam, jason);

			});
		}

	};
}

		]
)

.directive('ngCosaDelMedio', function(){
	return{
		restrict:'E',
		controller:['$scope','$rootScope','$timeout', '$http','$mdDialog','conectorWS','pestanas',function($scope,$rootScope,$timeout, $http, $mdDialog,conectorWS,pestanas){
		$scope.cosaMedio = {};
		$scope.cosaMedio.nombre = "/";
		$scope.cosaMedio.vistaSeleccionada="grid";
		$scope.SelectedDoc="";
		$scope.cosaMedio.arrayJson = [];
		$scope.cosaMedio.tree = $scope.treedata;
		$scope.cosaMedio.arbolSeleccionado = "treedata";
		$scope.cosaMedio.nuevoNombre="";
		$scope.cosaMedio.cargando=true;
		$scope.arrayPruebas = [];
		$scope.cosaMedio.pathactual="/";
		$scope.indiceArray1=0;
		var flagPestanaGrande=false;
		$scope.pestana1={};
		$scope.pestana2={};
		$scope.pestana1.pestanas=[];
    	$scope.pestana2.pestanas=[];
    	$scope.pestanaGeneralSeleccionada=0;
    	$scope.indiceArray2=0;

		$scope.cambioPestana = function(pestana){
			//console.log(pestana);
			//$scope.cosaMedio = pestana;
		}

		//Carga ejemplos cuando la barra llega al fondo
		$scope.cargarPruebas = function(){
			//alert("scropl")
			for(var i=0;i<20;i++){
				var json = {};
				json.nombre="pruaba"+i;
				json.path="/";
				json.tipo="pdf";
				json.pathImg="/images/pdf.png";
				json.id=Math.random()*100;
				$scope.cosaMedio.arrayJson.push(json);
			}
		}

		$scope.cerrarTab = function(tab){
			if($scope.pestanaGeneralSeleccionada==0){
				if($scope.pestana1.pestanas.length>1){
					var index=$scope.pestana1.pestanas.indexOf(tab);
					$scope.pestana1.pestanas.splice(index, 1);
				}
			}else{
				if($scope.pestana2.pestanas.length>1){
					var index=$scope.pestana2.pestanas.indexOf(tab);
					$scope.pestana2.pestanas.splice(index, 1);
				}
			}
		};


		//Espera el cambio de incice en las pestañas personal/institucional (barra de la izquierda)
		$scope.$watch('indiceGeneral', function(current, old){
			if(current!=old){
				// console.log("cambioIndiceGeneral");
				//pestanas.actualizarPestana($scope.indice,$scope.cosaMedio.nombre,$scope.cosaMedio.vistaSeleccionada,$scope.cosaMedio.arrayJson,$scope.cosaMedio.pathactual);
				if($scope.pestanaGeneralSeleccionada==0){
					$scope.pestana1.pestanas[$scope.indiceArray1]=$scope.cosaMedio;
					$scope.cosaMedio=$scope.pestana2.pestanas[$scope.indiceArray2];
				}else{
					$scope.pestana2.pestanas[$scope.indiceArray2]=$scope.cosaMedio;
					$scope.cosaMedio=$scope.pestana1.pestanas[$scope.indiceArray1];
				}
				//$scope.indice=0;
				//pestanas.cambiarPestana();
				//$scope.pestanaGeneralSeleccionada=current;
				//$scope.arrayPruebas=pestanas.getPestanas();
				// console.log($scope.arrayPruebas);
				
				// var temp = {};
				// temp=pestanas.getContenidoPestana(0);
				// $scope.cosaMedio.nombre=temp.nombre;
				// $scope.cosaMedio.vistaSeleccionada=temp.vista;
				// $scope.cosaMedio.arrayJson=temp.docs;
				// $scope.cosaMedio.pathactual=temp.path;

				var aux=$scope.cosaMedio.pathactual.split("/");
				aux[0]="/";
				aux.pop();

				$rootScope.$broadcast('acomodarArbol',$scope.cosaMedio.pathactual);
				$rootScope.$broadcast('irADireccion',aux);
				// if($scope.indiceArray1!=0 || $scope.indiceArray2!=0)
				// 	flagPestanaGrande=true;

				// $scope.indiceArray1=0;
				// $scope.indiceArray2=0;
				$scope.pestanaGeneralSeleccionada=current;
				// $scope.apply()

				//pestanas.printPestanas();

			}
		});


		//Espera el cambio en el indice de las pestañas personales
		$scope.$watch('indiceArray1', function(current, old){
			if(current!=old && !flagPestanaGrande && current >= 0 && old >= 0){//para que no entre cuando esta cargando, a veces se llama solo desde angular con valores negativos
				//$scope.arrayPruebas[old]=$.extend({}, $scope.cosaMedio);

 				//pestanas.actualizarPestana(old,$scope.cosaMedio.nombre,$scope.cosaMedio.vistaSeleccionada,$scope.cosaMedio.arrayJson,$scope.cosaMedio.pathactual);
				// if($scope.pestanaGeneralSeleccionada==0){
					$scope.pestana1.pestanas[old]=$scope.cosaMedio;//SI QUIERO QUE SE GUARDE LOCAL LO QUE VISITO
					$scope.cosaMedio=$scope.pestana1.pestanas[current];//SI QUIERO QUE SE GUARDE LOCAL LO QUE VISITO
					//$rootScope.$broadcast('cambiarSoloRelleno',aux);
				// }else{
				// 	$scope.pestana2.pestanas[old]=$scope.cosaMedio;
				// 	$scope.cosaMedio=$scope.pestana2.pestanas[current];
				// }

				//$scope.cosaMedio=$scope.arrayPruebas[current];

				// var temp = {};
				// temp=pestanas.getContenidoPestana(current);
				// $scope.cosaMedio.nombre=temp.nombre;
				// $scope.cosaMedio.vistaSeleccionada=temp.vista;
				// $scope.cosaMedio.arrayJson=temp.docs;
				// $scope.cosaMedio.pathactual=temp.path;
				//console.log($scope.cosaMedio.pathactual);

				var aux=$scope.cosaMedio.pathactual.split("/");
				aux[0]="/";
				aux.pop();
				//$scope.arrayPruebas[old].nombre=$scope.cosaMedio.nombre;
				//console.log($scope.arbolActivo);
				// if($scope.arbolActivo=="treedata"){
				// 	$scope.arrayPruebas[old].arbolSeleccionado="treedata";
				// 	//$scope.arrayPruebas[old].tree=$.extend({}, $scope.treedata);
				// }else{
				// 	$scope.arrayPruebas[old].arbolSeleccionado="treedata2";
				// 	//$scope.arrayPruebas[old].tree=$.extend({}, $scope.treedata2);
				// }
				// if($scope.arrayPruebas[current].arbolSeleccionado=="treedata"){
					// $scope.arbolActivo=="treedata";
					// $scope.arrayPruebas[current].arbolSeleccionado="treedata";
					//$scope.treedata=$scope.arrayPruebas[current].tree;
					$rootScope.$broadcast('acomodarArbol',$scope.cosaMedio.pathactual);
				// }else{
				// 	$scope.arbolActivo=="treedata2";
				// 	$scope.arrayPruebas[current].arbolSeleccionado="treedata2";
				// 	//$scope.treedata2=$scope.arrayPruebas[current].tree;
				// 	$rootScope.$broadcast('acomodarArbol2',$scope.arrayPruebas[current].pathactual, $scope.arrayPruebas[current].tree);
				// }
				$rootScope.$broadcast('irADireccion',aux);
			}
			flagPestanaGrande=false;
			// if(current<0 || old<0)
			// 	$scope.indice=0;
			//console.log($scope.indiceArray1);
		});

		//Espera el cambio en el indice de las pestañas institucionales
		$scope.$watch('indiceArray2', function(current, old){
			if(current!=old && !flagPestanaGrande && current >= 0 && old >= 0){//para que no entre cuando esta cargando, a veces se llama solo desde angular con valores negativos
				//$scope.arrayPruebas[old]=$.extend({}, $scope.cosaMedio);

 				//pestanas.actualizarPestana(old,$scope.cosaMedio.nombre,$scope.cosaMedio.vistaSeleccionada,$scope.cosaMedio.arrayJson,$scope.cosaMedio.pathactual);

				$scope.pestana2.pestanas[old]=$scope.cosaMedio;
				$scope.cosaMedio=$scope.pestana2.pestanas[current];
			

				//$scope.cosaMedio=$scope.arrayPruebas[current];

				// var temp = {};
				// temp=pestanas.getContenidoPestana(current);
				// $scope.cosaMedio.nombre=temp.nombre;
				// $scope.cosaMedio.vistaSeleccionada=temp.vista;
				// $scope.cosaMedio.arrayJson=temp.docs;
				// $scope.cosaMedio.pathactual=temp.path;
				//console.log($scope.cosaMedio.pathactual);

				var aux=$scope.cosaMedio.pathactual.split("/");
				aux[0]="/";
				aux.pop();
				//$scope.arrayPruebas[old].nombre=$scope.cosaMedio.nombre;
				//console.log($scope.arbolActivo);
				// if($scope.arbolActivo=="treedata"){
				// 	$scope.arrayPruebas[old].arbolSeleccionado="treedata";
				// 	//$scope.arrayPruebas[old].tree=$.extend({}, $scope.treedata);
				// }else{
				// 	$scope.arrayPruebas[old].arbolSeleccionado="treedata2";
				// 	//$scope.arrayPruebas[old].tree=$.extend({}, $scope.treedata2);
				// }
				// if($scope.arrayPruebas[current].arbolSeleccionado=="treedata"){
					// $scope.arbolActivo=="treedata";
					// $scope.arrayPruebas[current].arbolSeleccionado="treedata";
					//$scope.treedata=$scope.arrayPruebas[current].tree;
					$rootScope.$broadcast('acomodarArbol',$scope.cosaMedio.pathactual);
				// }else{
				// 	$scope.arbolActivo=="treedata2";
				// 	$scope.arrayPruebas[current].arbolSeleccionado="treedata2";
				// 	//$scope.treedata2=$scope.arrayPruebas[current].tree;
				// 	$rootScope.$broadcast('acomodarArbol2',$scope.arrayPruebas[current].pathactual, $scope.arrayPruebas[current].tree);
				// }
				$rootScope.$broadcast('irADireccion',aux);
			}
			flagPestanaGrande=false;
			// if(current<0 || old<0)
			// 	$scope.indice=0;
			//console.log($scope.indiceArray2);
		});

		$scope.agregarPestana = function(path, nombre){
				var cosaMedioMediana = {};
				cosaMedioMediana.nombre=nombre;
				//cosaMedioMediana.arrayJson=null;
				// if($scope.arbolActivo=="treedata"){
				// 	cosaMedioMediana.arbolSeleccionado="treedata";
				// 	cosaMedioMediana.tree=$.extend({}, $scope.treedata);
				// }else{
				// 	cosaMedioMediana.arbolSeleccionado="treedata2";
				// 	cosaMedioMediana.tree=$.extend({}, $scope.treedata2);
				// }
				cosaMedioMediana.vistaSeleccionada="grid";
				cosaMedioMediana.nombre = nombre;
				cosaMedioMediana.pathactual = path+nombre+"/";
				cambiarRellenoOtraTab(cosaMedioMediana,path+nombre+"/", nombre);
				//console.log(cosaMedioMediana);
				//var pathCompleto=path+nombre;
				//console.log(pathCompleto);
				//var cosaMedioAux = $.extend({}, $scope.cosaMedio);
				
				//$scope.arrayPruebas.push(cosaMedioMediana);
				//$rootScope.$broadcast('cambiarRelleno',pathCompleto+"/");//
				//pestanas.printPestanas();
		}



		$scope.$watch('fileUpoad',function(){
			//console.log("subiend..."+$scope.fileUpoad);
			conectorWS.upload($scope.fileUpoad, function(nombre){

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
		});


		//Carga inicial del contenido (cuando se carga la primera vez)
		conectorWS.buscarWS("/",function(data){
       		if($scope.SelectedDoc!=null){
       			$rootScope.$broadcast('agregarCarpetaDireccion', $scope.SelectedDoc);
       			// if($scope.arbolActivo=='treedata'){
       			$rootScope.$broadcast('acomodarArbol',"/"+$scope.SelectedDoc.nombre);
       			// }else{
       			// $rootScope.$broadcast('acomodarArbol2',"/"+$scope.SelectedDoc.nombre);
       			// }
       		}

            //console.log(data);
            $scope.cosaMedio.arrayJson=data;
            $scope.SelectedDoc=null;
            aplicarDraggable();
            $scope.cosaMedio.cargando=false;
		});

		//Carga inicial del contenido (cuando se carga la primera vez)
		$scope.cosaMedio2={};
		conectorWS.buscarWS("/",function(data){
       		if($scope.SelectedDoc!=null){
       			$rootScope.$broadcast('agregarCarpetaDireccion', $scope.SelectedDoc);
       			// if($scope.arbolActivo=='treedata'){
       			$rootScope.$broadcast('acomodarArbol',"/"+$scope.SelectedDoc.nombre);
       			// }else{
       			// $rootScope.$broadcast('acomodarArbol2',"/"+$scope.SelectedDoc.nombre);
       			// }
       		}

            //console.log(data);
            $scope.cosaMedio2.arrayJson=data;
            $scope.SelectedDoc=null;
            aplicarDraggable();
            $scope.cosaMedio2.cargando=false;
		});



		//Es necesario realizar una copia del objeto (no una referencia) porque sino los cambios realizados en  la primera pestaña de las dos pestañas
		//generales se van a compartir entre ellas
		var cosaMedio2 = $.extend( {}, $scope.cosaMedio );

		$scope.pestana1.pestanas.push($scope.cosaMedio);
		$scope.pestana2.pestanas.push(cosaMedio2);


		var aplicarDraggable = function(){
			$timeout(function() {
				//console.log("funciona!!!!");
							$(".gray").draggable();
	        	$(".esCarpeta").droppable({
	        		drop: function(event, ui){
		        		$scope.cosaMedio.arrayJson[findObjectbyId($scope.cosaMedio.arrayJson,ui.draggable[0].id)].path=$scope.cosaMedio.arrayJson[findObjectbyId($scope.cosaMedio.arrayJson,this.id)].path+$scope.cosaMedio.arrayJson[findObjectbyId($scope.cosaMedio.arrayJson,this.id)].nombre+"/";
		        		$scope.eliminarObjetoDelArray(ui.draggable[0]);
	        		}
	        	});
			},0);
		}

		var cambiarRellenoOtraTab = function(tab, path, nombre){
			conectorWS.buscarWS(path, function(data){
				// console.log("pasa");
	            //tab.arrayJson=data;

	            if($scope.pestanaGeneralSeleccionada==0){
					$scope.pestana1.pestanas.push(tab);
					
				}else{
					$scope.pestana2.pestanas.push(tab);
				}

	            //pestanas.agregarPestana(nombre,"grid",tab.arrayJson,tab.pathactual);
	        });
		}

		$rootScope.$on('cambiarRelleno', function(event, path) {
			$scope.cosaMedio.cargando=true;
			var aux=path.split("/");
			$scope.cosaMedio.nombre=aux[aux.length-2];
			$scope.cosaMedio.pathactual=path;
			conectorWS.buscarWS(path, function(data){
				if($scope.SelectedDoc!=null && data!=null){//Para saber si estoy entrando en una carpeta o subiendo de nivel
	       		 	$rootScope.$broadcast('agregarCarpetaDireccion', $scope.SelectedDoc);
	       		}
	       		// if($scope.arbolActivo=='treedata'){
	       			$rootScope.$broadcast('acomodarArbol',path);
				// }else{
	   //     			$rootScope.$broadcast('acomodarArbol2',path);
	   //     		}
	            $scope.cosaMedio.arrayJson=data;
	            $scope.SelectedDoc=null;
	            aplicarDraggable();
	            $scope.cosaMedio.cargando=false; 
			},function(){
				$scope.cosaMedio.cargando=false; 
			});
			
		});

		//busca el contenido de la tab nuevamente porque hay un cambio en esa carpeta (el evento es generado por webSocket)
		$rootScope.$on('recargarRelleno',function(event, path){
		// console.log("El path q llego es "+path);
		// console.log("pestaña 1 es "+$scope.pestana1.pestanas[0].pathactual);
		// $scope.pestana1.pestanas=[];
  //   	$scope.pestana2.pestanas=[];
    	$scope.pestana1.pestanas.forEach(function(pestana, i) {
    		if(pestana.pathactual==path){
    			conectorWS.buscarWS(pestana.pathactual, function(data){
					//console.log("voy a "+$scope.cosaMedio.pathactual);
		            pestana.arrayJson=data;
		            $scope.SelectedDoc=null;
		            aplicarDraggable();
	  
				},function(){

				}/*,$scope.cosaMedio.pathactual*/);//esta ultima parte es una prueba para desuscribirse de los eventos de room

    		}
    	});
    	$scope.pestana1.pestanas.forEach(function(pestana, i) {
    		if(pestana.pathactual==path){
				conectorWS.buscarWS(pestana.pathactual, function(data){
					//console.log("voy a "+$scope.cosaMedio.pathactual);
		            pestana.arrayJson=data;
		            $scope.SelectedDoc=null;
		            aplicarDraggable();
	  
				},function(){

				}/*,$scope.cosaMedio.pathactual*/);//esta ultima parte es una prueba para desuscribirse de los eventos de room
    		}
    	});



		});
		
		//Se cambia el relleno de la pagina sin tocar el arbol
		$rootScope.$on('cambiarSoloRelleno', function(event, path) {
			var patron=/\/+/;
			var aux=patron.exec(path)
			if (aux[0].length == path.length) {
				path="/";
				$scope.cosaMedio.nombre="/";	
			}else{
			var aux=path.split("/");
			$scope.cosaMedio.nombre=aux[aux.length-2];
			}
			$scope.cosaMedio.pathactual=path;
			$scope.cosaMedio.cargando=true;
			conectorWS.buscarWS(path+"/", function(data){
				$scope.cosaMedio.arrayJson=data;
             	$scope.SelectedDoc=null;
             	aplicarDraggable();
            	$scope.cosaMedio.cargando=false; 
			},function(){
				$scope.cosaMedio.cargando=false; 
			});
		});

		//Cambio entre vista de grilla y vista de lista
		$rootScope.$on('cambiarTipoVista', function(event) { 
			if($scope.cosaMedio.vistaSeleccionada=="list"){
				$scope.cosaMedio.vistaSeleccionada = "grid";
			}
			else{
				$scope.cosaMedio.vistaSeleccionada = "list";
			}
		});

		$rootScope.$on('crearCarpeta', function(event, nombreCarpeta, path, callback) { 
			var nombreRepetido=false;
			for(var i=0;i<$scope.cosaMedio.arrayJson.length;i++)
				if($scope.cosaMedio.arrayJson[i].nombre==nombreCarpeta){
					nombreRepetido=true;
					return callback("nombreRepetido");
				}
			if(!nombreRepetido){
				$rootScope.$broadcast('getCarpetaActual', function(nivel) {
					var json = {};
					json.nombre=nombreCarpeta;
					json.path=path;
					json.tipo="carpeta";
					json.pathImg="/images/folder.png"
					json.id=Math.random()*100;
					$scope.cosaMedio.arrayJson.push(json);
					conectorWS.crearCarpeta(path,nombreCarpeta);
					
				});
				return callback("exito");
			}
		});

		$rootScope.$on('cambiarNombreDocumento', function(event, nombreNuevo, callback) { 
			var nombreRepetido=false;
			for(var i=0;i<$scope.cosaMedio.arrayJson.length;i++)
				if($scope.cosaMedio.arrayJson[i].nombre==nombreNuevo){
					nombreRepetido=true;
					return callback("nombreRepetido");
				}
			if(!nombreRepetido){
				conectorWS.renombrarWS($scope.cosaMedio.arrayJson[findObjectbyId($scope.cosaMedio.arrayJson,$scope.SelectedDoc.id)].path,$scope.cosaMedio.arrayJson[findObjectbyId($scope.cosaMedio.arrayJson,$scope.SelectedDoc.id)].nombre,nombreNuevo);
				$scope.cosaMedio.arrayJson[findObjectbyId($scope.cosaMedio.arrayJson,$scope.SelectedDoc.id)].nombre=nombreNuevo;
				return callback("exito");
			}
		});

		$rootScope.$on('crearDocumento', function(event, documentoCreado, callback) { 
			$scope.cosaMedio.arrayJson.push(documentoCreado);
			return callback("exito");
		});

		$rootScope.$on('seleccionarElemento',function(event,elementoSeleccionado){
			$scope.SelectedDoc = {};
			$scope.SelectedDoc.nombre=elementoSeleccionado.nombre;
			$scope.SelectedDoc.path=elementoSeleccionado.path;
			$scope.SelectedDoc.tipo=elementoSeleccionado.tipo;
			$scope.SelectedDoc.pathImg=elementoSeleccionado.pathImg;
			$scope.SelectedDoc.id=elementoSeleccionado.id;
		});

		//SE USA EN EL TEMPLATE
		$scope.seleccionar = function(unaCosa,$event){
			if($event.which==2 && unaCosa.tipo=="carpeta"){
				$scope.agregarPestana(unaCosa.path,unaCosa.nombre);
			}
        	$scope.SelectedDoc = {};
			$scope.SelectedDoc.nombre=unaCosa.nombre;
			$scope.SelectedDoc.path=unaCosa.path;
			$scope.SelectedDoc.tipo=unaCosa.tipo;
			$scope.SelectedDoc.pathImg=unaCosa.pathImg;
			$scope.SelectedDoc.id=unaCosa.id;
		}

		//SE USA EN EL TEMPLATE
		$scope.clickDoble = function(objeto){
			if($scope.SelectedDoc.tipo=="carpeta"){
				$rootScope.$broadcast('cambiarRelleno',$scope.SelectedDoc.path+""+$scope.SelectedDoc.nombre+"/");//
				// var iosocket = io.connect("http://172.16.248.194:8080");
			}
		}


	
		var findObjectbyId = function(array,id){
			for(var i=0;i<array.length;i++){
				if(array[i].id==id)
					return i;
			}
		}

		
		$scope.eliminarObjeto = function(){
			$scope.cosaMedio.arrayJson.splice(findObjectbyId($scope.cosaMedio.arrayJson,$scope.SelectedDoc.id),1);
			conectorWS.borrarCarpetaWS($scope.SelectedDoc.path+"/"+$scope.SelectedDoc.nombre);

		}

		$scope.eliminarObjetoDelArray = function(elemento){
			$scope.cosaMedio.arrayJson.splice(findObjectbyId($scope.cosaMedio.arrayJson,elemento.id),1)
		}
			
		}],
		templateUrl: '/views/templateCosaDelMedio.html',
		link: function($scope, $ele, $attrs, ctrl){

		},
		compile: function(){
			return {
				post:function postLink(scope, element, attributes,ctrl){
					
				}
			};
		}
	}

})

.directive('ngBarraDireccion', function(){
	return{
		restrict: 'E',
		controller:['$scope','$rootScope', function($scope, $rootScope){
			$scope.barraDireccion={};
			$scope.barraDireccion.arrayCarpetas = [];
			var json = {};
			json.nombre="/";
			json.path="/";
			json.tipo="carpeta";
			json.pathImg="/images/folder.png"
			json.id=1;
			$scope.barraDireccion.arrayCarpetas.push(json);
			// json = {};
			// json.nombre="home";
			// json.path="/";
			// json.tipo="carpeta";
			// json.pathImg="/images/folder.png"
			// json.id="/home";
			// $scope.barraDireccion.arrayCarpetas.push(json);

			//Agrega una carpeta a la barra de direccion
			$rootScope.$on('agregarCarpetaDireccion', function(event, carpeta) { 
				if(carpeta != ""){
					$scope.barraDireccion.arrayCarpetas.push(carpeta);
				}
			});

			//Subo un nivel en la barra de direcciones
			$rootScope.$on('subir:nivel', function(event, callback) {
				if($scope.barraDireccion.arrayCarpetas.length>1){
					// acomodarTamaños("quitar");
					return callback($scope.barraDireccion.arrayCarpetas.pop());
				}
				return callback($scope.barraDireccion.arrayCarpetas[0]);
			});

			//Limpia la barra de direccion (no se puede recuperar) y la llena con el contenido del array carpeta
			$rootScope.$on('irADireccion', function(event, carpeta) { 
				$scope.barraDireccion.arrayCarpetas=[];
				for(var i=0;i<carpeta.length;i++){
					var aux="";	
					for(var j=1;j<i;j++)
						aux=aux+"/"+carpeta[j]
						aux+="/";
						var json = {};
						json.nombre=carpeta[i]	;
						json.path=aux;
						json.tipo="carpeta";
						json.pathImg="/images/folder.png"
						json.id=aux+"/"+carpeta[i];
						if(i==0){
							json.path="/";
							json.id=1;
						}
						if(i==1){
							json.path="/";
							json.id=carpeta[i-1];
						}
						$scope.barraDireccion.arrayCarpetas.push(json);
				}
			});


			$rootScope.$on('errorAccediendoCarpeta', function(event, carpeta) { 
				$scope.barraDireccion.arrayCarpetas=carpeta.split("/");
			});

			//LO USO EN EL TEMPLATE DE LA DIRECTIVA
			//EL IF ESTA PORQUE LE AGREGO LAS / A MANO Y COMO LA / NO TIENE / QUE MAL
			//Sirve para volver solamente, no se puede usar en el arbol
			$scope.irACarpeta = function(carpeta){
				// acomodarTamaños($scope.barraDireccion.arrayCarpetas.indexOf(carpeta)+1);
				$scope.barraDireccion.arrayCarpetas.splice($scope.barraDireccion.arrayCarpetas.indexOf(carpeta)+1,$scope.barraDireccion.arrayCarpetas.length-$scope.barraDireccion.arrayCarpetas.indexOf(carpeta));
				$scope.SelectedDoc=null;
				if(carpeta.nombre!="/"){
					$rootScope.$broadcast('cambiarRelleno',$scope.barraDireccion.arrayCarpetas[$scope.barraDireccion.arrayCarpetas.length-1].path+"/"+$scope.barraDireccion.arrayCarpetas[$scope.barraDireccion.arrayCarpetas.length-1].nombre+"/");
				}else{
					$rootScope.$broadcast('cambiarRelleno',"/");
				}
			}

			$scope.getCarpetaActual = function(){
				return $scope.barraDireccion.arrayCarpetas[$scope.barraDireccion.arrayCarpetas.length-1].path+""+$scope.barraDireccion.arrayCarpetas[$scope.barraDireccion.arrayCarpetas.length-1].nombre+"/";
			}

			$rootScope.$on('getCarpetaActual', function(event, callback){
				return callback($scope.barraDireccion.arrayCarpetas[$scope.barraDireccion.arrayCarpetas.length-1].path+""+$scope.barraDireccion.arrayCarpetas[$scope.barraDireccion.arrayCarpetas.length-1].nombre+"/");
			});

			$scope.mostrarMas = function($event){
				var pedazosPath=$('#contenedorPath .divPedazoPath');
				//var pedazosPath=$('.ejemplos');
				var agrandate=false;
				for(var i=0;i<pedazosPath.length;i++){
					// if(pedazosPath.length>15 && !agrandate){
					// 	$('.divPedazoPath').parent().parent().css("display","none");
					// }
					if(agrandate){
						pedazosPath.eq(i).css("text-overflow","clip");
						pedazosPath[i].style.overflow="hidden";
						//$("#contenedorMayorBarra").css("width","100%");
						//pedazosPath[i].css("margin-right","10px");
					}
					if($event.currentTarget==pedazosPath[i]){
						agrandate=true;
					}

				}
				//if(pedazosPath.length>10)
					//$('.divPedazoPathFinal').parent().parent().css("display","none");
			}


			$scope.acomodarComoAntes = function($event){
				var pedazosPath=$('#contenedorPath .divPedazoPath');
				var agrandate=false;
				for(var i=0;i<pedazosPath.length;i++){
					if($event.currentTarget==pedazosPath[i]){
						agrandate=true;
						//$("#contenedorMayorBarra").css("width","90%");

					}
					if(agrandate){
						pedazosPath.eq(i).css("text-overflow","ellipsis");
						// pedazosPath[i].style.width="inherit";
					}
					if(pedazosPath.length>10){
						//$('.divPedazoPathFinal').parent().parent().css("display","flex");	
					}
				}
			}

			// var acomodarTamaños = function(operacion){

			// 	var pedazos = $(".divPedazoPath");

			// 	// if( (parseInt(pedazos.eq(0).parent().parent().css("width"))<35)  || (pedazos.eq(0).parent().parent().css("display") == "none")){
			// 	// 	$scope.layout="igual"
			// 	// }else{
			// 	// 	$scope.layout="desigual"
			// 	// }
			// 	// var pedazitos = $(".divPedazoPath span");
			// 	// for(var i=0;i<$scope.arrayCarpetas.length;i++){
			// 	// 	var tamaño=pedazitos.eq(i).css("width");
			// 	// 	pedazitos.parent.eq(i).css("width",tamaño);
			// 	// }
				
			// 	if(operacion=="agregar"){
			// 		//if(pedazos.length>5){
			// 			if(parseInt(pedazos.eq($scope.arrayCarpetasInvi.length+1).css("width"))<=36){
			// 				pedazos.eq($scope.arrayCarpetasInvi.length).parent().parent().css("display","none");
			// 				$scope.arrayCarpetasInvi.push(pedazos.eq($scope.arrayCarpetasInvi.length).parent().parent());
			// 				return;
			// 			}
			// 		//}
			// 	}else if(operacion=="quitar"){
			// 		if($scope.arrayCarpetasInvi.length>0){
			// 			$scope.arrayCarpetasInvi.pop().css("display","flex");
			// 		}
			// 	}else{//SE ELIGIO LA OPCION IRA, OPERACION EN ESTE CASO TRAE EL INDEX DE LA DE LA CARPETA ELEGIDA EN ARRAYCARPETAS
			// 		if($scope.arrayCarpetasInvi.length>0){
			// 			console.log(operacion);
			// 			if(($scope.arrayCarpetas.length-operacion)>$scope.arrayCarpetasInvi.length){
			// 				for(var i = 0;i<$scope.arrayCarpetasInvi.length;i++){
			// 					$scope.arrayCarpetasInvi.pop().css("display","flex");
			// 				}
			// 			}else{
			// 				for(var i = 0;i<($scope.arrayCarpetas.length-operacion);i++){
			// 					$scope.arrayCarpetasInvi.pop().css("display","flex");
			// 				}
			// 			}
			// 		}
			// 	}

			// }

		}],
		templateUrl: '/views/templateBarraCarpeta.html',
	};
})

.directive('whenScrollEnds', function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
            	//console.log(element);
                var visibleHeight = element.height();
                var threshold = 200;

                element.scroll(function() {
                	
                    var scrollableHeight = element.prop('scrollHeight');
                    var hiddenContentHeight = scrollableHeight - visibleHeight;

                    if (hiddenContentHeight - element.scrollTop() <= threshold) {
                        // Scroll is almost at the bottom. Loading more rows
                        scope.$apply(attrs.whenScrollEnds);
                    }
                });
            }
        };
    })

.directive('whenScrollEnds', function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
            	//console.log(element);
                var visibleHeight = element.height();
                var threshold = 200;

                element.scroll(function() {
                	
                    var scrollableHeight = element.prop('scrollHeight');
                    var hiddenContentHeight = scrollableHeight - visibleHeight;

                    if (hiddenContentHeight - element.scrollTop() <= threshold) {
                        // Scroll is almost at the bottom. Loading more rows
                        scope.$apply(attrs.whenScrollEnds);
                    }
                });
            }
        };
    })

    .directive( 'treeModel', ['$compile', function( $compile ) {
		return {
			restrict: 'A',
			controller: function($rootScope,$scope){
				this.treeId;
				this.treeModel;
				this.nodeId;
				this.nodeLabel;
				this.nodeChildren;
				this.three;
				this.dblClick;

				

				this.seleccionNodo = function(nodo){
					$rootScope.$broadcast('seleccionNodo', nodo);
				}
			},
			link: function (scope, element, attrs, controller ) {
				
				controller.treeId = attrs.treeId;
				
				//tree model
				controller.treeModel = attrs.treeModel;

				var arbolNro = attrs.arbolNro;

				controller.dblClick = attrs.dblClick || controller.dblClick;

				//node id
				controller.nodeId = attrs.nodeId || 'id';

				//node label
				controller.nodeLabel = attrs.nodeLabel || 'label';

				//children
				controller.nodeChildren = attrs.nodeChildren || 'children';

				//tree template
				var template =
					'<ul class="misCosas">' +
						'<li data-ng-repeat="node in ' + controller.treeModel + '"><div>' +
							'<i class="collapsed" data-ng-show="node.' + controller.nodeChildren + '.length && node.collapsed" data-ng-click="' + controller.treeId + '.selectNodeHead(node)"></i>' +//<ng-md-icon icon="folder" style="fill: #7D7D7D" size="20" data-ng-show="node.' + nodeChildren + '.length && node.collapsed"></ng-md-icon>
							'<i class="expanded" data-ng-show="node.' + controller.nodeChildren + '.length && !node.collapsed" data-ng-click="' + controller.treeId + '.selectNodeHead(node)"></i>' +//<ng-md-icon icon="folder_open" style="fill: #7D7D7D" size="20" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed"></ng-md-icon>
							'<i class="normal" data-ng-hide="node.' + controller.nodeChildren + '.length"></i> ' +//<ng-md-icon icon="folder" style="fill: #7D7D7D" size="20" data-ng-hide="node.' + nodeChildren + '.length""></ng-md-icon>
							'<span data-ng-class="node.selected" data-ng-click="' + controller.treeId + '.selectNodeLabel(node)" >{{node.' + controller.nodeLabel + '}}</span>' +
							'</ng-md-icon><div data-ng-hide="node.collapsed" data-tree-id="' + controller.treeId + '" data-tree-model="node.' + controller.nodeChildren + '" data-node-id=' + controller.nodeId + ' data-node-label=' + controller.nodeLabel + ' data-node-children=' + controller.nodeChildren + '></div>' +
						'<div></li>' +
					'</ul>';
		

				//check tree id, tree model
				if( controller.treeId && controller.treeModel ) {

					//root node
					if( attrs.angularTreeview ) {

						scope.$on('cambioEnDireccion', function(event, nodo) {
							// console.log(controller.treeId);
							scope[controller.treeId].selectNodeLabel(nodo);
						});
					
						//create tree object if not exists
						scope[controller.treeId] = scope[controller.treeId] || {};
						controller.tree=scope[controller.treeId];

						//if node head clicks,
						scope[controller.treeId].selectNodeHead = scope[controller.treeId].selectNodeHead || function( selectedNode ){

							//Collapse or Expand
							selectedNode.collapsed = !selectedNode.collapsed;
						};

						//if node label clicks,
						scope[controller.treeId].selectNodeLabel = scope[controller.treeId].selectNodeLabel || function( selectedNode ){
							// console.log("NODO:");
							// console.log(selectedNode);
							//remove highlight from previous node
							// console.log(controller.treeId);
							if( scope.currentNode && scope.currentNode.selected ) {
								scope.currentNode.selected = undefined;
							}

							//set highlight to selected node
							selectedNode.selected = 'selectedTree';
							// console.log("Seleccionado:");
							// console.log(selectedNode);

							//set currentNode
							scope.currentNode = selectedNode;
							scope.nodoSeleccionado = selectedNode;
							scope.arbolActivo = controller.treeModel;
							controller.seleccionNodo(selectedNode);
			
						};
					}

					//Rendering template.
					
					element.html('').append( $compile( template )( scope ) );
				}
			}


		};

	}]);