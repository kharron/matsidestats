# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Matches.opponent_choice'
        db.alter_column(u'trackmatch_matches', 'opponent_choice', self.gf('django.db.models.fields.CharField')(max_length=30, null=True))

        # Changing field 'Matches.wrestler_choice'
        db.alter_column(u'trackmatch_matches', 'wrestler_choice', self.gf('django.db.models.fields.CharField')(max_length=30, null=True))

    def backwards(self, orm):

        # Changing field 'Matches.opponent_choice'
        db.alter_column(u'trackmatch_matches', 'opponent_choice', self.gf('django.db.models.fields.CharField')(default='', max_length=30))

        # Changing field 'Matches.wrestler_choice'
        db.alter_column(u'trackmatch_matches', 'wrestler_choice', self.gf('django.db.models.fields.CharField')(default='', max_length=30))

    models = {
        u'trackmatch.matches': {
            'Meta': {'object_name': 'Matches'},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'matchstyle': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'matchtype': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'matchweight': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'}),
            'meet': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Meets']"}),
            'opponent': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Opponents']", 'null': 'True', 'blank': 'True'}),
            'opponent_choice': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True', 'blank': 'True'}),
            'ourwrestler_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'theirschool_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'theirwrestler_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'wrestler': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'to': u"orm['trackmatch.Wrestlers']"}),
            'wrestler_choice': ('django.db.models.fields.CharField', [], {'max_length': '30', 'null': 'True', 'blank': 'True'})
        },
        u'trackmatch.matchscore': {
            'Meta': {'object_name': 'MatchScore'},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'match': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Matches']"}),
            'period': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'point_code': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'points': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'updated_at': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'wrestler_color': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'})
        },
        u'trackmatch.meets': {
            'Meta': {'object_name': 'Meets'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'meet_date': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Teams']"}),
            'update_at': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
        },
        u'trackmatch.opponents': {
            'Meta': {'object_name': 'Opponents'},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '60', 'blank': 'True'}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Teams']"}),
            'teamlevel': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'updated_at': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'weight': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'year': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'})
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
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'current_meet': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Meets']", 'null': 'True', 'blank': 'True'}),
            'current_opponent': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Opponents']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Teams']"}),
            'teamlevel': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'updated_at': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'weight': ('django.db.models.fields.CharField', [], {'max_length': '3', 'blank': 'True'}),
            'year': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'})
        }
    }

    complete_apps = ['trackmatch']