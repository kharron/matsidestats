# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Teams'
        db.create_table(u'trackmatch_teams', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('city', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('state', self.gf('django.db.models.fields.CharField')(max_length=20)),
        ))
        db.send_create_signal(u'trackmatch', ['Teams'])

        # Adding model 'Wrestlers'
        db.create_table(u'trackmatch_wrestlers', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('team', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['trackmatch.Teams'])),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('weight', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('year', self.gf('django.db.models.fields.CharField')(max_length=20)),
        ))
        db.send_create_signal(u'trackmatch', ['Wrestlers'])


    def backwards(self, orm):
        # Deleting model 'Teams'
        db.delete_table(u'trackmatch_teams')

        # Deleting model 'Wrestlers'
        db.delete_table(u'trackmatch_wrestlers')


    models = {
        u'trackmatch.teams': {
            'Meta': {'object_name': 'Teams'},
            'city': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        },
        u'trackmatch.wrestlers': {
            'Meta': {'object_name': 'Wrestlers'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Teams']"}),
            'weight': ('django.db.models.fields.CharField', [], {'max_length': '3'}),
            'year': ('django.db.models.fields.CharField', [], {'max_length': '20'})
        }
    }

    complete_apps = ['trackmatch']