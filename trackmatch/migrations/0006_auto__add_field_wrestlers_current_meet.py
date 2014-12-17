# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Wrestlers.current_meet'
        db.add_column(u'trackmatch_wrestlers', 'current_meet',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['trackmatch.Meets'], null=True, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Wrestlers.current_meet'
        db.delete_column(u'trackmatch_wrestlers', 'current_meet_id')


    models = {
        u'trackmatch.matches': {
            'Meta': {'object_name': 'Matches'},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'matchstyle': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'matchtype': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'matchweight': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'}),
            'opponent': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'ourwrestler_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'theirschool_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'theirwrestler_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'wrestler': ('django.db.models.fields.related.ForeignKey', [], {'default': '1', 'to': u"orm['trackmatch.Wrestlers']"})
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
        u'trackmatch.meets': {
            'Meta': {'object_name': 'Meets'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'meet_date': ('django.db.models.fields.DateField', [], {}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Teams']"}),
            'update_at': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'})
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
            'current_meet': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Meets']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'team': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['trackmatch.Teams']"}),
            'teamlevel': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'}),
            'weight': ('django.db.models.fields.CharField', [], {'max_length': '3', 'blank': 'True'}),
            'year': ('django.db.models.fields.CharField', [], {'max_length': '20', 'blank': 'True'})
        }
    }

    complete_apps = ['trackmatch']