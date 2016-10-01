(function() {

    /**
     * EditService is the service responsible to comunicate with the server and edit one register
     *
     * @namespace em
     * @method EditService
     * @static
     * @param resource is a factory which edits a resource object that lets you interact with RESTful server-side data sources.
     */

    angular.module('upFrota').factory('EditFactory', EditFactory);

    EditFactory.$inject = ['$resource'];

    function EditFactory($resource) {

        var _resourceConfig = {
            update: {
                method: 'PUT',
                transformRequest: function(data, headers) {
                    headers = angular.extend({}, headers, {
                        'Content-Type': 'application/json'
                    });
                    data = angular.toJson(data);
                    return data;
                },
            }
        };

        var load = function(options) {
            var _url = options.service.url + options.data.id;
            var _afterLoad = options.afterLoad;
            var _onSuccess = options.onSuccess;
            var _onError = options.onError;

            var Resource = $resource(_url, {}, _resourceConfig);

            Resource.get(function(data) {
                if (angular.isFunction(_onSuccess)) {
                    _onSuccess(data);
                }
            }, function(error) {
                if (angular.isFunction(_onError)) {
                    _onError(error);
                }
            });
        };

        var edit = function(options) {

            // object expected:
            // {
            //      options: {
            //          service, // The service with a url
            //          data, // The object that will be saved.
            //          onSuccess(data), the function with the data returned
            //          onError(error), the function with the error returned
            //      }
            // }

            var _url = options.service.url + options.data.id;
            var _data = options.data;
            var _onSuccess = options.onSuccess;
            var _onError = options.onError;
            var _finally = options.finally;

            var Resource = $resource(_url, {}, _resourceConfig);
            Resource.update(_data, function(data) {
                    if (angular.isFunction(_onSuccess)) {
                        _onSuccess(data);
                    }
                }, function(error) {
                    if (angular.isFunction(_onError)) {
                        _onError(error);
                    }
                })
                .$promise.finally(function() {
                    if (angular.isFunction(_finally)) {
                        _finally();
                    }
                });

        };

        return {
            edit: edit,
            load: load
        };

    }
})();
