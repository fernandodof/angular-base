(function() {

    /**
     * RemoveService is the service responsible to comunicate with the server and Remove one register
     *
     * @namespace em
     * @method RemoveService
     * @static
     * @param resource is a factory which removes a resource object that lets you interact with RESTful server-side data sources.
     */

    angular.module('upFrota').factory('RemoveFactory', RemoveFactory);

    RemoveFactory.$inject = ['$resource'];

    function RemoveFactory($resource) {

        var remove = function(options) {

            // object expected:
            // {
            //      options: {
            //          service, // The service with a url
            //          data, // The object that will be saved.
            //          onSuccess(data), the function with the data returned
            //          onError(error), the function with the error returned
            //      }
            // }

            var _url = options.service.url;
            var _data = options.data;
            var _onSuccess = options.onSuccess;
            var _onError = options.onError;
            var _finally = options.finally;

            var Resource = $resource(_url + options.data.id, {
                remove: {
                    method: 'DELETE'
                }
            });

            Resource.remove(function(data) {
                if (angular.isFunction(_onSuccess)) {
                    _onSuccess(data);
                }

            }, function(error) {
                if (angular.isFunction(_onError)) {
                    _onError(error);
                }
            }).$promise.finally(function() {
                if (angular.isFunction(_finally)) {
                    _finally();
                }
            });

        };

        return {
            remove: remove
        };

    }

})();
