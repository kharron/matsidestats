from django.shortcuts import render, redirect
import datetime
import json
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from trackmatch.models import Teams, Wrestlers, Matches, MatchScore, Meets, Opponents

def backbone(request):
	return render(request, 'trackmatch/bb-test.html')

def index(request, wrestler_id=None):
	if wrestler_id:
		user = request.user.username
		return render(request, 'trackmatch/trackmatch.html', context)
	context = ''
	return render(request, 'trackmatch/index.html', context)

def delete_match(request, wrestler_id=None, match_id=None):
	if match_id:
		try:
			Matches.objects.filter(id=match_id).delete()
		except:
			pass
	return HttpResponseRedirect('/view_matches/%s/' % wrestler_id)

def view_matches(request, wrestler_id=None):
	if wrestler_id:
		matches = Matches.objects.filter(wrestler_id=wrestler_id).order_by('-created_at')
		wrestler = Wrestlers.objects.get(pk=wrestler_id)
		wrestler_name = wrestler.name
		wrestler = {}
		match = {}
		i=0
		for m in matches:
				match[i] = {}
				match[i]['id'] = m.id
				match[i]['matchstyle'] = m.matchstyle
				match[i]['matchweight'] = m.matchweight
				match[i]['meet'] = m.meet.name
				match[i]['wrestler_choice'] = m.wrestler_choice
				match[i]['opponent_choice'] = m.opponent_choice
				match[i]['ourwrestler_name'] = m.ourwrestler_name
				mDate = m.created_at.strftime("%m-%d-%Y")
				match[i]['match_date'] = mDate
				
				if m.theirwrestler_name == '':
						opp_name = "Name not known"
				else:
						opp_name = m.theirwrestler_name
				match[i]['theirwrestler_name'] = opp_name
				if m.theirschool_name == '':
						m.theirschool_name = "Unknown School"
				match[i]['theirschool_name'] = m.theirschool_name
				cdate = m.created_at.strftime("%Y-%m-%d")
				match[i]['meetdate'] = cdate
				i=i+1
		for w in wrestler:
				wrestler['name'] = w.name
				wrestler['weight'] = w.weight
				wrestler['teamlevel'] = w.teamlevel
				wrestler['year'] = w.year
				wrestler['active'] = w.active
		return HttpResponse(json.dumps(match))
	return HttpResponse('nowrestler')

def view_match(request, match_id=None):
	if match_id:
		ms = MatchScore.objects.filter(match_id=match_id).order_by('created_at')
		match_dict = {}
		counter = 0
		periods = []
		green = 0
		red = 0
		points = []
		period_span = {}
		for m in ms:
			match_dict[counter] = {}
			match_dict[counter]['point_code'] = m.point_code
			match_dict[counter]['wrestler_color'] = m.wrestler_color
			try:
					point = str(m.points)
			except:
					point = 0
			if m.wrestler_color == 'green':
					match_dict[counter]['green_points'] = str(m.point_code) + point
					match_dict[counter]['red_points'] = ''
					green+=int(m.points)
			else:
					red+=int(m.points)
					match_dict[counter]['red_points'] = str(m.point_code) + point
					match_dict[counter]['green_points'] = ''
			match_dict[counter]['points'] = m.points
			match_dict[counter]['period'] = m.period
			match_dict[counter]['created_at'] = m.created_at.strftime('%Y-%m-%d %H:%M:%S') 

			if not m.period in periods:
				periods.append(m.period)
			points.append(match_dict[counter])
			counter += 1
		periods.sort()
		viewmatch = {}
		viewmatch['match_info'] = match_dict
		viewmatch['green_tot'] = green
		viewmatch['red_tot'] = red
		return HttpResponse(json.dumps(viewmatch))
			
		scores = len(match_dict)
		period_list = []
		wrestlers = ['red','green']
		for i in range(0, scores):
			period_list.append(i)
		context = {'match_dict': match_dict, 'points': points, 'number_of_scores': len(points), 'period_list': periods, 'green_tot': green, 'red_tot': red, 'wrestlers': wrestlers}
		return render(request, 'trackmatch/viewmatch.html', context)

