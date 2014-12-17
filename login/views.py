from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout, login
from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from trackmatch.models import Teams
import uuid, datetime
import json

def index(request):
#Login Users
	if request.method == "POST":
		username, password = request.POST['username'], request.POST['password']	
		user = authenticate(username=username, password=password)
		if user is not None:
			if user.is_active:
				login(request, user)
				return HttpResponseRedirect('/search')
			else:
				#Send to Disabled account
				return HttpResponseRedirect('/login/notactive')
		else:
			#Not recognized
			return HttpResponseRedirect('/login/notrecognized')
	else:
		return render(request, 'login/login.html')

def get_api(user):
		t = Teams.objects.get(username=user)
		if t.api_key:
				return t.api_key
		api_key = str(uuid.uuid1())
		t.api_key = api_key
		t.save()
		return api_key

def check_apikey(apikey):
		try: 
				t = Teams.objects.get(api_key=apikey)
				return True
		except:
				return False

@csrf_exempt
def api_login(request, apikey=None):
		if request.method == "POST":
				username, password = request.POST['username'], request.POST['password']	
				user = authenticate(username=username, password=password)
				if user is not None:
						if user.is_active:
								api_key = get_api(username)
								login(request, user)
								return HttpResponse(api_key)
						else:
								#Send to Disabled account
								return HttpResponse('notactive')
				else:
						#Not recognized
						return HttpResponse('nousername')
		else:
				return HttpResponse('notpost')

@csrf_exempt
def login_api(request, apikey=None):
		if check_apikey(apikey):
				return HttpResponse(apikey)
		if request.method == "POST":
				username, password = request.POST['username'], request.POST['password']	
				user = authenticate(username=username, password=password)
				if user is not None:
						if user.is_active:
								api_key = get_api(username)
								login(request, user)
								return HttpResponse(api_key)
						else:
								#Send to Disabled account
								return HttpResponse('notactive')
				else:
						#Not recognized
						return HttpResponse('nousername')
		else:
				return HttpResponse('notpost')

def logout_user(request):
		logout(request)
		return HttpResponseRedirect('/')

def notrecognized(request):
	context = {'message':'User not recognized try again'}
	return render(request, 'login/login.html', context)

def notactive(request):
	context = {'message':'User not active, please contact your administrator'}
	return render(request, 'login/login.html', context)

def register(request):
	if request.method == "POST":
		return HttpResponseRedirect('/members/')
	return render(request, 'login/register.html')

def angular(request):
		return render(request, 'login/angular_test.html', {})
