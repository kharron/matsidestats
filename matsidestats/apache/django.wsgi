import os, sys
sys.path.append('/www/sites/matsidestats')
os.environ['DJANGO_SETTINGS_MODULE'] = 'matsidestats.settings'

import django.core.handlers.wsgi

application = django.core.handlers.wsgi.WSGIHandler()
