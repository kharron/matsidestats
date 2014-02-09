from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
from models import Teams, Wrestlers, Matches, MatchScore

def index(request, wrestler_id=None):
	if wrestler_id:
		user = request.user.username
		return render(request, 'trackmatch/trackmatch.html', context)
	context = ''
	return render(request, 'trackmatch/index.html', context)

def view_matches(request, wrestler_id=None):
	if wrestler_id:
		matches = Matches.objects.filter(wrestler_id=wrestler_id)	
		context = {'matches': matches}
		return render('trackmatch/view_matches.html', context)
	return HttpResponseRedirect('/')

def start_match(request, wrestler_id=None):
	#TODO stop duplicate matches
	if wrestler_id:
		match_id = create_match(request, wrestler_id)
		wrestler_info  = Wrestlers.objects.get(id=wrestler_id)
		context = {'match_id':match_id, 'wrestler_id':wrestler_id, 'wrestler':wrestler_info}
		return render(request, 'trackmatch/trackmatch.html', context)

def create_match(request, wrestler_id):
	w = Wrestlers.objects.get(id=wrestler_id)
	t = Teams.objects.get(id=w.team_id)
	opponent = Wrestlers.objects.filter(team=t).filter(name='opponent')
	weight = w.weight
	ourwrestlers_name = ''
	theirwrestlers_name = ''
	if w.name:
		ourwrestlers_name = w.name
	#if request.method == "POST":
	#	if request.POST['theirwrestler_name']:
	#		theirwrestlers_name = request.POST['theirwrestler_name']
	m = Matches.objects.create(matchstyle="folk style", matchtype="championship", matchweight=weight, wrestler_id=wrestler_id, \
			ourwrestler_name=ourwrestlers_name, theirwrestler_name=theirwrestlers_name, opponent=opponent[0].id)
	m.save()
	return m.id

@csrf_exempt #So the form doesnt need to have a csrf token
def addpoints(request, match_id=None):
	if match_id and request.method == 'POST':
		color = request.POST['color']
		points = request.POST['points']
		pointcode = request.POST['pointcode']
		match = Matches.objects.get(id=match_id)
		m = MatchScore.objects.create(match_id=match, wrestler_color=color, point_code=pointcode, points=points)
		m.save()
		return HttpResponse('true')
	return HttpResponse('False')

def get_wrestler_info(request, wrestler_id=None):
	if wrestler_id:
		w = Wrestlers.objects.get(id=wrestler_id)
		name, weight, teamlevel = w.name, w.weight, w.teamlevel
		current_meet = ''
		context = {'name': name, 'weight': weight, 'teamlevel': teamlevel, 'current_meet': current_meet}
		return render(request, 'trackmatch/getwrestler.html', context)
	return HttpResponse('No Id')

def save_wrestler_info(request, wrestler_id=None):
	if request.method == "POST":
		teamlevel = request.POST['teamlevel']
		weightclass = request.POST['weightclass']
		current_meet = request.POST['meet']
		wid = wrestler_id
		try: 
			w = Wrestlers.objects.get(pk=wid)
			w.teamlevel = teamlevel
			w.weight = weight
			w.current_meet = current_meet
			w.save()
			return HttpResponse('saved')
		except:
			return HttpResponse('error')

#@login_required
def teamview(request):
	user = request.user.username
	team = Teams.objects.filter(username=user)
	if team:
		#We've found a team under this username show first view
		wrestlers = Wrestlers.objects.filter(team=team)
		context = {'teamname':team[0].name, 'wrestlers':wrestlers}
		return render(request, 'trackmatch/teamview.html', context)
	else:
		#allow user to create a team under their username
		context = ''
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
			w = Wrestlers.objects.create(team=t, name="opponent", weight="all") #create a univeral opponent for this team
			w.save()
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
		return redirect('http://www.matsidestats.com:8000/teamview/')
	return redirect('http://www.matsidestats.com:8000/teamview/')
