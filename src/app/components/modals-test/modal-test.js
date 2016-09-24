(function () {
    angular.module('upFrota')
        .controller('ModalTest', ModalTestCtrl);

    ModalTestCtrl.$inject = ['ModalAlertService', '$log'];

    function ModalTestCtrl(ModalAlertService, $log) {
        var self = this;

        self.showConfirmModal = function (type) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Yes',
                headerText: 'Confirm',
                bodyText: 'Are you sure of it ?',
                type: type
            };

            ModalAlertService.confirm(modalOptions)
                .then(function (result) {
                    $log.debug(result);
                });
        };

        self.showAlertModal = function (type) {
            ModalAlertService.alert({
                    type: type
                })
                .then(function (result) {
                    $log.debug(result);
                });
        }
    }
})();
