from django.views.decorators.csrf import csrf_exempt
from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
		(r'^staticpages/(?P<path>.*)$','django.views.static.serve',{'document_root':'/www/sites/matsidestats/staticpages/'}),
		(r'^static/(?P<path>.*)$','django.views.static.serve',{'document_root':'/www/sites/matsidestats/static/'}),
		(r'^media/(?P<path>.*)$','django.views.static.serve',{'document_root':'/www/sites/matsidestats/media/'}),
		url(r'^$', 'consumersite.views.index', name='consumersite'),
		url(r'^trackmatch/$', 'trackmatch.views.index', name='trackmatch'),
		url(r'^resume_match/(?P<wrestler_id>.*)/(?P<match_id>.*)/$', 'trackmatch.views.resume_match', name='resumematch'),
		url(r'^start_match/(?P<wrestler_id>.*)/$', 'trackmatch.views.start_match', name='startmatch'),
		url(r'^view_matches/(?P<wrestler_id>.*)/$', 'trackmatch.views.view_matches', name='viewmatches'),
		url(r'^view_match/(?P<match_id>.*)/$', 'trackmatch.views.view_match', name='viewmatch'),
		url(r'^deletematch/(?P<wrestler_id>.*)/(?P<match_id>.*)/$', 'trackmatch.views.delete_match', name='deletematch'),
		url(r'^getwrestler/(?P<wrestler_id>.*)/$', 'trackmatch.views.get_wrestler_info', name='getwrestler'),
		url(r'^editwrestler/(?P<wrestler_id>.*)/$', 'trackmatch.views.editwrestler', name='editwrestler'),
		url(r'^addpoints/(?P<match_id>.*)/$', 'trackmatch.views.addpoints', name='addpoints'),
		url(r'^teamview/$', 'trackmatch.views.teamview', name='teamview'),
		url(r'^managemeets/$', 'trackmatch.views.managemeets', name='managemeets'),
		url(r'^meetdelete/(?P<meet_id>.*)/$', 'trackmatch.views.meetdelete', name='managemeets'),
		url(r'^addmeet/$', 'trackmatch.views.addmeet', name='addmeet'),
		url(r'^savewrestler/$', 'trackmatch.views.save_wrestler_info', name='savewrestler'),
		url(r'^updatewrestler/$', 'trackmatch.views.save_wrestler_info', name='updatewrestler'),
		url(r'^teamadd/$', 'trackmatch.views.teamadd', name='teamadd'),
		url(r'^addwrestler/$', 'trackmatch.views.addwrestler', name='addwrestler'),
		url(r'^endmatch/$', 'trackmatch.views.endmatch', name='endmatch'),

		# API
		url(r'^api', include('api.urls')),

		# HOWTO pages
		url(r'^howto/$', 'howto.views.index', name='howto'),

		#Response Pages for maintaing state
		url(r'^wrestlerlist/$', 'trackmatch.views.teamwrestlers', name='wrestlerlist'),

		# Login and Register
		url(r'^login/(?P<apikey>.*)/$', 'register.views.login_team', name='login'),
		url(r'^login/$', 'register.views.login_team', name='login'),
		url(r'^loginapi/$', 'login.views.login_api', name='loginapi'),
		url(r'^loginapi/(?P<apikey>.*)/$', 'login.views.login_api', name='loginapi'),
		url(r'^logout/$', 'register.views.logout_team', name='logout'),
		url(r'^user_check/$', 'register.views.username_check', name='user_check'),
		url(r'^usercreated/$', 'trackmatch.views.teamview', name='user_check'),
		url(r'^register/$', 'register.views.api_register', name='register'),

		url(r'^addopponent/(?P<wrestler_id>.*)/$', 'trackmatch.views.add_opponent', name='addopponent'),
		url(r'^saveopponent/$', 'trackmatch.views.save_opponent', name='saveopponent'),
		url(r'^register/$', 'register.views.index', name='reg'),
		url(r'^backbone/.*$', 'trackmatch.views.backbone', name='backbone'),
		url(r'^angular/.*$', 'login.views.angular', name="backbone"),
    # url(r'^photojibe/', include('photojibe.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
