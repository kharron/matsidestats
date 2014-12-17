from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, logout, login

def index(request):
	context = ''
	return render(request, 'register/index-new.html', context)

@csrf_exempt
def username_check(request):
		''' Provide a way to check usernames before submitting form '''
		if request.method == "POST":
				username = request.POST['email']
				try: 
						# user is taken
						user = User.objects.get(username=username)
						return HttpResponse('false')
				except:
						# user is not taken
						return HttpResponse('true')

def login_team(request):
		''' Users can login and register from the same page
			this will decipher which is being done and do the right thing
			being register and login or just login the user '''
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
						return render(request, 'register/index-new.html', context)
				if action=='register':
						try:
								user = User.objects.get(username=user_recd)
								return render(request, 'register/index-new.html', {'message':'Username Taken'})
						except:
								user = User.objects.create_user(username=user_recd, password=password)
								user.save()
								user = authenticate(username=user_recd, password=password)
								login(request, user)
				return HttpResponseRedirect('/usercreated/')
		else:
				return render(request, 'register/index-new.html')

@csrf_exempt
def api_register(request):
		''' Users can login and register from the same page
			this will decipher which is being done and do the right thing
			being register and login or just login the user '''
		if request.method == "POST":
				user_recd = request.POST['email']
				password = request.POST['password']
				teamname = request.POST['teamname']
				action = request.POST['action']
				if action=='login':
					user = authenticate(username=user_recd, password=password)
					if user is not None:
						login(request, user)
						return HttpResponse('true')
					else:
						context = {'message':'Email and password do not match'}
						return HttpResponse('false')
				if action=='register':
						try:
								user = User.objects.get(username=user_recd)
								return HttpResponse('false')
						except:
								user = User.objects.create_user(username=user_recd, password=password)
								user.save()
								user = authenticate(username=user_recd, password=password)
								login(request, user)
								return HttpResponse('true')
		else:
				return HttpResponse('false')

def logout_team(request):
		logout(request)
		return HttpResponseRedirect('/')
