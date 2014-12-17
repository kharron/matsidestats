angular.module('starter.directives', [])

	/* Directive that manages the action button on the TeamView / Roster page */
		.directive('actionButton', function(){
				return {
					restrict: 'E',
					content: '=',
					scope: {
						wrestler: '=wrestler',
						matches: '=matches_complete'
					},
					template: '<a href="{{ button_link }}" class="button button-full icon-left {{ button_class }}">{{ button_text }}</a>',
					controller: function($scope) {
							var wid = $scope.wrestler.id // Wrestler Id
							var matches = $scope.matches_complete;
							console.log($scope.wrestler);
							console.log($scope.matches_complete);
					
									$scope.button_link = '#/roster/track/' + wid;
									$scope.button_class = 'ion-flash button-energized';
									$scope.button_text = 'Start Match';
									/*
							for (i=0; i<matches.length; i++){
								if (matches[i].wrestlerid = wid){
										$scope.button_link = '#/roster/track/' + wid + '/';
										$scope.button_class = 'ion-speedometer button-assertive';
										$scope.button_text = 'Resume Match'; 
										break;
								}
							}
							*/
							
							/*
							switch ($scope.wrestler.match_button){
								case 'no tourney':
									//$scope.button_link = '/editwrestler/' + wid + '/';
									$scope.button_link = '#/roster/wrestler-details/' + wid;
									$scope.button_class = 'ion-ios7-compose-outline button-balanced';
									$scope.button_text = 'Set Tournament';
									break;
								case 'start_match':
									//$scope.button_link = '/start_match/' + wid + '/';
									$scope.button_link = '#/roster/track/' + wid;
									$scope.button_class = 'ion-flash button-energized';
									$scope.button_text = 'Start Match';
									break;
								case 'add_opponent':
									//$scope.button_link = '/addopponent/' + wid + '/';
									$scope.button_link = '#/roster/track/' + wid ;
									$scope.button_class = 'ion-ios7-personadd-outline button-calm';
									$scope.button_text = 'Add Next Opponent';
									break;
								case 'resume_match':
									//$scope.button_link = '/resume_match/' + wid + '/' + $scope.wrestler.resume_match + '/';
									$scope.button_link = '#/roster/track/' + wid + '/';
									$scope.button_class = 'ion-speedometer button-assertive';
									$scope.button_text = 'Resume Match'; 
									break;
								default:
									$scope.button_link = '#/roster/wrestler-details/' + wid;
									$scope.button_class = 'ion-ios7-compose-outline button-balanced';
									$scope.button_text = 'Set Tournament';
						} // End Switch
						*/
					} // End Controller
				} // End Return
			})

