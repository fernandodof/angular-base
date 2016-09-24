(function () {
    angular.module('upForta')
        .config(LogProviderConfig);

    LogProviderConfig.$inject = ['$logProvider', 'appConfig'];

    function LogProviderConfig($logProvider, appConfig) {
        $logProvider.debugEnabled(appconfig.debug);
    }

})();
