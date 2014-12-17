// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
// 'starter.directives' is found in js/directive.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.directives'])

.run(function($ionicPlatform, $rootScope, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

		// Open the database
		//var db = window.sqlitePlugin.openDatabase({name: 'matsidestats.db'});
		// Create a unlimited database for offline everything
	//	var db = window.sqlitePlugin.openDatabase("matsidestats", "", "Matside Stats Local DB", 1024*1024*512);
		var db = window.openDatabase("matsidestatsv1", "1.0", "Matside Stats Local DB", -1);

		function createTables(db){
			db.transaction(function(tx) {
				/*
				tx.executeSql('drop table teams');
				tx.executeSql('drop table matches');
				tx.executeSql('drop table meets');
				tx.executeSql('drop table wrestlers');
				tx.executeSql('drop table matchscore');
				*/
				tx.executeSql('CREATE TABLE IF NOT EXISTS `teams` (id integer not null primary key autoincrement, coach text, name text, username text, address text, city text, state text, api_key text)'); 
				tx.executeSql('CREATE TABLE IF NOT EXISTS wrestlers (id integer not null primary key autoincrement, teams_id integer, name text, weight integer, year integer, teamlevel text, active integer, email text, current_meet text, current_opponent integer, created_at text, updated_at text)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS matches (id integer not null primary key autoincrement, match_style text, match_extras text, match_weight integer, wrestler1 integer, wrestler1_name text, wrestler2 integer, wrestler2_name text, meet integer, wrestler1_choice text, wrestler2_choice text, match_complete integer, created_at text)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS matchscore (id integer not null primary key autoincrement, matches_id integer, wrestler integer, color text, point_code text, points integer, period integer, created_at text, updated_at text)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS meets (id integer not null primary key autoincrement, teams_id integer, name text, address text, city text, state text, meet_date text)');
				console.log("Databases Updated");

			},onError, onReadyTransaction)
		}
		function onError(err){
			$rootScope.db_state = err;
			console.log(err);
		}
		function onReadyTransaction( ){
			$rootScope.db_state = 'Initialized!';
			console.log( 'Transaction Completed' );
		}
		createTables(db);
		$rootScope.db = db;
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('team', {
      url: '/team',
			abstract: true,
			templateUrl: 'templates/team-initial.html',
    })
    .state('team.signup', {
			url: '/signup?teamname&email',
      views: {
        'team-view': {
          templateUrl: 'templates/team-signup.html',
					controller: 'initialCtrl'
        }
      }
    })

    .state('roster', {
      url: '/roster',
			abstract: true,
			templateUrl: 'templates/roster-root.html',
    })

    .state('roster.trackmatch', {
			url: '/track/:wid',
      views: {
        'roster-teamview': {
          templateUrl: 'templates/track.html',
					controller: 'trackCtrl'
        }
      }
    })
    .state('roster.teamview', {
      url: '/teamview',
      views: {
        'roster-teamview': {
          templateUrl: 'templates/roster-teamview.html',
          controller: 'rosterCtrl'
        }
      }
    })
		.state('roster.view_matches', {
			url: '/view_matches/:wrestler_id/:wrestler_name',
      views: {
        'roster-teamview': {
          templateUrl: 'templates/roster-view_matches.html',
          controller: 'viewmatchesCtrl'
        }
      }
    })

    .state('roster.view_match', {
			url: '/view_match/:match_id/:wrestler_name',
      views: {
        'roster-teamview': {
          templateUrl: 'templates/roster-view_match.html',
          controller: 'viewmatchCtrl'
        }
      }
    })
    .state('roster.wrestler-details', {
			url: '/wrestler-details/:wrestler_id',
      views: {
        'roster-teamview': {
          templateUrl: 'templates/roster_wrestler-details.html',
					controller: 'wrestlerDetailsCtrl'
        }
      }
    })
		.state('roster.meets', {
			url: '/meets',
      views: {
        'roster-meets': {
          templateUrl: 'templates/roster-meets.html',
          controller: 'managemeetsCtrl'
        }
      }
    })
		.state('roster.meets_edit', {
			url: '/meets_edit/:meet_id/:id',
      views: {
        'roster-meets': {
          templateUrl: 'templates/roster-meets-edit.html',
          controller: 'editMeetCtrl'
        }
      }
    })
    .state('roster.account', {
      url: '/account',
      views: {
        'roster-account': {
          templateUrl: 'templates/roster-account.html',
          controller: 'AccountCtrl'
        }
      }
    })
    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.login', {
      url: '/login',
      views: {
        'tab-login': {
          templateUrl: 'templates/tab-login.html',
          controller: 'loginCtrl'
        }
      }
    })

    .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/team/signup');

});

