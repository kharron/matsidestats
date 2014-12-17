# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'MatchScore'
        db.create_table(u'trackmatch_matchscore', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('match_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['trackmatch.Matches'])),
            ('wrestler_color', self.gf('django.db.models.fields.CharField')(max_length=10, blank=True)),
            ('point_code', self.gf('django.db.models.fields.CharField')(max_length=30, blank=True)),
            ('points', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('created_at', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated_at', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
        ))
        db.send_create_signal(u'trackmatch', ['MatchScore'])

        # Adding model 'Matches'
        db.create_table(u'trackmatch_matches', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('matchstyle', self.gf('django.db.models.fields.CharField')(max_length=30, blank=True)),
            ('matchtype', self.gf('django.db.models.fields.CharField')(max_length=30, blank=True)),
            ('matchweight', self.gf('django.db.models.fields.CharField')(max_length=10, blank=True)),
            ('wrestler_green', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('wrestler_red', self.gf('django.db.models.fields.IntegerField')(null=True)),
            ('created_at', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'trackmatch', ['Matches'])


    def backwards(self, orm):
        # Deleting model 'MatchScore'
        db.delete_table(u'trackmatch_matchscore')

        # Deleting model 'Matches'
        db.delete_table(u'trackmatch_matches')


    models = {
        u'trackmatch.matches': {
            'Meta': {'object_name': 'Matches'},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'matchstyle': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'matchtype': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'matchweight': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'}),
            'wrestler_green': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'wrestler_red': ('django.db.models.fields.IntegerField', [], {'null': 'True'})
        },
        u'trackmatch.matchscore': {
            'Meta': {'object_name': 'MatchScore'},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'match_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Matches']"}),
            'point_code': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'points': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'updated_at': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'wrestler_color': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'})
        },
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