(function() {

    angular.module('upFrota').factory('AuthService', AuthService);

    AuthService.$inject = ['$localStorage'];

    function AuthService($localStorage) {
        var auth = {

            hasPermission: function(permissions) {
                var hasPermission = false;

                if ($localStorage.user) {
                    var userPersimions = $localStorage.user.permissions;

                    for (var i = 0; i < userPersimions.length; i++) {
                        if (permissions.indexOf(userPersimions[i])) {
                            hasPermission = true;
                        }
                    }

                }

                return hasPermission;
            }
        };

        return auth;
    }

})();
