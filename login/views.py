from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout, login
from django.http import HttpResponseRedirect

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