def resume_match(request, wrestler_id=None, match_id=None):
		if match_id:
				wrestler_info = Wrestlers.objects.get(id=wrestler_id)
				try:
					o = Opponents.objects.get(id=wrestler_info.current_opponent.id)
					opponent = o.name
				except:
					opponent = 'None'
				context = {'match_id':match_id, 'wrestler_id':wrestler_id, 'wrestler':wrestler_info, 'opponent': opponent}
				return render(request, 'trackmatch/trackmatch.html', context)
		return HttpResponseRedirect('/teamview/')

def start_match(request, wrestler_id=None):
	#TODO stop duplicate matches
	if wrestler_id:
		wrestler_info = Wrestlers.objects.get(id=wrestler_id)
		match_id = create_match(request, wrestler_info)
		try:
			o = Opponents.objects.get(id=wrestler_info.current_opponent.id)
			opponent = o.name
		except:
			opponent = 'None'
		context = {'match_id':match_id, 'wrestler_id':wrestler_id, 'wrestler':wrestler_info, 'opponent': opponent}
		return render(request, 'trackmatch/trackmatch.html', context)

def create_match(request, w):
	#See if the wrestler currently has a match going if so use that one.
	try:
			active_match = Matches.objects.filter(wrestler=w).last()
			return active_match[0].id
	except:
			pass
	#creating a match
	t = Teams.objects.get(id=w.team_id)
	try:
		o = Opponents.objects.get(id=w.current_opponent.id)
	except:
		o = ''
	weight = w.weight
	ourwrestlers_name = ''
	theirwrestlers_name = ''
	current_meet = w.current_meet
	if w.name:
		ourwrestlers_name = w.name
	if o:
		theirwrestlers_name = o.name
	m = Matches.objects.create(matchstyle="folk style", matchtype="championship", matchweight=weight, wrestler_id=w.id, \
			ourwrestler_name=ourwrestlers_name, theirwrestler_name=theirwrestlers_name, opponent=o, meet=current_meet, match_complete=0)
	m.save()
	return m.id

@csrf_exempt
def endmatch(request):
		if request.method == "POST":
				match_id = request.POST['match_id']
				m = Matches.objects.get(pk=match_id)
				m.match_complete = 1
				m.save()
				return HttpResponse('success')
		return HttpResponse('failed')
				
@csrf_exempt #So the form doesnt need to have a csrf token
def addpoints(request, match_id=None):
	if match_id:
		color = request.POST['color']
		points = request.POST['points']
		pointcode = request.POST['pointcode']
		period = request.POST['period']
		#match = Matches.objects.get(id=int(match_id))
		m = MatchScore.objects.create(match_id=match_id, period=period, wrestler_color=color, point_code=pointcode, points=points)
		m.save()
		return HttpResponse('true')
	return HttpResponse('False')

@csrf_exempt
def get_wrestler_info(request, wrestler_id=None, api_key=None):
		team = get_team(api_key) 
		if team:
				w = Wrestlers.objects.get(id=wrestler_id)
				Meetss = Meets.objects.filter(team=team)
				Opponentss = Opponents.objects.filter(team=team).filter(weight=w.weight)
				name, weight, teamlevel = w.name, w.weight, w.teamlevel

				# Get list of meets
				meetList = {}
				for meet in Meetss:
						meetList[meet.id] = {}
						meetList[meet.id]['name'] = meet.name
						try:
								meet_date = meet.meet_date.strftime('%m-%d-%Y')
						except:
								meet_date = ''
						meetList[meet.id]['meet_date'] = meet_date
				# Get list of opponents at weight
				oppList = {}
				for opp in Opponentss:
						oppList[opp.id] = {}
						oppList[opp.id]['name'] = opp.name

				wrestler_info = {}
				wrestler_info['name'] = name
				wrestler_info['weight'] = weight
				wrestler_info['teamlevel'] = teamlevel
				wrestler_info['year'] = w.year
				wrestler_info['current_meet'] = w.current_meet.name
				wrestler_info['current_meet_id'] = w.current_meet.id
				wrestler_info['opponent'] = w.current_opponent.name
				wrestler_info['opponent_id'] = w.current_opponent.id

				# Put it all together
				all_info = {}
				all_info['wrestler_info'] = wrestler_info
				all_info['opponents'] = oppList
				all_info['meets'] = meetList
				return HttpResponse(json.dumps(all_info))
		return HttpResponse('No Id')

