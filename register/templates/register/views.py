from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

def index(request):
	context = ''
	return render(request, 'register/index.html', context)

def login(request):
	if request.method == "POST":
		user = request.POST['email']
		password = request.POST['password']
		if action=='login':
			user = User.authenticate(username=user, password=password)
			if user is not None:
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

