from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login

def index(request):
	context = ''
	return render(request, 'register/index.html', context)

def login_team(request):
	if request.method == "POST":
		user_recd = request.POST['email']
		password = request.POST['password']
		action = request.POST['action']
		if action=='login':
			user = authenticate(username=user_recd, password=password)
			if user is not None:
				login(request, user)
				return HttpResponseRedirect("/teamview/")
			else:
				context = {'message':'Email and password do not match'}
				return render(request, 'register/index.html', context)
		if action=='register':
			user = User.objects.create_user(username=user, password=password)
			user.save()
			return HttpResponseRedirect('/usercreated/')
	else:
		return render(request, 'register/index.html', context)

