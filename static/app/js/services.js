angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})
.factory('Match', function($q, $rootScope){

	return {
		start: function(wid){
						var db = $rootScope.db;
						var deferred = $q.defer();
						var team = JSON.parse(window.localStorage['team']);
						team = team[0];
						var team_id = team['id'];
						db.transaction(function(tx){
							var curr_opponent;
							var curTime = new Date();
							tx.executeSql("select * from matches where wrestler1 = ? and match_complete = 0", [wid], function(tx, res ){
								if (res.rows.length == 0){	
									tx.executeSql("select * from wrestlers where id = ?", [wid], function(tx, res ){
											row = res.rows.item(0);
											wrestler = {id: row['id'], wrestler1: row['name'], wrestler2: row['current_opponent']}
											if (row['current_opponent']){curr_opponent = row['current_opponent'];} else {curr_opponent = 'None';}
											// Get Meet ID
											tx.executeSql('select id from meets where name = ? and teams_id = ?', [row['current_meet'], team_id], function(tx, meetres){
												var meetrow = meetres.rows.item(0);
												var meet_id = meetrow['id'];
												// insert new match info
												tx.executeSql("insert into matches (wrestler1, match_complete, match_weight, wrestler2_name, match_style, meet, created_at) Values(?,?,?,?,?,?,?)", [wid, 0,row['weight'], curr_opponent, 'folk style', meet_id, curTime.currentTime()]);
												tx.executeSql("select * from matches where wrestler1 = ? and match_complete = 0", [wid], function(tx, res ){
												var new_match = res.rows.item(0);
												data = [wrestler, new_match, 'new'];
												deferred.resolve(data);
												}); // End get Match info
											}); // End get Meet ID
										}); // End get Wrestler Info
								} else {
									tx.executeSql("select * from wrestlers where id = ?", [wid], function(tx, res ){
										row = res.rows.item(0);
										if (row['current_opponent']){curr_opponent = row['current_opponent'];} else {curr_opponent = 'None';}
										wrestler = {id: row['id'], wrestler1: row['name'], wrestler2: curr_opponent}
										tx.executeSql("select * from matches where wrestler1 = ? and match_complete = 0", [wid], function(tx, have_meet_res ){
											var old_match = have_meet_res.rows.item(0);
											data = [wrestler, old_match, 'old'];
											deferred.resolve(data);
										});
									});
								}
							});
					});

						return deferred.promise; 
					 },
		addMeta: function(match, meta){
						var db = $rootScope.db;
						var deferred = $q.defer();
						db.transaction(function(tx){
							tx.executeSql("select * from matches where id = ?", [match.id], function(tx, res){ 
								var row = res.rows.item(0);
								var match_extras = row['match_extras'];
								//TODO fix this
								if (match_extras){
									match_extras = JSON.parse(match_extras);
									match_extras.push(meta);
								} else {
									match_extras = [meta];
								}
								match_extras = JSON.stringify(match_extras);
								tx.executeSql("update matches set match_extras = ? where id = ?", [match_extras, match.id]);

								console.log("Match Extras: ");
								console.log(match_extras);
								deferred.resolve('success');
								//tx.executeSql("update matches set 
							});
						})
						return deferred.promise;
		}, 
		renew: function(match){
						var db = $rootScope.db;
						var deferred = $q.defer();
						db.transaction(function(tx){
							tx.executeSql("select * from matchscore where matches_id = ?", [match.id], function(tx, res){
								var green_tot = 0;
								var red_tot = 0;
								var lastPt = 0;
								var period = 1;
								for (i=0; i<res.rows.length; i++){
									row = res.rows.item(i);
									if (row['color'] == 'green'){
										green_point = row['points'];
										green_tot += row['points'];
									} else {
										red_point = row['points'];
										red_tot += row['points'];
									}
									if (row['point_code'] != 's' || row['point_code'] != 'p'){
										lastPt = row['point_code'].toUpperCase()+'-'+row['color'];
									}
									period = row['period'];
								}
								data = [green_tot, red_tot, lastPt, period];
								deferred.resolve(data);
							});
						});
						return deferred.promise;

					 }
	}
})

