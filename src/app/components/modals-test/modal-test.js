(function () {
    angular.module('upFrota')
        .controller('ModalTest', modalTestCtrl)

    modalTestCtrl.$inject = ['ModalAlertService']

    function modalTestCtrl(ModalAlertService) {
        var self = this

        self.showConfirmModal = function (type) {
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Yes',
                headerText: 'Confirm',
                bodyText: 'Are you sure of it ?',
                type: type
            }

            ModalAlertService.confirm(modalOptions)
                .then(function (result) {
                    console.log(result)
                })
        }

        self.showAlertModal = function (type) {
            ModalAlertService.alert({
                    type: type
                })
                .then(function (result) {
                    console.log(result)
                })
        }
    }
})();
