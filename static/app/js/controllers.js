angular.module('starter.controllers', [])

.controller('initialCtrl', function($ionicPlatform, $scope, $state, $rootScope, TeamDb, $ionicPopup){
  $ionicPlatform.ready(function() {
		/*
		 * Check if this is the first time logging in.  Make a new team and username
		 */
		$scope.add_team_btn = "Add Team";

		$scope.team = {};
		var db = $rootScope.db;
		var has_team = 0;
		db.transaction(function(tx) {
			tx.executeSql("select * from teams;", [], function(tx, res){
				teams = [];
				for ( i=0; i<res.rows.length; i++ ){
					row = res.rows.item(i);
					teams.push({
						id: row['id'],
						name: row['name'],
						username: row['username'],
						city: row['city'],
						state: row['state'],
						api_key: row['api_key']
					})
				}
				window.localStorage['team'] = JSON.stringify(teams);
				//console.log(window.localStorage['team']);

				if (res.rows.length){
					$state.go('roster.teamview');
				}
				console.log(teams);
				console.log("Teams res.rows.length: " + res.rows.length);
				});
			});

		$scope.addTeam = function(){
		db = $rootScope.db;
		db.transaction(function(tx){
			tx.executeSql("select * from teams;", [], function(tx, res){
				console.log("Teams Len: " + res.rows.length);
			});
		});

			data = {'name': $scope.team.name, 'username': $scope.team.username, 'city': $scope.team.city, 'state': $scope.team.state};
			console.log($scope.team.name);
			console.log(data);
			 TeamDb.addTeam(data).then(function(data){
					team = data;
					console.log("Team Data: " + data);
					console.log(data);
					window.localStorage['team'] = JSON.stringify('['+team+']');
					$state.go('roster.teamview')
			});
		}
	});
})