.factory('MatchScore', function($q, $rootScope){

	return {
		undoPoints: function(match){
								var db = $rootScope.db;
								var deferred = $q.defer();
								db.transaction(function(tx){
									var curTime = new Date();
									var curr_opponent;
									tx.executeSql("select * from matchscore where matches_id = ? and point_code != 's' and point_code != 'p'", [match.id], function(tx, res){
										var index = res.rows.length-1;
										var row = res.rows.item(index);
										negPts = row['points'];
										color = row['color'];
										mId = row['id'];
										tx.executeSql('delete from matchscore where id = ?', [mId]); 

										// update UI based on the current last move
										if (index > 0){
											row = res.rows.item(index-1);
											lastPt = row['point_code'].toUpperCase()+'-'+row['color'];
										} else {
											lastPt = 0;
										}
										var data = [negPts, color, lastPt];
										deferred.resolve(data);
									});
							});
								return deferred.promise
						},
		endMatch: function(point_type, color, match){
							var db = $rootScope.db;
							var deferred = $q.defer();
							db.transaction(function(tx){
								var curTime = new Date();
								var curr_opponent;
								tx.executeSql("update matches set match_complete = 1 where id = ?", [match.id]);
								tx.executeSql("insert into matchscore (matches_id, color, point_code, points,created_at) Values (?,?,?,?,?);", [match.id, color, point_type, 0, curTime.currentTime()] );
								deferred.resolve('success');
							});
							return deferred.promise
						}, 
		addPoints: function(point, match){
							var db = $rootScope.db;
							var deferred = $q.defer();
							db.transaction(function(tx){
								var curTime = new Date();
								var curr_opponent;
								tx.executeSql("insert into matchscore (matches_id, period, color, point_code, points,created_at) Values (?,?,?,?,?,?);", [match.id, point.period, point.color, point.point_type, point.point_amt, curTime.currentTime()] );
								deferred.resolve('success');
							});
							return deferred.promise
						}
	}
})

.factory('Login', function($http, $q){
	// This service manages Login communication
	
	return {
		apilogin: function(apikey, isOnline){
			var deferred = $q.defer();
			if (isOnline){
					return $http.post('http://www.matsidestats.com/loginapi/' + apikey + '/', {}).then(function(data){
						window.localStorage['apikey'] = data.data;
						return data.data;
					});
			} else {
					deferred.resolve(window.localStorage['apikey']);
						return deferred.promise;
				}
			}
		}
})
.factory('Roster', function($http, $q, $rootScope){
	// Grab the latest roster for the cloud
	// use apikey from storage
	var apikey = window.localStorage['apikey'];
	var rosterData = null;
		return {
			getRoster: function(force, isOnline){
				var deferred = $q.defer();
				if (isOnline){
					return $http.get('http://www.matsidestats.com/api/roster/'+apikey).then(function(data){
						rosterData = data.data;
						window.localStorage['roster'] = JSON.stringify(data.data);
						return data.data;
					});
				} else {
					deferred.resolve(window.localStorage['roster']);
					return deferred.promise;
				}
		 },
			addWrestler: function wrestler_add(wrestler_name){
				var db = $rootScope.db;
				var deferred = $q.defer();
					db.transaction(function(tx){
					tx.executeSql("select * from wrestlers", [], function(tx, res ){
						deferred.resolve(res.rows);
					});
				});
				return deferred.promise;
			}
	 } 

			//db.transaction(function(tx){
				//tx.executeSql("Insert into wrestlers 
})

