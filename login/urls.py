from django.conf.urls import patterns, include, url
from login import views

urlpatterns = patterns('',
		url(r'^$', views.index, name="login"),
		url(r'^notrecognized$', views.notrecognized, name="login"),
		url(r'^notactive$', views.notactive, name="login"),
)
