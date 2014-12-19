angular.module('demo.deviceMotion.ctrl', [])

  .controller('DeviceMotionCtrl', function ($scope, $cordovaDeviceMotion, $ionicModal) {
    var watchID;

    $cordovaDeviceMotion
      .getCurrentAcceleration()
      .then(function (motion) {
        $scope.motion = motion;
        console.log(motion);
      }, function (err) {
        $scope.msg = err.message;
        console.log(err);
      });


    $scope.watchAcceleration = function () {
      var options = { frequency: 3000 };  // Update every 3 seconds

      $scope.this_watch = $cordovaDeviceMotion.watchAcceleration(options);

      $scope.this_watch.promise.then(
        function () {  /* unused */
        },
        function (err) {
          $scope.msg = err.message;
        },
        function (motion) {
          $scope.motion = motion;
        });
    };

    $scope.clearWatch = function () {
      // use watchID from watchAccelaration()
      $cordovaDeviceMotion.clearWatch($scope.this_watch.watchId);
    };


    /*
     Ionic modal with source code
     */

    $ionicModal.fromTemplateUrl('app/deviceMotion/deviceMotion-source.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    $scope.showSource = function () {
      $scope.modal.show();
    }
  });

