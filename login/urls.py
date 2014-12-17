from django.conf.urls import patterns, include, url
from login import views

urlpatterns = patterns('',
		url(r'^$', views.index, name="login"),
		url(r'^testbackbone$', views.testbackbone, name="backbone"),
		url(r'^notrecognized$', views.notrecognized, name="notrecognized"),
		url(r'^notactive$', views.notactive, name="login"),
)