.controller('trackCtrl', function($ionicPlatform, $scope, $stateParams, $state, Match, MatchScore, $ionicPopup){
  $ionicPlatform.ready(function() {

	/* Below are Global Vars */
	var count=120;
	var runtime='stop';
	var stall_warn1 = 0;
	var stall_warn2 = 0;
	var undo = 0;
	var wid  = $stateParams.wid


	/* End Global Vars */

	/* Initial Match Setup */
	$scope.start_match = function(){
		Match.start(wid).then(function(data){
			wrestler = data[0];
			match = data[1];
			var match_status = data[2];
			$scope.wrestler1 = wrestler.wrestler1;
			$scope.wrestler2 = wrestler.wrestler2;
			$scope.match = match;
			$scope.fill_match_data(match, match_status);
		})
	}
	$scope.period = 1; 
	console.log("First Period: " + $scope.period);
	$scope.start_match();

	/* In match stuff 
	 * This adds points to a match
	 */
	var points_scored = new Array();
	var point_id = 0;
	var curr_uuid = uuid();
	$scope.green_pts = 0;
	$scope.red_pts = 0;
	$scope.stall_red = 0;
	$scope.stall_green = 0;
	$scope.points = function(point, color){
		var point_type;
		var point_amt;
		if (point == 'fall'){
			// End the match and go to match score
			$scope.endMatch('fall', point, color);
		} else if (point == 'stall'){
			// Stall management
			if (color == 'red'){
				$scope.stall_red = $scope.stall_red+1;
				console.log("Stall Red: " + $scope.stall_red);
				if ($scope.stall_red == 2 || $scope.stall_red == 3){
					$scope.points("s1", "green");
				}
				if ($scope.stall_red == 4 || $scope.stall_red == 5){
					$scope.points("s2", "green");
				}
				if ($scope.stall_red > 5){
					$scope.endMatch("stallout", "green");
				}
			} else {
				$scope.stall_green = $scope.stall_green+1;
				console.log("Stall Green: " + $scope.stall_green);
				if ($scope.stall_green == 2 || $scope.stall_green == 3){
					$scope.points("s1", "red");
				}
				if ($scope.stall_green == 4 || $scope.stall_green == 5){
					$scope.points("s2", "red");
				}
				if ($scope.stall_green > 5){
					$scope.endMatch("stallout", "red");
				}
			} 
		} else {
			point_type = point[0];
			point_amt = parseInt(point[1]);

			// Account for penalties
			point = { 
				'id': curr_uuid,
				'period': $scope.period,
				'point_type': point_type,
				'point_amt': point_amt,
				'color': color
			} 
			if (color == 'green'){
				$scope.green_pts += parseInt(point_amt);
			} else {
				$scope.red_pts += parseInt(point_amt);
			}
			$scope.score(point);
			points_scored.push(point);
			ptcode = point_type.toUpperCase()+"-"+color
			manage_ui(ptcode, color);
		}
	}

	// It's an old match now fill the old points back in
	$scope.fill_match_data = function(match, match_status){
		var match_status = match_status
		Match.renew(match).then(function(data){
			console.log(data);
			$scope.green_pts = data[0];
			$scope.red_pts = data[1]; 
			lastPt = data[2];
			console.log("Period: " + data[3]);
			$scope.period = data[3];
			var match_status = match_status
				if(lastPt != 0){ 
					manage_ui(lastPt);
				}
		});
	}
	// Undo function
	// This removes the last button hit and updates the score
	$scope.undoPoints = function(){
		MatchScore.undoPoints($scope.match).then(function(removePts){
			// removePts is an array that contains the point ammount and the color to remove
			// it from.  This uses jQuery to perform the operation
			console.log(removePts);
			var negPts = removePts[0];
			var color = removePts[1]; 
			var lastPt = removePts[2];
			if (color == "red"){
				($scope.red_pts-negPts<0 ? '' : $scope.red_pts = $scope.red_pts-negPts); 
			} else {
				($scope.green_pts-negPts<0 ? '' : $scope.green_pts = $scope.green_pts-negPts);
			}
			// Manage UI for last points
			console.log("Last Point: " + lastPt);
			if (lastPt != 0){
				console.log("Last Point: " + lastPt);
				manage_ui(lastPt);
			} else {
					// Do nothing there is no last Point
			}
		});
	}

	// Manage Periods
		$scope.periodUp = function(){
			$scope.period = $scope.period+1
			$scope.periodEnd();
			manage_ui_neutral();
		}
		$scope.periodDn = function(){
			if ($scope.period > 1){
				$scope.period = $scope.period-1
			}
		}


		 $scope.periodEnd = function() {
			if ($scope.period != 4) { // overtime starts neutral by default
				$scope.wrestler_choice = [{name: $scope.wrestler1, value: 'green'}, {name: 'Opponent', value: 'red'}];
				$scope.period_choice = [{text: 'Top', value: 'top'}, {text: 'Bottom', value: 'bottom'}, {text: 'Neutral', value: 'neutral'}];
				$scope.dataWrestler = {serverSide: 'green'};
				$scope.dataPos = {clientSide: 'neutral'};
				var wrestlerChoice = $ionicPopup.alert({
					title: 'Period '+ $scope.period + ' Choice',
					scope: $scope,
					templateUrl: 'partials/wrestler-choice.html'
				});
				wrestlerChoice.then(function(res) {
					if(res) {
						meta = {period: $scope.period, wrestler: $scope.dataWrestler.serverSide, choice: $scope.dataPos.clientSide};
						Match.addMeta($scope.match, meta); 
						if ($scope.dataWrestler.serverSide == 'green'){
							var topPos = 'T-red';
							var bottom = 'T-green';
							if ($scope.dataPos.clientSide == 'top'){ manage_ui(topPos);}
							if ($scope.dataPos.clientSide == 'bottom'){ manage_ui(bottom);}
						} else {
							var topPos = 'T-green';
							var bottom = 'T-red';
							if ($scope.dataPos.clientSide == 'top'){ manage_ui(topPos);}
							if ($scope.dataPos.clientSide == 'bottom'){ manage_ui(bottom);}
						}

					} else {
						// Cancelling will put the period back
						if ($scope.period>1){
								$scope.period = $scope.period-1;
						} else {
							$scope.period = 1; // just to make sure period is right
						}
					}
				});
			}
		 }


		// End Match
		$scope.endMatch = function(how, point, color){
			var match = $scope.match;
			MatchScore.endMatch(how, color, match).then(function(data){
				$state.go('roster.view_match', {match_id: match.id, wrestler_name: $scope.wrestler_name});
			});
		}

	$scope.score = function(point){
		var match = $scope.match;
		MatchScore.addPoints(point, match).then(function(data){
			console.log(data);
		});
	}


	// Create a uuid for this match
	function uuid(){
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); });
		return uuid;
	}

	// Based on the size of the device ensure that everything is proportional
	// This uses jQuery
	$scope.resize_stuff = function(){
		curHeight = window.innerHeight;
		curHeight = curHeight-120;
		curHeight = curHeight*.8;
		curWidth = window.outerWidth; //innerWidth doesn't change from its inital value on Chrome for android HTC EVO 4g lte
		console.log(curWidth + ' - ' + curHeight)
		console.log("Window Width: " + curWidth + " Window Height: " + curHeight);
		buttonpixheight = curHeight/8;
		buttonfontsize = buttonpixheight/3;
		if (curWidth < 640) { small_divider = 4 } else { small_divider = 3 };
		smallbuttonfont = buttonpixheight/small_divider;
		console.log("Button Height: " + buttonpixheight)
		$(".match-button").css("height", buttonpixheight+"px");
		$("input").css("height", buttonpixheight+"px");
		$("input").css("width", "30%");
		$(".match-button").css("font-size", buttonfontsize+"px");
		$("input").css("font-size", buttonfontsize+"px");
		$(".stall1, .stall2").css("font-size", smallbuttonfont+"px");
		$("#minus-period, #period, #add-period, .settings-icon").css("font-size", buttonfontsize+"px");
		$("#undo, #period_label").css("font-size", buttonfontsize/2+"px");
		$("#time").css("font-size", buttonfontsize+"px");
	} // End Resize Stuff

	// Trigger resize stuff
	$scope.resize_stuff();
	// disable buttons for start of match
	manage_ui_neutral();

	window.addEventListener("resize", function() {
		$scope.resize_stuff();
	}, false);
	});

