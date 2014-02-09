# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Teams.username'
        db.add_column(u'trackmatch_teams', 'username',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=200, blank=True),
                      keep_default=False)

        # Adding field 'Wrestlers.teamlevel'
        db.add_column(u'trackmatch_wrestlers', 'teamlevel',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=20, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Teams.username'
        db.delete_column(u'trackmatch_teams', 'username')

        # Deleting field 'Wrestlers.teamlevel'
        db.delete_column(u'trackmatch_wrestlers', 'teamlevel')


    models = {
        u'trackmatch.teams': {
            'Meta': {'object_name': 'Teams'},
            'city': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'max_length': '200', 'blank': 'True'})
        },
        u'trackmatch.wrestlers': {
            'Meta': {'object_name': 'Wrestlers'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Teams']"}),
            'teamlevel': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'weight': ('django.db.models.fields.CharField', [], {'max_length': '3', 'blank': 'True'}),
            'year': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'})
        }
    }

    complete_apps = ['trackmatch']