def editwrestler(request, wrestler_id=None):
	if wrestler_id:
		w = Wrestlers.objects.get(id=wrestler_id)
		name, weight, teamlevel = w.name, w.weight, w.teamlevel
		current_meet = Meets.objects.filter(team=w.team)
		current_meet_wr = ''
		if w.current_meet:
			current_meet_wr = w.current_meet.name
		context = {'wrestler_id': wrestler_id, 'wrestler_name': name, 'weight': weight, 'teamlevel': teamlevel, 'current_meet_wr': current_meet_wr, 'current_meet': current_meet}
		return render(request, 'trackmatch/editwrestler.html', context)
	return HttpResponse('No Id')

@csrf_exempt
def save_wrestler_info(request):
	if request.method == "POST":
		wname = request.POST['wrestler_name']
		teamlevel = request.POST['teamlevel']
		weightclass = request.POST['weightclass']
		current_meet = request.POST['current_meet']
		wid = int(request.POST['wrestler_id'])
		w = Wrestlers.objects.get(id=wid)
		if teamlevel in ['Graduated', 'Injured', 'Quit']:
				# Set wrestler to inactive if in the list
				w.active = 0
		w.name = wname
		w.teamlevel = teamlevel
		w.weight = weightclass
		if current_meet:
			curr_meet = Meets.objects.get(name=current_meet)
			w.current_meet = curr_meet
		w.save()
		return HttpResponseRedirect('/teamview/')

def get_team(api_key):
		try:
				t = Teams.objects.get(api_key=api_key)
				return t
		except:
				return 0

@csrf_exempt
def roster(request, api_key=None):
		if api_key:
				team = get_team(api_key)
		else:
				return HttpResponse('noapi')
		if team:
				#We've found a team under this username show first view
				wrestlers = Wrestlers.objects.filter(team=team).exclude(active=0).order_by('weight')
				data = serializers.serialize('json', wrestlers, fields=('name', 'weight'))
				w_dict = {}
				i = 0
				na_wrestlers = Wrestlers.objects.filter(team=team).filter(active=0).order_by('weight')
				for w in wrestlers:
						# Get the wrestlers current meeting id
						w_dict[i] = {}
						w_dict[i]['id'] = w.id
						w_dict[i]['name'] = w.name
						w_dict[i]['weight'] = w.weight
						w_dict[i]['teamlevel'] = w.teamlevel
						w_dict[i]['active'] = w.active
						w_dict[i]['year'] = w.year

						''' The following try catches will be converted to return only one var which determines the button 
							necessary per wrestler to continue to a match '''
						# Get the current meet/tourney info
						meet_id = w.current_meet_id
						try:
							meet = Meets.objects.get(pk=meet_id)
							w_dict[i]['current_meet_id'] = meet.name
						except:
							w_dict[i]['current_meet_id'] = "No tournament set"
							w_dict[i]['match_button'] = "no_tourney"

						# Get current opponent information
						try:
								opponent_id = w.current_opponent
								opponent = Opponents.objects.get(pk=opponent_id)
								if str(last_match) == str(opponent_id) and w_dict[i]['current_meet_id'] != "No tournament set":
										w_dict[i]['start_match'] = False
								else:
										w_dict[i]['start_match'] = True
										w_dict[i]['match_button'] = 'start_match'
								w_dict[i]['current_opponent_id'] = opponent.name
						except:
								w_dict[i]['start_match'] = False
								w_dict[i]['current_opponent_id'] = 'No current opponent' 
								w_dict[i]['match_button'] = 'add_opponent'
						# Check for last match not ended
						try:
								active_match = Matches.objects.filter(wrestler_id=w.id).filter(match_complete=0)
								match_id = active_match[0].id 
								w_dict[i]['resume_match'] = match_id
								w_dict[i]['match_button'] = 'resume_match'
						except:
								#THis means no match is going on for this wrestler
								w_dict[i]['resume_match'] = False
						i = i+1
				na_dict = {}
				i = 0
				for nw in na_wrestlers:
						na_dict[i] = {}
						na = na_dict[i]
						na['id'] = nw.id
						na['name'] = nw.name
						na['teamlevel'] = nw.teamlevel
						i = i+1
				wrestler_info = {}
				wrestler_info['wrestlers'] = w_dict
				wrestler_info['na_wrestlers'] = na_dict
				data = json.dumps(wrestler_info)
				return HttpResponse(data)
		return HttpResponse('None')
		
