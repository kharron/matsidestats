// install   :      cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
// link      :      https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin

// NOTE: shareViaEmail -> if user cancels sharing email, success is still called
// TODO: add support for iPad

angular.module('ngCordova.plugins.socialSharing', [])

  .factory('$cordovaSocialSharing', ['$q', '$window', function ($q, $window) {

    return {
      share: function (message, subject, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.share(message, subject, file, link,
          function () {
            q.resolve(true);
          },
          function () {
            q.reject(false);
          });
        return q.promise;
      },

      shareViaTwitter: function (message, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareViaTwitter(message, file, link,
          function () {
            q.resolve(true);
          },
          function () {
            q.reject(false);
          });
        return q.promise;
      },

      shareViaWhatsApp: function (message, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareViaWhatsApp(message, file, link,
          function () {
            q.resolve(true);
          },
          function () {
            q.reject(false);
          });
        return q.promise;
      },

      shareViaFacebook: function (message, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareViaFacebook(message, file, link,
          function () {
            q.resolve(true);
          },
          function () {
            q.reject(false);
          });
        return q.promise;
      },

      shareViaSMS: function (message, commaSeparatedPhoneNumbers) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareViaSMS(message, commaSeparatedPhoneNumbers,
          function () {
            q.resolve(true);
          },
          function () {
            q.reject(false);
          });
        return q.promise;
      },

      shareViaEmail: function (message, subject, toArr, ccArr, bccArr, fileArr) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareViaEmail(message, subject, toArr, ccArr, bccArr, fileArr,
          function () {
            q.resolve(true);
          },
          function () {
            q.reject(false);
          });
        return q.promise;
      },

      canShareViaEmail: function () {
        var q = $q.defer();
        $window.plugins.socialsharing.canShareViaEmail(
          function () {
            q.resolve(true);
          },
          function () {
            q.reject(false);
          });
        return q.promise;
      },

      canShareVia: function (via, message, subject, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.canShareVia(via, message, subject, file, link,
          function (success) {
            q.resolve(success);
          },
          function (error) {
            q.reject(error);
          });
        return q.promise;
      },

      shareVia: function (via, message, subject, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareVia(via, message, subject, file, link,
          function () {
            q.resolve(true);
          },
          function () {
            q.reject(false);
          });
        return q.promise;
      }

    };
  }]);
