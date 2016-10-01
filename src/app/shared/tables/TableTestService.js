(function() {

    angular.module('upFrota').service('TableTestService', TableTestService);

    TableTestService.$inject = ['appConfig'];

    function TableTestService(appConfig) {
        var self = this;

        self.url = 'app/shared/testData/users.json';
    }
})();