@csrf_exempt
def teamview(request):
	user = request.user.username
	try:
			team = Teams.objects.get(username=user)
	except:
			team = 0
	if team:
		#We've found a team under this username show first view
		wrestlers = Wrestlers.objects.filter(team=team).exclude(active=0).values().order_by('weight')
		na_wrestlers = Wrestlers.objects.filter(team=team).filter(active=0).order_by('weight')
		for item in wrestlers:
			wid = int(item['id'])
			try:
				last_match = Matches.objects.filter(wrestler_id=wid).order_by('-created_at')[0]
				last_match = last_match.opponent_id
			except:
				last_match = 'None'
			item['last_match'] = last_match
			meet_id = item['current_meet_id']
			opponent_id = item['current_opponent_id']
			try:
					active_match = Matches.objects.filter(wrestler_id=item['id']).filter(match_complete=0)
					match_id = active_match[0].id 
					item['resume_match'] = match_id
			except:
					#THis means no match is going on for this wrestler
					item['resume_match'] = False
			try:
				meet = Meets.objects.get(pk=meet_id)
				item['current_meet_id'] = meet.name
			except:
				item['current_meet_id'] = "No tournament set"
			try:
				opponent = Opponents.objects.get(pk=opponent_id)
				if str(last_match) == str(opponent_id) and item['current_meedit_id'] != "No tournament set":
					item['start_match'] = False
				else:
					item['start_match'] = True
				item['current_opponent_id'] = opponent.name
			except:
				item['start_match'] = False
				item['current_opponent_id'] = 'No current opponent' 
		context = {'teamname':team.name, 'wrestlers':wrestlers, 'na_wrestlers': na_wrestlers}
		return render(request, 'trackmatch/teamview.html', context)
	else:
		#allow user to create a team under their username
		states = get_states()
		context = {'states': states}
		return render(request, 'trackmatch/enterteam.html', context)

def teamadd(request):
	if request.method == "POST":
		team = request.POST['teamname']
		city = request.POST['city']
		state = request.POST['state']
		user = request.user.username
		#check for availability
		newteam = Teams.objects.filter(name=team)
		if len(newteam) < 1:
			t = Teams.objects.create(name=team, username=user, city=city, state=state)
			t.save()
			return render(request, 'trackmatch/teamview.html')
		else:
			#Team is already there
			context = {'message':'Team name exists in that city already'}
			return render(request, 'trackmatch/enterteam.html', context)

def addwrestler(request):
	if request.method == "POST":
		user = request.user.username
		team = Teams.objects.get(username=user)
		wname = request.POST['wrestler']
		w = Wrestlers.objects.create(name=wname, team_id=team.id)
		w.save()
		return redirect('http://www.matsidestats.com/teamview/')
	return redirect('http://www.matsidestats.com/teamview/')

