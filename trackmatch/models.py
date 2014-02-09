from django.db import models


class Teams(models.Model):
	name = models.CharField(blank=True, max_length=100)
	username = models.CharField(blank=True, max_length=200)
	city = models.CharField(blank=True, max_length=50)
	state = models.CharField(blank=True, max_length=20)

class Wrestlers(models.Model):
	team = models.ForeignKey(Teams)
	name = models.CharField(blank=True, max_length=30)
	weight = models.CharField(blank=True, max_length=3)
	year = models.CharField(blank=True, max_length=20)
	teamlevel = models.CharField(blank=True, max_length=20)

class Matches(models.Model):
	matchstyle = models.CharField(blank=True, max_length=30) #folk style high school / collegiate
	matchtype = models.CharField(blank=True, max_length=30) #choices are championship/consolation
	matchweight = models.CharField(blank=True, max_length=10)
	wrestler = models.ForeignKey(Wrestlers, default=1)
	opponent = models.IntegerField(null=True)
	ourwrestler_name = models.CharField(blank=True, max_length=30)
	theirwrestler_name = models.CharField(blank=True, max_length=30)
	theirschool_name = models.CharField(blank=True, max_length=50)
	created_at = models.DateTimeField(auto_now_add=True)

class MatchScore(models.Model):
	match_id = models.ForeignKey(Matches)
	wrestler_color = models.CharField(blank=True, max_length=10)
	point_code = models.CharField(blank=True, max_length=30)
	points = models.IntegerField(null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

class Meets(models.Model):
	team = models.ForeignKey('Teams')
	name = models.CharField(blank=True, max_length=100)
	address = models.CharField(blank=True, max_length=100)
	city = models.CharField(blank=True, max_length=30)
	state = models.CharField(blank=True, max_length=30)
	meet_date = models.DateField()
	created_at = models.DateTimeField(auto_now_add=True)
	update_at = models.DateTimeField(auto_now=True)
