from django.conf.urls import patterns, url
from api import views

urlpatterns = patterns('',
		# api
		url(r'roster/(?P<api_key>.*)/$', views.roster),
		url(r'roster/$', views.roster),
		url(r'view_matches/(?P<wrestler_id>.*)/$', views.view_matches, name='viewmatches'),
		url(r'view_match/(?P<match_id>.*)/$', views.view_match, name='viewmatch'),

		url(r'wrestler_details/(?P<wrestler_id>.*)/(?P<api_key>.*)/$', views.get_wrestler_info, name='w_info'),

		# MEET Management
		url(r'meetlist/(?P<api_key>.*)/$', views.meetlist),
		url(r'addmeet/(?P<api_key>.*)/$', views.addmeet),
		url(r'editmeet/(?P<api_key>.*)/$', views.editmeet),
)
