			/* 
			 * Module - Login Module
			 */
			var loginModule = angular.module('loginModule', []);
	
			loginModule.controller('validateController', function($scope, $http, $location){
				// initial settings
				$scope.login_text = "Login";

				// Take login info and validate it
				$scope.login = function() {
					$scope.login_text = "Logging In...";
					
					$http({ method: 'POST',
						url: 'http://www.matsidestats.com/loginapi/', 
						data: 'username='+ $scope.username + '&password='+ $scope.password,
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).
						success(function(data, status, headers, config){
							$scope.login_text = "Good Job";
							console.log("Successful Login");
							console.log(data);
							if (data == 'success'){
								$location.path('/staticpages/teamview');
							}

							// Incorrect Login
							if (data == 'nousername'){
								$(".alert").addClass("alert-danger");
								$scope.msg = "Incorrect Login";
							}
						}).
						error(function(data, status, headers, config){
							console.log("Unsuccessful Login");
						});
				}
			});

	/* 
	 * Module - Matside stats
	 */
		var matsidestats = angular.module('matsidestats', ['ngRoute', 'loginModule']);
		matsidestats.config(function($routeProvider,$locationProvider){
				$locationProvider.html5Mode(true);
				$routeProvider
					.when('/staticpages/', { 
						templateUrl: 'partials/login_partial.html',
					})
					.when('/staticpages/teamview', { 
						templateUrl: 'partials/roster2.html',
					})
					.when('staticpages/viewmatches/:id', {
						templateUrl: 'partials/viewmatches.html'
					})
					.otherwise({redirecTo: '/staticpages/'})
		})
	
	/*
	 * Controller - Roster View
	 */
		matsidestats.controller('teamviewCtrl', function($scope, $http){
				$http({ method: 'GET',
					url: 'http://www.matsidestats.com/wrestlerlist/', 
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).
					success(function(data, status, headers, config){
						$scope.wrestlers = data;
					}).
					error(function(data, status, headers, config){
						console.log("Unsuccessful Login");
					});

				$scope.start_match = function(start_match){ 
					if (start_match){
						return true;
					} else { 
						return false; 
					}
				}
				$scope.set_tournament = function(current_meet){
					if (current_meet = "No tournament set"){
						return true;
					} else {
						return false;
					}
				}

		})	

		matsidestats.controller('matchesController', function($scope, $http, $routeParam){
				$http({ method: 'GET',
					url: base_url + '/viewmatches/',
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				})
				.success(function(data, status, headers, config){
					$scope.matches = data;
				})
				.error(function(data, status, headers, config){
					console.log("Matches Error");
				});
		});

	/* Directive that manages the action button on the TeamView / Roster page */
		matsidestats.directive('actionButton', function(){
				return {
					restrict: 'E',
					content: '=',
					scope: {
						wrestler: '=wrestler'
					},
					template: '<a href="{{ button_link }}" class="btn btn-{{ button_class }}" style="color:#fff;">{{ button_text }}</a>',
					controller: function($scope) {
							wid = $scope.wrestler.id // Wrestler Id
							switch ($scope.wrestler.match_button){
								case 'no_tourney':
									$scope.button_link = '/editwrestler/' + wid + '/';
									$scope.button_class = 'danger';
									$scope.button_text = 'Set Tournament';
									break;
								case 'start_match':
									$scope.button_link = '/start_match/' + wid + '/';
									$scope.button_class = 'success';
									$scope.button_text = 'Start Match';
									break;
								case 'add_opponent':
									$scope.button_link = '/addopponent/' + wid + '/';
									$scope.button_class = 'warning';
									$scope.button_text = 'Add Next Opponent';
									break;
								case 'resume_match':
									$scope.button_link = '/resume_match/' + wid + '/' + $scope.wrestler.resume_match + '/';
									$scope.button_class = 'danger';
									$scope.button_text = 'Resume Match'; 
									break;
						} // End Switch
					} // End Controller
				} // End Return
			});

