//inicialización de la app
var app = angular.module('policy', ['ui.router']);

//configuración de las rutas http
app.constant('settings', {
	baseServices: 'https://poliza-back.herokuapp.com/'
});

//configuración de las rutas internas mediante angular y angular ui-router
app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider){
	
  $stateProvider.state({
  	name :         'index',
    url :          '/index',
    controller :   'IndexController',
    templateUrl :  'app/views/form.html'
   }).state({
  	name :         'policy',
    url :          '/polizas',
    controller :   'PolicyController',
    templateUrl :  'app/views/policies.html'
   });
	
//ruta de desvio si se ingresa mal la direción
  $urlRouterProvider.otherwise(function($injector){
    var $state = $injector.get('$state');
    $state.go('index');
  });
});

//controladores de la app
//controlador del index

app.controller('IndexController', ['$scope', '$state','PolicyService','User', function ($scope, $state, PolicyService, User) {
	$scope.user = User;
	
	$scope.typesPolicy = [];
	
//se llama al servicio que consulta la api REST para traer los tipos de póliza
	PolicyService.get((data)=>{
		$scope.typesPolicy = data;	
	});
	
	$scope.changePolicy = (policy) => {
		if(policy){
			var obj = JSON.parse(policy);
			$scope.user.policy_value = obj.value;
		}else{
			$scope.user.policy_value = "";
		}
		
	};

//se guarda la información pasandala a la factory
	$scope.save = () => {
		$scope.user.create();
	}
}]);

//controlador de los usuarios que ya tienen una poliza

app.controller('PolicyController', ['$scope','$state', 'UserService', function($scope, $state, UserService){

//se llama al servicio que consulta a la api REST para traer los usuarios registrados con póliza
	UserService.get((data)=>{
		$scope.users = data;
	});
}]);


//inicio de los factory

//factory de usuario que controla los tipos de datos que se llevarán a la base de datos

app.factory('User', ['$state','UserService', function ($state,UserService) {
	let user = {
        document      : null,
		name          : null,
		type_policy   : null,
		policy_number : null,
		policy_value  : null
	}
	user.init = (setup) => {
        user.document      = setup.document;
		user.name          = setup.name;
		user.type_policy   = setup.type_policy;
		user.policy_number = setup.policy_number;
		user.policy_value  = setup.policy_value;
    }
	
//función de llenado de datos, está se comunica con el servicio que llama a la api REST para llenarlos en la base de datos
    
	user.create = () => {
		let newUser  = {
			document      : user.document,
            name          : user.name,
            type_policy   : user.type_policy,
			policy_number : Math.round(Math.random() * (99999999 - 10000000) + 10000000), // se le da un número ramdom al número de poliza de la persona
			policy_value  : user.policy_value
		}
		
		//validación de campos completos
        if(newUser.document == '' || newUser.document == null){
			swal('Campo obligatorio','Debe de poner un documento válido','info');
		}else if(newUser.name == '' || newUser.name == null){
		   	swal('Campo obligatorio','Debe de poner un nombre válido','info');
		} else if(newUser.type_policy == '' || newUser.type_policy == null){
            swal('Campo obligatorio','Debe de seleccionar la póliza que desea','info');
        }else{
			var obj = JSON.parse(newUser.type_policy);
			newUser.type_policy = obj.name;
			user.reset();
			UserService.create(newUser);
		}
	}
   
    
    user.reset = () =>{
    	user.document      = null;
		user.name          = null;
		user.type_policy   = null;
		user.policy_number = null;
		user.policy_value  = null;
    }
	return user
}]);

//servicios que se comunican con la api REST

//servicio de usuarios, está es la encargada de la comunicación con la api REST para el manejo de los usuarios con póliza (resgitros y consulta)

app.service('UserService', ['$state','$http','settings', function($state,$http,settings){
	
	//metodo POST para insertar datos
	this.create = (user) => {
		$http({
      	method: 'POST',
      	url: settings.baseServices + 'user',
        data: user
   		}).then(function (response){
            swal({
                  title: 'Dato guardado con éxito',
                  text: "",
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  $state.reload();
                })
   		},function (error){
			console.log(error);
		});
	}
	
	//metodo get para llamar los datos y listar
	
	this.get = (callback) => {
       $http({
      	method: 'GET',
      	url: settings.baseServices + 'user'
   		}).then(function (response){
		   	callback(response.data);
   		},function (error){
			console.log(error);
		});
    }
	
}]);

//servicio de pólizas, está es la encargada de la comunicación con la api REST para hacer la consulta de cuáles son las polizas

app.service('PolicyService', ['$state','$http','settings', function($state,$http,settings){
    this.get = (callback) => {
       $http({
      	method: 'GET',
      	url: settings.baseServices + 'policy'
   		}).then(function (response){
		   	callback(response.data);
   		},function (error){
			console.log(error);
		});
    }
}]);