.factory('Meets', function($http, $rootScope, $q){
	// Grab the list of meets from the internet
	// If the internet is unavailable use whats on the device

	var apikey = window.localStorage['apikey'];
	return {
		getMeets: function(team_id){
								var db = $rootScope.db;
								var deferred = $q.defer(); 
								var team = JSON.parse(window.localStorage['team']);
								team = team[0];
								var team_id = team['id'];
									db.transaction(function(tx){
											tx.executeSql('select * from meets where teams_id = ?', [team_id], function(tx, res){
											var meets = [];
											for (i=0; i<res.rows.length; i++){ 
												meets.push(res.rows.item(i));
											}
											deferred.resolve(meets);
										});
									});
									return deferred.promise;
							}, 
		getMeet: function(meet_id){
								var db = $rootScope.db;
								var deferred = $q.defer(); 
									db.transaction(function(tx){
											tx.executeSql('select * from meets where id = ?', [meet_id], function(tx, res){
											deferred.resolve(res.rows.item(0));
										});
									});
									return deferred.promise;
							}, 
		addMeet: function(meet_name, address){
							var data = { meetname: meet_name, address: address };
								var db = $rootScope.db;
								var deferred = $q.defer();
								var team = JSON.parse(window.localStorage['team']);
								team = team[0];
								var team_id = team['id'];
								db.transaction(function(tx){
										tx.executeSql("insert into meets (name, teams_id, address) Values(?, ?, ?)", [data['meetname'], team_id, data['address']]);
										tx.executeSql('select * from meets where teams_id = ?', [team_id], function(tx, res){
										var rows = res.rows;
										deferred.resolve(rows);
									});
								});
								return deferred.promise;
							},
		editMeet: function(id, meet_name, address, date){
			return $http.post('http://www.matsidestats.com/api/editmeet/' + apikey + '/', "id=" + id + "&meet_name=" + meet_name + "&address=" + address + "&meet_date=" + date, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).then(function(data){
				window.localStorage['meets'] = data.data;
				return data.data;
			});
		}
	}
})

.factory('ViewMatches', function($http, $q){
	// Grab the list of meets from the internet
	// If the internet is unavailable use whats on the device

	
	apikey = window.localStorage['apikey'];
	return {
		getViewMatches: function(id){
			var deferred = $q.defer();
			return $http.get('http://www.matsidestats.com/api/view_matches/' + id).then(function(data){
				window.localStorage['matches'] = data.data;
				return data.data;
			});
		}
	}
})

.factory('ViewMatch', function($stateParams, $q, $rootScope){
	// Grab Individual match information
	// If the internet is unavailable use whats on the device

	apikey = window.localStorage['apikey'];
	return {
		getViewMatch: function(match_id){
									var db = $rootScope.db;
									var deferred = $q.defer();
									var green_tot=0;
									var red_tot=0;
									db.transaction(function(tx){
										tx.executeSql("select * from matchscore where matches_id = ?", [match_id], function(tx, res){
											var scores = new Array();
											for (i=0; i<res.rows.length; i++){
												row = res.rows.item(i);
												if (row['color'] == 'green'){
													green_point = row['points'];
													red_point = 0;
													green_tot += row['points'];
												} else {
													red_point = row['points'];
													green_point = 0;
													red_tot += row['points'];
												}
												scores.push({
													period: row['period'],
													point_type: row['point_code'],
													green_points: green_point,
													red_points: red_point
												});
											}
											var data = [{'match_info': scores, 'green_tot': green_tot, 'red_tot': red_tot}];
											
											deferred.resolve(data);
										})
									});
								return deferred.promise;
								}
	}
})

.factory('WrestlerDetails', function($http){
	// Grab Individual match information
	// If the internet is unavailable use whats on the device

	apikey = window.localStorage['apikey'];
	return {
		getDetails: function(id){
			return $http.get('http://www.matsidestats.com/api/wrestler_details/' + id + '/' + apikey + '/').then(function(data){
				window.localStorage['wrestler_details'] = data.data;
				return data.data;
			});
		}
	}
})