function manage_ui(ptcode, color){
	// Disable buttons under certain circumstances

	// ========= Take Down ===========
		if (ptcode == "T-green"){
			//self
			$("button[name~='E-green']").attr("disabled", true); 
			$("button[name~='R-green']").attr("disabled", true); 
			$("button[name~='T-green']").attr("disabled", true); 
			$("button[name~='N-green']").attr("disabled", false);
			//opponent
			$("button[name~='T-red']").attr("disabled", true);
			$("button[name~='N-red']").attr("disabled", true);
			$("button[name~='R-red']").attr("disabled", false);
			$("button[name~='E-red']").attr("disabled", false);
		}
		if (ptcode == "T-red"){
			//self
			$("button[name~='E-red']").attr("disabled", true); 
			$("button[name~='R-red']").attr("disabled", true); 
			$("button[name~='T-red']").attr("disabled", true); 
			$("button[name~='N-red']").attr("disabled", false);
			//opponent
			$("button[name~='T-green']").attr("disabled", true);
			$("button[name~='N-green']").attr("disabled", true);
			$("button[name~='R-green']").attr("disabled", false);
			$("button[name~='E-green']").attr("disabled", false);
		}

		// =========== Reversal ================
		if (ptcode == "R-red"){ 
			manage_ui("T-red", "red");
		} else if (ptcode == "R-green"){
			manage_ui("T-green", "green");
		}
		// =========== Escape =================
		if (ptcode == "E-red" || ptcode == "E-green"){
			 $("button").attr("disabled", false);
			 manage_ui_neutral();
		 }

}
function manage_ui_neutral(){
		// ========= Neutral ============
	$("button[name~='R-red']").attr("disabled", true);
	$("button[name~='R-green']").attr("disabled", true);
	$("button[name~='N-red']").attr("disabled", true);
	$("button[name~='N-green']").attr("disabled", true);
	$("button[name~='E-red']").attr("disabled", true);
	$("button[name~='E-green']").attr("disabled", true);
	$("button[name~='T-green']").attr("disabled", false);
	$("button[name~='T-red']").attr("disabled", false);
}
})

