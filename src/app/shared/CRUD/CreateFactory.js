(function() {

    /**
     * CreateService is the service responsible to comunicate with the server and create one register
     *
     * @namespace upFrota
     * @method CreateService
     * @static
     * @param resource is a factory which creates a resource object that lets you interact with RESTful server-side data sources.
     */
    angular.module('upFrota').factory('CreateFactory', CreateFactory);

    CreateFactory.$inject = ['$resource'];

    function CreateFactory($resource) {

        var create = function(options) {

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

            var Resource = $resource(_url, {}, {
                save: {
                    method: 'POST',
                    transformRequest: function(data, headers) {
                        headers = angular.extend({}, headers, {
                            'Content-Type': 'application/json'
                        });
                        data = angular.toJson(_data);
                        return data;
                    },
                }
            });

            Resource.save(function(data) {
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
            create: create
        };

    }
})();
