(function() {

    angular.module('upFrota').service('MessageService', MessageService);

    MessageService.$inject = ['$translate', 'toaster'];

    function MessageService($translate, toaster) {
        var self = this;

        // Expected message types -> 'error'; 'success' and 'warning'
        self.showMessage = function(type, message) {
            $translate([message])
                .then(function(translations) {
                    toaster.pop({
                        type: type,
                        body: translations[message]
                    });
                });
        };
    }
})();
