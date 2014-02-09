from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
		(r'^static/(?P<path>.*)$','django.views.static.serve',{'document_root':'/www/sites/matsidestats/static/'}),
		(r'^media/(?P<path>.*)$','django.views.static.serve',{'document_root':'/www/sites/matsidestats/media/'}),
		url(r'^$', 'consumersite.views.index', name='consumersite'),
		url(r'^trackmatch/$', 'trackmatch.views.index', name='trackmatch'),
		url(r'^start_match/(?P<wrestler_id>.*)/$', 'trackmatch.views.start_match', name='startmatch'),
		url(r'^view_matches/(?P<wrestler_id>.*)/$', 'trackmatch.views.view_matches', name='viewmatches'),
		url(r'^getwrestler/(?P<wrestler_id>.*)/$', 'trackmatch.views.get_wrestler_info', name='getwrestler'),
		url(r'^addpoints/(?P<match_id>.*)/$', 'trackmatch.views.addpoints', name='addpoints'),
		url(r'^teamview/$', 'trackmatch.views.teamview', name='teamview'),
		url(r'^teamadd/$', 'trackmatch.views.teamadd', name='teamadd'),
		url(r'^addwrestler/$', 'trackmatch.views.addwrestler', name='addwrestler'),
		url(r'^login/$', 'register.views.login_team', name='login'),
		url(r'^register/$', 'register.views.index', name='reg'),
    # url(r'^photojibe/', include('photojibe.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
