from django.db import models


class Teams(models.Model):
	name = models.CharField(blank=True, max_length=100)
	username = models.CharField(blank=True, max_length=200)
	city = models.CharField(blank=True, max_length=50)
	state = models.CharField(blank=True, max_length=20)
	api_key = models.CharField(blank=True, max_length=64)

class Wrestlers(models.Model):
	team = models.ForeignKey(Teams)
	name = models.CharField(blank=True, max_length=30)
	weight = models.CharField(blank=True, max_length=3)
	year = models.CharField(blank=True, max_length=20)
	teamlevel = models.CharField(blank=True, max_length=20)
	active = models.IntegerField(default=1)
	current_meet = models.ForeignKey('Meets', null=True, blank=True)
	current_opponent = models.ForeignKey('Opponents', null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

class Opponents(models.Model):
	team = models.ForeignKey(Teams)
	name = models.CharField(blank=True, max_length=60)
	weight = models.CharField(blank=True, max_length=20)
	year = models.CharField(blank=True, max_length=10)
	teamlevel = models.CharField(blank=True, max_length=30)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

class Matches(models.Model):
	matchstyle = models.CharField(blank=True, max_length=30) #folk style high school / collegiate
	matchtype = models.CharField(blank=True, max_length=30) #choices are championship/consolation
	matchweight = models.CharField(blank=True, max_length=10)
	wrestler = models.ForeignKey(Wrestlers, default=1)
	meet = models.ForeignKey('Meets')
	opponent = models.ForeignKey('Opponents', blank=True, null=True)
	wrestler_choice = models.CharField(null=True, blank=True, max_length=30)
	opponent_choice = models.CharField(null=True, blank=True, max_length=30)
	ourwrestler_name = models.CharField(blank=True, max_length=30)
	theirwrestler_name = models.CharField(blank=True, max_length=30)
	theirschool_name = models.CharField(blank=True, max_length=50)
	match_complete = models.IntegerField(null=False, blank=False, default=0)
	created_at = models.DateTimeField(auto_now_add=True)

class MatchScore(models.Model):
	match = models.ForeignKey(Matches)
	wrestler_color = models.CharField(blank=True, max_length=10)
	point_code = models.CharField(blank=True, max_length=30)
	points = models.IntegerField(null=True)
	period = models.IntegerField(null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

class Meets(models.Model):
	team = models.ForeignKey('Teams')
	name = models.CharField(blank=True, max_length=100)
	address = models.CharField(blank=True, max_length=100)
	city = models.CharField(blank=True, max_length=30)
	state = models.CharField(blank=True, max_length=30)
	meet_date = models.DateField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	update_at = models.DateTimeField(auto_now=True)