.controller('loginCtrl', function($ionicPlatform, $scope, $http, $state, Login, $rootScope) {
  $ionicPlatform.ready(function() {
	// Put Login stuff here
		// Globals
		var base_url = 'http://www.matsidestats.com/';
		/* 
		 * Module - Login Module
		 */

		// initial settings
		$scope.login_text = "Login";
		isOnline = 0;
		
		// Login with API Key
		$scope.login_with_api = function(apikey,isOnline){
			Login.apilogin(apikey, isOnline).then(function(data){
				console.log(data);
				$state.go('roster.teamview');
			});
		}
				
		// Take login info and validate it
		$scope.login = function() {
			$scope.login_text = "Logging In...";
			$scope.top_header = "Login View";
			
			console.log($scope.username + " - " + $scope.password);
			$http({ method: 'POST',
				url: 'http://www.matsidestats.com/loginapi/', 
				data: 'username='+ $scope.username + '&password='+ $scope.password,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).
				success(function(data, status, headers, config){
					console.log(data);
					if (data){
						console.log("Successful Connection");
						window.localStorage['apikey'] = data;
						$scope.login_text = "Login Complete";
						// Incorrect Login
						if (data == 'nousername'){
							$scope.login_text = "Incorrect Login";
							return
						}

						$state.go('roster.teamview');
					}

				}).
				error(function(data, status, headers, config){
					console.log("Unsuccessful Login");
				});
		}

		// Maybe we're already logged in?
		if (window.localStorage['apikey']){
			apikey = window.localStorage['apikey'];
			$scope.login_with_api(apikey);

		} 
	});
})

.controller('rosterCtrl', function($ionicPlatform, $scope, $state, WrestlersDb, Roster, $ionicPlatform, $cordovaNetwork, $ionicModal, $rootScope, $ionicPopup) {
  $ionicPlatform.ready(function() {


		// input var for adding a new wrestler
		$scope.addwrestler = {name: ''};


		// Refresh page
			try{
				//$scope.isOnline = ngCordova.getNetwork();
				if ($scope.isOnline != 'none'){$scope.isOnline = true} else {$scope.isOnline = false}
				console.log("ONLINE: " + $scope.connectiontype);
			} catch (e) {
				$scope.isOnline = true;
				console.log("DEVICE: Computer");
			}
		var force = true;
		var isOnline = $scope.isOnline;

		$scope.view_matches = function(wrestler_id){
			$state.go('roster.view_matches', {wrestler_id: wrestler_id}, {reload: true});
		};

		$scope.getWrestlers = function(){
			console.log("Get Wrestlers");
			WrestlersDb.getWrestlers().then(function(data){
				console.log(data);
				$scope.wrestlers = data[0];
				console.log("MC: " + data[1]);
				$scope.matches_complete = data[1];
				console.log($scope.matches_complete);
			});
		}

		// Initial request to fill page
		$scope.getWrestlers();

		$scope.addWrestler = function() {
			WrestlersDb.addWrestler($scope.addwrestler.name).then(function(wrestlerArr){
				rows = wrestlerArr[0];
				thisWrestler = wrestlerArr[1];
				wrestlers = [];
				for (i=0; i<rows.length; i++){
					// form a json blob to display wrestlers
					row = rows.item(i);
					if (row['current_meet'] != null && row['current_meet'].length > 0){match_button_state='start_match';}else{match_button_state='no tourney';}
					wrestlers.push({
						id: row['id'],
						name: row['name'],
						weight: row['weight'],
						year: row['year'],
						teamlevel: row['teamlevel'],
						active: row['active'],
						current_meet: row['current_meet'],
						current_opponent: row['current_opponenet'],
						match_button: match_button_state
					}); 
				}
				$scope.wrestlers = wrestlers;
				$state.go('roster.wrestler-details', {'wrestler_id': thisWrestler['id']});

			});
		}


		$scope.opponent = {name: ''};
		$scope.addOpponent = function(wid){
		var myPopup = $ionicPopup.show({
					template: '<input type="text" ng-model="opponent.name" />',
					title: 'Enter Next Opponent',
					subTitle: 'Enter the current or next opponent',
					scope: $scope,
					buttons: [
					{ text: 'Cancel' },
					{
					text: '<b>Save</b>',
					type: 'button-positive',
						onTap: function(e) {
						if (!$scope.opponent.name) {
						//don't allow the user to close unless he enters wifi password
						e.preventDefault();
						} else {
						return $scope.opponent.name;
						}
						}
					}
				]
			});
			myPopup.then(function(oppo_name) {
				WrestlersDb.setOpponent(oppo_name, wid);
				console.log("Next Opponsent: " + wid + " " + oppo_name);
			});
		}
	})
})

.controller('managemeetsCtrl', function($ionicPlatform, $scope, $state, $stateParams, Meets) {
  $ionicPlatform.ready(function() {
		// Get Team info
		var team = JSON.parse(window.localStorage['team']);
		team = team[0];

		// Add a meet 
		$scope.addMeet = function(){
			//$(".list").attr('visibility', 'hidden');
			Meets.addMeet($scope.meet.name, $scope.meet.address).then(function(data){
				meets = [];
				for (i=0; i<data.length; i++){
					meets.push(data.item(i));
				}
				data = data.item;
				$scope.meets = meets;
			});
		} 

		// Edit a meet 
		$scope.editMeet = function(){
			//$(".list").attr('visibility', 'hidden');
			id = $scope.meets[$scope.meet_id].id;
			meet_name = $scope.meets[$scope.meet_id].name;
			address = $scope.meets[$scope.meet_id].address;
			meet_date = $scope.meets[$scope.meet_id].meet_date;
			Meets.editMeet(id, meet_name, address, meet_date).then(function(data){
				$scope.meets = data;
				$state.go('roster.meets');
			});
		} 

		var api_key = window.localStorage['apikey'];
		Meets.getMeets(team.id).then(function(data){
			$scope.meets = data;
		});

		$scope.meet = {
			name: '',
			address: ''
		}
	});
})

.controller('editMeetCtrl', function($ionicPlatform, $scope, $state, $stateParams, MeetsDb, $ionicPopup) {
  $ionicPlatform.ready(function() {
		// Get Team info
		var team = JSON.parse(window.localStorage['team']);
		team = team[0];
		// Grab the list of available meets from Meets factory

		// if the id exists show the meet edit page
		$scope.meet_id = $stateParams.meet_id;	
		$scope.id = $stateParams.id;
		MeetsDb.getMeet($stateParams.id).then(function(data){
			$scope.meet = data;
		}); 

		$scope.saveMeet = function(){
			MeetsDb.saveMeet($scope.id, $scope.meet.name, $scope.meet.address, $scope.meet.meet_date).then(function(data){
				if (data == 'success'){
					$state.go('roster.meets');
				}
			});
		}
		 $scope.showConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: 'Delete Meet',
				template: 'Are you sure you want to delete this meet?'
			});
			confirmPopup.then(function(res) {
				if(res) {
					MeetsDb.deleteMeet($scope.id).then(function(data){
						if (data == 'success'){
							$state.go('roster.meets', {}, {reload:true});
						}
					});
				} else {
					 console.log('You are not sure');
				}
			});
		};
	});
})