.factory('TeamDb', function($rootScope, $q){

	return {
			addTeam: function (data){
				var db = $rootScope.db;
				var deferred = $q.defer();
					db.transaction(function(tx){
					tx.executeSql("INSERT INTO teams (name, username, city, state) Values(?, ?, ?, ?)", [data['name'], data['username'], data['city'], data['state']]);
					tx.executeSql("select * from teams", [], function(tx, res){
					console.log("name: " + data['name']);
						row = res.rows.item(0);
						team = {id: row['id'], name: row['name'], username: row['username'], city: row['city'], state: row['state']};
						deferred.resolve(team);
					});
				});
				return deferred.promise;
			},
		getTeam: function(teamid){
							var db = $rootScope.db;
							var deferred = $q.defer();
								db.transaction(function(tx){
									tx.executeSql("select * from teams", [], function(tx, res){
										row = res.rows.item(0);
										team = {id: row['id'], 
											name: row['name'], 
											coach: row['coach'],
											username: row['username'],
											address: row['address'],
											city: row['city'],
											state: row['state']
										}
										deferred.resolve(team);
									});
								}); 
								return deferred.promise;
						 },
		updateTeam: function(team){
							var db = $rootScope.db;
							var deferred = $q.defer();
								db.transaction(function(tx){
									console.log("Teams: " + team.coach);
									console.log("Team Id: " + team.id);
									tx.executeSql("update teams set coach = ?, name = ?, username = ?, address = ?, city = ?, state = ? where id = ?;", [team.coach, team.name, team.username, team.address, team.city, team.state, team.id], function(tx, res){
										tx.executeSql("select * from teams", [], function(tx, res){
											row = res.rows.item(0);
											newteam = {id: row['id'], 
												name: row['name'], 
												coach: row['coach'],
												username: row['username'],
												address: row['address'],
												city: row['city'],
												state: row['state']
											}
											deferred.resolve(newteam);
										});
									}, errorSql);
								}); 
								return deferred.promise;
								}
		}
	function errorSql(err){ 
		if (err){
			console.log(err);
		}
	}
})
.factory('MatchesDb', function($rootScope, $q){

	return {
			viewMatches: function(id) {
				var db = $rootScope.db;
				var deferred = $q.defer();
				db.transaction(function(tx){
				tx.executeSql("select * from matches where wrestler1 = ?", [id], function(tx, res ){
					matches = [];
					for (i=0; i<res.rows.length; i++){
						row = res.rows.item(i);
						if (row['meet']){
							var meet_name;
							tx.executeSql("select name from meets where id = ?", [row['meet']], function(tx, meetrow){
								meet_name = meetrow.rows.item(0);
								matches.push({
									id: row['id'],
									match_style: row['match_style'],
									match_type: row['match_type'],
									match_weight: row['match_weight'],
									wrestler2_name: row['wrestler2_name'],
									wrestler1_name: row['wrestler1_name'],
									meet: meet_name 
								}); 
							});
						}
					}
				deferred.resolve(matches);
				}); 
			}); 
			return deferred.promise;
			}
	}
})
.factory('WrestlersDb', function($rootScope, $q){

	function checkResume(loop_count,tx){
		if (loop_count < wrestlers.length){
			grabit(loop_count, tx, function(result){
				checkResume(loop_count+1);
			});
		}
	}

	function grabit(j,tx){
			tx.executeSql("select match_complete from matches where wrestler1 = ? and match_complete = 0", [wrestlers[j].id],function(tx, matchrow){
				var action = 'no change'
				if (matchrow.rows.length>0){
					action = 'resume_match';
				}
				return action;
			});
	}

	return {
			getWrestlers: function() {
										var db = $rootScope.db;
										var deferred = $q.defer();
										db.transaction(function(tx){
										team = JSON.parse(window.localStorage['team']);
										team = team[0];
										team_id = team['id'];
										tx.executeSql("select * from wrestlers where teams_id = ?", [team_id], function(tx, res ){
											wrestlers = [];
											for (i=0; i<res.rows.length; i++){
												row = res.rows.item(i);
												match_button_state = "no tourney";
												if (row['current_meet']){
														match_button_state='start_match';
												}else{
														match_button_state='no tourney';
												}
														wrestlers.push({
															id: row['id'],
															name: row['name'],
															weight: row['weight'],
															year: row['year'],
															teamlevel: row['teamlevel'],
															active: row['active'],
															current_meet: row['current_meet'],
															current_opponent: row['current_opponent'],
															match_button: match_button_state
														}); 
											} 
											matches_complete = new Array();
											tx.executeSql("select * from matches where match_complete = 0", [], function(tx, res){ 
												if (res.rows.length>0){ 
													test = {};
													for (i=0; i<res.rows.length; i++){
														row = res.rows.item(i);
														jsonname = row['wrestler1'];
														matches_complete.push({ 
															wrestlerid : jsonname
														});
													}
												}
												data = [wrestlers, matches_complete];
												deferred.resolve(data);
											});
											var j = 0;
										}); 
									}); 
									return deferred.promise;
								},
			addWrestler: function(wrestler_name){
										var db = $rootScope.db;
										var deferred = $q.defer();
										team = JSON.parse(window.localStorage['team']);
										team = team[0];
										team_id = team['id'];
										console.log("TEAM ID: " + team_id);
											db.transaction(function(tx){
												tx.executeSql("insert into wrestlers (teams_id, name) Values(?,?)", [team_id, wrestler_name]);
												tx.executeSql("select * from wrestlers where teams_id = ?", [team_id], function(tx, res ){
													wrestlers = res.rows;
													tx.executeSql("select * from wrestlers where teams_id = ? order by id desc limit 0,1", [team_id], function(tx, res){
														results = [wrestlers, res.rows.item(0)];
														deferred.resolve(results);
													});
											});
										});
										return deferred.promise;
									 },
			getWrestler: function(id) {
										var db = $rootScope.db;
										var deferred = $q.defer();
										db.transaction(function(tx){
										tx.executeSql("select * from wrestlers where id = ?", [id], function(tx, res ){
											wrestlers = [];
											var match_button_state;
											for (i=0; i<res.rows.length; i++){
												row = res.rows.item(i);
												wrestlers.push({
													id: row['id'],
													name: row['name'],
													weight: row['weight'],
													year: row['year'],
													teamlevel: row['teamlevel'],
													active: row['active'],
													email: row['email'],
													current_meet: row['current_meet'],
													current_opponent: row['current_opponent'],
												}); 
											}
										deferred.resolve(wrestlers);
										}); 
									}); 
									return deferred.promise;
								},
		saveWrestler: function(name, year, teamlevel, weight, email, current_meet, id){
										var db = $rootScope.db;
										var deferred = $q.defer();
										db.transaction(function(tx){
											tx.executeSql("UPDATE wrestlers set name = ?, teamlevel=?, weight = ?, year = ?, email = ?, current_meet = ? where id = ?", [name, teamlevel, weight, year, email, current_meet, id]);
											//tx.executeSql("UPDATE wrestlers set name = ?, year = ?, teamlevel = ?, current_meet = ?, email = ? where id = ?", [name, year, teamlevel, current_meet, email, id]);
											deferred.resolve('updated');
												});
										return deferred.promise;
									}, 

	}
})
.factory('MeetsDb', function($rootScope, $q){

	return {
			// return all meets
			getAllMeets: function(id) {
				var db = $rootScope.db;
				var deferred = $q.defer();
				db.transaction(function(tx){
					team = JSON.parse(window.localStorage['team']);
					team = team[0];
					team_id = team['id'];
				tx.executeSql("select * from meets where teams_id = ?", [team_id], function(tx, res ){
					meets = [];
					for (i=0; i<res.rows.length; i++){
						row = res.rows.item(i);
						meets.push({
							id: row['id'],
							name: row['name'],
							address: row['address'],
							meet_date: row['meet_date']
						}); 
					}
				deferred.resolve(meets);
				}); 
			}); 
			return deferred.promise;
		},
			// Return One meet
		getMeet: function(id){
			var db = $rootScope.db;
			var deferred = $q.defer();
			db.transaction(function(tx){
				tx.executeSql("select * from meets where id = ?", [id], function(tx, res){ 
					if (res.rows.length>0){
						row = res.rows.item(0)
						meet = {id: row['id'], name: row['name'], address: row['address'], 
							city: row['city'], state: row['state'], meet_date: row['meet_date']}
						deferred.resolve(meet);
					}else{
						deferred.resolve('nomeet');
					}
				});
			});
			return deferred.promise;
		},
		saveMeet: function(id, name, address, current_meet, meet_date){
			var db = $rootScope.db;
			var deferred = $q.defer();
			db.transaction(function(tx){
				tx.executeSql("update meets set name = ?, address = ?, meet_date = ?, current_meet = ?, where id = ?;", [name, address, current_meet, meet_date, id]);
					deferred.resolve('success');
			});
			return deferred.promise;
		},
		deleteMeet: function(id){
			var db = $rootScope.db;
			var deferred = $q.defer();
			db.transaction(function(tx){
				tx.executeSql("delete from meets where id = ?", [id]);
					deferred.resolve('success');
			});
			return deferred.promise;
		}
	 }
});
