(function() {
    angular.module('upFrota').controller('TableTestController', TableTestController);

    TableTestController.$inject = ['TableFactory', 'CrudFactory', 'TableTestService'];

    function TableTestController(TableFactory, CrudFactory, TableTestService) {

        var ctrl = this;

        var _options = {
            scope: ctrl,
            service: TableTestService,
        };
        CrudFactory.prepare(_options);

        ctrl.tableHeaders = [{
            sortAt: 'id',
            label: 'Id'
        }, {
            sortAt: 'firstName',
            label: 'First Name'
        }, {
            sortAt: 'lastName',
            label: 'Last Name'
        }, {
            sortAt: 'email',
            label: 'Email'
        }, {
            sortAt: 'gender',
            label: 'Gender'
        }, {
            sortAt: 'city',
            label: 'city'
        }, {
            sortAt: 'country',
            label: 'Country'
        }];

        ctrl.filterFirstName = {
            name: 'firstName',
            isEqualsSearch: false
        }

        ctrl.filterCountry = {
            name: 'country',
            isEqualsSearch: true
        }

        ctrl.countries = [{
            key: '*',
            value: 'All'
        }, {
            key: 'brazil',
            value: 'Brazil'
        }, {
            key: 'usa',
            value: 'USA'
        }, ];

    }
})();
