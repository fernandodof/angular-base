(function() {
    angular.module('upFrota')
        .constant('appConfig', {
            apiUrl: 'http://www.uppersystems.com.br/',
            httpDefaultTimeout: 15000,
            filterDefaultTimeout: 300,
            debug: false,
        });
})();
