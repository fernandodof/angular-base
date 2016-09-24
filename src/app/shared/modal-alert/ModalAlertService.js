(function () {

    angular.module('upFrota')
        .service('ModalAlertService', ModalAlertService);

    ModalAlertService.$inject = ['$uibModal'];

    function ModalAlertService($uibModal) {

        var $ctrl = this;

        $ctrl.modalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Confirm',
            bodyText: 'Perform action?',
            showCancel: false,
            type: '',
            icon: 'fa fa-info'
        };

        $ctrl.modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'templates/shared/modal-alert/modal-alert-template.html',
            controller: 'ModalInstanceController',
            controllerAs: '$ctrl',
            size: 'md'
        };

        $ctrl.getIcon = function (type) {

            var icon = 'fa fa-info';

            switch (type) {
                case 'success':
                    icon = 'fa fa-check';
                    break;
                case 'warning':
                    icon = 'fa fa-exclamation-triangle';
                    break;
                case 'danger':
                    icon = 'fa fa-fire';
                    break;
            }
            return icon;

        };

        $ctrl.confirm = function (customModalOptions, customModalDefaults) {
            $ctrl.modalOptions.showCancel = true;

            if (!customModalDefaults) {
                customModalDefaults = {};
            }

            return $ctrl.show(customModalDefaults, customModalOptions);
        };

        $ctrl.alert = function (customModalOptions, customModalDefaults) {
            $ctrl.modalOptions.showCancel = false;
            $ctrl.modalOptions.headerText = 'Alert';
            $ctrl.modalOptions.bodyText = 'This happened';

            if (!customModalDefaults) {
                customModalDefaults = {};
            }

            return $ctrl.show(customModalDefaults, customModalOptions);
        };

        $ctrl.show = function (customModalDefaults, customModalOptions) {

            var tempModalDefaults = {};
            var tempModalOptions = {};

            $ctrl.modalOptions.icon = $ctrl.getIcon(customModalOptions.type);

            angular.extend(tempModalDefaults, $ctrl.modalDefaults,
                customModalDefaults);
            angular.extend(tempModalOptions, $ctrl.modalOptions,
                customModalOptions);

            tempModalDefaults.resolve = {
                modalOptions: function () {
                    return tempModalOptions;
                }
            };

            return $uibModal.open(tempModalDefaults)
                .result;

        };
    }

    angular.module('upFrota')
        .controller('ModalInstanceController', function ($uibModalInstance,
            modalOptions) {
            var $ctrl = this;

            $ctrl.modalOptions = modalOptions;

            $ctrl.ok = function () {
                $uibModalInstance.close($ctrl.modalOptions.actionButtonText
                    .toLowerCase());
            };

            $ctrl.close = function () {
                $uibModalInstance.close($ctrl.modalOptions.closeButtonText
                    .toLowerCase());
            };

            $ctrl.dismiss = function (result) {
                $uibModalInstance.close('dismiss');
            };
        });

})();