def get_meets(team):
		#We've found a team under this username show first view
		meets = Meets.objects.filter(team=team)
		m_dict = {}
		i = 0
		for meet in meets:
				m_dict[i] = {}
				m_dict[i]['id'] = meet.id
				m_dict[i]['name'] = meet.name
				m_dict[i]['address'] = meet.address
				m_dict[i]['city'] = meet.city
				m_dict[i]['state'] = meet.state
				meet_date = ''
				if meet.meet_date:
						meet_date = meet.meet_date.strftime("%Y-%m-%d")
				m_dict[i]['meet_date'] = meet_date
				i = i+1
		return json.dumps(m_dict)

@csrf_exempt
def meetlist(request, api_key=None):
		team = get_team(api_key)
		if team:
				data = get_meets(team)
				return HttpResponse(data)	
		return HttpResponse('failed')

@csrf_exempt
def meetdelete(request, meet_id=None):
	if meet_id:
		try:
			Meets.objects.get(pk=meet_id).delete()
		except:
			pass
	return HttpResponseRedirect('/managemeets') 

def update_meet(request):
		id, meet_name, address, meet_date = request.POST['id'], request.POST['meet_name'], request.POST['address'], request.POST['meet_date']
		m = Meets.objects.get(id=id)
		m.meet_name = meet_name
		m.address = address
		m.meet_date = meet_date
		m.save()
		return True
	

@csrf_exempt
def editmeet(request, api_key=None):
		if request.method == "POST":
				team = get_team(api_key)
				if team:
						update_meet(request)
						data = get_meets(team)
						return HttpResponse(data)
				return HttpResponse('no apikey')
		return HttpResponse('not post')

@csrf_exempt
def addmeet(request, api_key=None):
		if request.method == "POST":
				team = get_team(api_key)
				if team:
						meetname = request.POST['meetname']
						address = request.POST['address']
						m = Meets(team=team, name=meetname, address=address)
						m.save()
						data = get_meets(team)
						return HttpResponse(data)
				return HttpResponse('apierror')
		return render(request, 'test.html', {})
		return HttpResponse('error')

def add_opponent(request, wrestler_id):
	if request.user.username:
		user = request.user.username
		team = Teams.objects.get(username=user)
		teams = Teams.objects.filter(state=team.state)
		opponents = Opponents.objects.all()
		if wrestler_id:
			w = Wrestlers.objects.get(pk=wrestler_id)
			weight = w.weight
			context = {'weight': weight, 'wrestler_id': wrestler_id, 'name': w.name, 'teams': teams, 'opponents': opponents}
			return render(request, 'trackmatch/add_opponent.html', context)
		return HttpResponseRedirect('/teamview/')
	return HttpResonseRedirect('/register/')

def save_opponent(request):
	if request.method == "POST":
		teamname = request.POST['teamname']
		teamlevel = request.POST['teamlevel']
		wrestler_id = request.POST['wrestler_id']
		try:
			t = Teams.objects.get(name=teamname)
		except:
			t = Teams.objects.filter(name=teamname)
			if len(t) > 1:
				t = t[0]
			elif len(t) == 1:
				t = t[0]	
			else:
				t = Teams(name=teamname)
				t.save()
		if not request.POST['wrestler_dropdown'] == "none_selected":
			wrestler = request.POST['wrestler_dropdown']
			o = Opponents.objects.get(pk=wrestler)
		else:
			wrestler = request.POST['wrestler']
			o = Opponents()
			o.name = wrestler
			o.team = t
			o.teamlevel = teamlevel
			o.save()
		w = Wrestlers.objects.get(pk=wrestler_id)
		w.current_opponent = o
		w.save()
		return HttpResponseRedirect('/teamview/')
	return HttpResponseRedirect('/teamview/')

def get_states():
		states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
		return states