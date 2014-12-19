    $scope.refresh_roster = function(force, isOnline) {
			if (!$scope.wrestlers || force) {
				Roster.getRoster(force, isOnline).then(function(data) {
					//console.log(window.localStorage['roster']);
					if (isOnline){
						$scope.wrestlers = data['wrestlers'];
						$scope.nawrestlers = data['na_wrestlers'];
						$scope.$broadcast('scroll.refreshComplete');
					} else {
						data = JSON.parse(window.localStorage['roster']);
						$scope.wrestlers = data['wrestlers'];
						$scope.nawrestlers = data['na_wrestlers'];
					}
				});
			}
		}

		$scope.refresh_roster(force, isOnline);
