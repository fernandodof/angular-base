(function () {
    angular.module('upFrota')
        .constant('appConfig', {
            apiUrl: 'http://www.uppersystems.com.br/',
            httpDefaultTimeout: 30000, // delay 30000 ms
            filterDefaultTimeout: 300, // delay 00300 ms
            debug: true,
        });
})();