.controller('viewmatchesCtrl', function($ionicPlatform, $scope, $stateParams, $cordovaNetwork, MatchesDb, ViewMatches){
  $ionicPlatform.ready(function() {
		var id = $stateParams.wrestler_id;
		var wrestler_name = $stateParams.wrestler_name;
		$scope.wrestler_name = wrestler_name;
		$scope.wrestlerid = id;

		MatchesDb.viewMatches(id).then(function(data){
			$scope.matches = data;
		});
	});
})

.controller('viewmatchCtrl', function($ionicPlatform, $scope, ViewMatch, $state, $stateParams){
  $ionicPlatform.ready(function() {
		var id = $stateParams.match_id;
		var base_url = 'http://api.matsidestats.com/';
		var api_key = window.localStorage['apikey'];

		$('.navback').css("visibility", "hidden");

		ViewMatch.getViewMatch(id).then(function(data){;
			data = data[0];
			console.log(data);
			$scope.green_tot = data['green_tot']
			$scope.red_tot = data['red_tot']
			$scope.points = data['match_info'];
			$scope.match = data['match']
			$scope.match_extras = JSON.parse(data['match']['match_extras']);
			console.log($scope.match);
		});

		$scope.gotoTeamview = function(){
			$('.navback').css("visibility", "visible");
			$state.go('roster.teamview');
		}
	});
})

.controller('wrestlerDetailsCtrl', function($ionicPlatform, $scope, MeetsDb, WrestlersDb, $stateParams){
  $ionicPlatform.ready(function() {
		var id = $stateParams.wrestler_id;
		var api_key = window.localStorage['apikey'];
		$scope.tourney = {};

		// Save Wrestler Info
		$scope.save_button = "Save Wrestler Info";

		WrestlersDb.getWrestler(id).then(function(wrestler){ 
			$scope.wrestler = wrestler[0]
		}); 

		MeetsDb.getAllMeets(id).then(function(meets){ 
			$scope.meets = meets;
			$scope.tourney.id = $scope.meets[0];
			for (i=0; i<meets.length; i++){
				if ($scope.wrestler.current_meet == meets[i].name){
					$scope.tourney.id = $scope.meets[i];
					break;
				}
			}
		}); 

		$scope.changeValue = function(){
			console.log("Changed Val: " + $scope.tourney);
			console.log($scope.tourney.id.name);
		}

		$scope.saveWrestler = function(){
			console.log($scope.tourney.id);
			var tourneyname = '';
			if ($scope.tourney.id === undefined){
				tourneyname = "No Tourney";
			}else {
				tourneyname = $scope.tourney.id.name;
			}
			WrestlersDb.saveWrestler($scope.wrestler.name, $scope.wrestler.year, $scope.wrestler.teamlevel, $scope.wrestler.weight, $scope.wrestler.email, tourneyname, $scope.wrestler.id).then(function(data){
				console.log(data);
				$scope.save_button = "Saved!";	
			});
		}
	});
})

.controller('AccountCtrl', function($ionicPlatform, $scope, TeamDb) {

	$scope.team_save_btn = "Save Team Info";
	$scope.getTeam = function(){
		TeamDb.getTeam().then(function(team){
			$scope.team = team;
		});
	}
	$scope.updateTeam = function(){
		console.log("New Team");
		console.log($scope.team);
		TeamDb.updateTeam($scope.team).then(function(team){
			console.log("Team Info");
			console.log(team);
			$scope.team = team;
		});
	}
	$scope.getTeam();

});

