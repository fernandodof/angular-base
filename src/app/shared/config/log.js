(function() {
    angular.module('upFrota')
        .config(LogProviderConfig);

    LogProviderConfig.$inject = ['$logProvider', 'appConfig'];

    function LogProviderConfig($logProvider, appConfig) {
        $logProvider.debugEnabled(appConfig.debug);
    }

})();
