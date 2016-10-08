(function() {
    /**
     * CrudFactory is the service responsible to manage CRUDs.
     *
     * @namespace upfrota
     * @method CrudFactory
     * @static
     * @param resource is a factory which creates a resource object that lets you interact with RESTful server-side data sources.
     */

    angular.module('upFrota').factory('CrudFactory', CrudFactory);

    CrudFactory.inject = ['$resource', '$translate', '$q', '$log', 'toaster', 'TableFactory', 'CreateFactory', 'EditFactory', 'RemoveFactory', 'AuthService', 'MessageService'];

    function CrudFactory($resource, $translate, $q, $log, toaster, TableFactory, CreateFactory, EditFactory, RemoveFactory, AuthService, MessageService) {

        var prepare = function(options) {

            // We need to remove the scope from options array, or angular.merge
            // will fail with "RangeError: Maximum call stack size exceeded":
            var controllerScope = options.scope;
            delete options.scope;

            options = angular.merge({}, {
                service: null,
                filters: null,
                messages: {
                    save: {
                        success: '',
                        error: ''
                    },
                    edit: {
                        success: '',
                        error: ''
                    },
                    remove: {
                        success: '',
                        error: ''
                    }
                },
                save: {
                    permissions: [],
                    dataAttr: 'data',
                    onClose: null,
                    onOpen: null,
                    onSave: null,
                    beforeSave: null, //Promise
                    waitBeforeOpen: null, //Promise
                    onSuccess: null,
                    onError: null,
                    finally: null
                },
                edit: {
                    permissions: [],
                    dataAttr: 'data',
                    onClose: null,
                    onOpen: null,
                    onSave: null,
                    afterLoad: null, // Promise
                    beforeSave: null, // Promise
                    waitBeforeOpen: null, //Promise
                    onSuccess: null,
                    onError: null,
                    finally: null
                },
                remove: {
                    permissions: [],
                    onCancel: null,
                    onConfirm: null,
                    onSuccess: null,
                    onError: null,
                    finally: null
                }
            }, options);

            controllerScope.filters = options.filters;

            controllerScope.reloadTable = function() {
                TableFactory.reload();
            };

            var TableFactoryOptions = {
                scope: controllerScope,
                service: options.service
            };

            if (typeof options.params !== "undefined") {
                TableFactoryOptions.params = options.params;
            }

            TableFactory.prepare(TableFactoryOptions);

            if (AuthService.hasPermission(options.save.permissions)) {
                controllerScope.create = function() {
                    controllerScope.actionCreate.isOpen = true;
                };
            }

            if (AuthService.hasPermission(options.edit.permissions)) {
                controllerScope.edit = function(id) {
                    controllerScope.actionEdit.id = id;
                    controllerScope.actionEdit.isOpen = true;
                };
            }

            if (AuthService.hasPermission(options.remove.permissions)) {
                controllerScope.remove = function(id) {
                    controllerScope.actionRemove.id = id;
                    controllerScope.actionRemove.isOpen = true;
                };
            }

            if (AuthService.hasPermission(options.save.permissions)) {

                var beforeSaveActionSave = function() { // This promise always will be executed before the save.
                    if (angular.isFunction(options.save.beforeSave)) {
                        return options.save.beforeSave(controllerScope[options.save.dataAttr]); // The before save should be a promise
                    } else {
                        return $q(function(resolve, reject) {
                            resolve(controllerScope[options.save.dataAttr]);
                        });
                    }
                };

                controllerScope.actionSave = {
                    isOpen: false,
                    onClose: function() {
                        controllerScope[options.save.dataAttr] = undefined;
                        if (angular.isFunction(options.save.onClose)) {
                            options.save.onClose();
                        }
                        $log.debug("The save dialog was closed.");
                    },
                    onOpen: function() {
                        if (angular.isFunction(options.save.onOpen)) {
                            options.save.onOpen();
                        }
                        $log.debug("The save dialog was opened.");
                    },
                    onSave: function() {
                        beforeSaveActionSave()
                            .then(function(dataModel) {

                                CreateFactory.create({
                                    service: options.service,
                                    data: dataModel, //controllerScope[options.save.dataAttr],
                                    onSuccess: function(data) {
                                        $translate([options.messages.save.success])
                                            .then(function(translations) {
                                                toaster.pop({
                                                    type: 'success',
                                                    body: translations[options.messages.save.success]
                                                });
                                            });

                                        if (angular.isFunction(options.save.onSuccess)) {
                                            options.save.onSuccess();
                                        }
                                        $log.debug("Success on saving the register.");
                                        TableFactory.reload();
                                    },
                                    onError: function(error) {
                                        if (angular.isFunction(options.save.onError)) {
                                            options.save.onError(error);
                                        } else {
                                            MessageService.showMessage(MessageService.errorType, options.messages.save.error);
                                        }

                                        $log.debug("Error on saving the register.");
                                    },
                                    finally: function() {
                                        controllerScope.actionSave.isOpen = false;

                                        if (angular.isFunction(options.save.finally)) {
                                            options.save.finally();
                                        }
                                        $log.debug("Running the finally method after trying to save a register.");
                                    }
                                });

                            });
                    },
                    waitBeforeOpen: function() {
                        if (angular.isFunction(options.save.waitBeforeOpen)) {
                            $log.debug("Running commands before opening the save dialog.");
                            return options.save.waitBeforeOpen();
                        }
                    }
                };
            }

            if (AuthService.hasPermission(options.edit.permissions)) {

                var beforeSaveActionEdit = function() { // This promise always will be executed before the save.
                    if (angular.isFunction(options.edit.beforeSave)) {
                        return options.edit.beforeSave(controllerScope[options.edit.dataAttr]); // The before save should be a promise
                    } else {
                        return $q(function(resolve, reject) {
                            resolve(controllerScope[options.edit.dataAttr]);
                        });
                    }
                };

                var afterLoad = function(loadedData) { // This promise always will be executed after load the resource.
                    if (angular.isFunction(options.edit.afterLoad)) {
                        return options.edit.afterLoad(loadedData); // The before save should be a promise
                    } else {
                        return $q(function(resolve, reject) {
                            resolve(loadedData);
                        });
                    }
                };

                controllerScope.actionEdit = {
                    isOpen: false,
                    id: undefined,
                    onClose: function() {
                        controllerScope[options.edit.dataAttr] = undefined;
                        if (angular.isFunction(options.edit.onClose)) {
                            options.edit.onClose();
                        }
                        $log.debug("The edit dialog was closed.");
                    },
                    onOpen: function() {
                        if (angular.isFunction(options.edit.onOpen)) {
                            options.edit.onOpen();
                        }
                        $log.debug("The edit dialog was opened.");
                    },
                    onSave: function() {
                        beforeSaveActionEdit()
                            .then(function(dataModel) {

                                EditFactory.edit({
                                    service: options.service,
                                    data: dataModel,
                                    onSuccess: function(data) {
                                        $translate([options.messages.edit.success])
                                            .then(function(translations) {
                                                toaster.pop({
                                                    type: 'success',
                                                    body: translations[options.messages.edit.success]
                                                });
                                            });

                                        if (angular.isFunction(options.edit.onSuccess)) {
                                            options.edit.onSuccess();
                                        }
                                        $log.debug("Success on editting the register.");
                                        TableFactory.reload();
                                    },
                                    onError: function(error) {
                                        if (angular.isFunction(options.edit.onError)) {
                                            options.edit.onError(error);
                                        } else {
                                            MessageService.showMessage(MessageService.errorType, options.messages.edit.error);
                                        }

                                        $log.debug("Error on editting the register.");
                                    },
                                    finally: function() {
                                        controllerScope.actionEdit.isOpen = false;

                                        if (angular.isFunction(options.edit.finally)) {
                                            options.edit.finally();
                                        }
                                        $log.debug("Running the finally method after trying to edit a register.");
                                    }
                                });

                            });
                    },
                    waitBeforeOpen: function() {
                        $log.debug("Running commands before opening the edit dialog.");
                        return $q(function(resolve, reject) {
                            EditFactory.load({
                                service: options.service,
                                data: {
                                    id: controllerScope.actionEdit.id
                                },
                                onSuccess: function(data) { // TODO afterLoad here
                                    if (angular.isFunction(options.edit.waitBeforeOpen)) {
                                        var waitPromise = options.edit.waitBeforeOpen();
                                        waitPromise.then(function() {
                                            afterLoad(data)
                                                .then(function(loadedData) {
                                                    controllerScope[options.edit.dataAttr] = loadedData;
                                                    resolve();
                                                });
                                        }, function(error) {
                                            reject(error);
                                        });
                                    } else {
                                        afterLoad(data)
                                            .then(function(loadedData) {
                                                controllerScope[options.edit.dataAttr] = loadedData;
                                                resolve();
                                            });
                                    }

                                    delete data.password;

                                    $log.debug("Success on loading the edit register.");
                                },
                                onError: function(error) {
                                    reject(error);
                                }
                            });
                        });
                    }
                };
            }

            if (AuthService.hasPermission(options.remove.permissions)) {
                controllerScope.actionRemove = {
                    isOpen: false,
                    id: undefined,
                    onCancel: function() {
                        if (angular.isFunction(options.remove.onCancel)) {
                            options.remove.onCancel();
                        }
                        $log.debug("The remove was canceled.");
                    },
                    onConfirm: function() {
                        $log.debug("Trying to remove the register " + controllerScope.actionRemove.id + ".");
                        RemoveFactory.remove({
                            service: options.service,
                            data: {
                                id: controllerScope.actionRemove.id
                            },
                            onSuccess: function(data) {
                                $translate([options.messages.remove.success])
                                    .then(function(translations) {
                                        toaster.pop({
                                            type: 'success',
                                            body: translations[options.messages.remove.success]
                                        });
                                    });

                                TableService.reload('afterRemove');

                                if (angular.isFunction(options.remove.onSuccess)) {
                                    options.remove.onSuccess();
                                }
                                $log.debug("Success on removing the register.");
                            },
                            onError: function(error) {
                                if (angular.isFunction(options.remove.onError)) {
                                    options.remove.onError(error);
                                } else {
                                    $translate([options.messages.remove.error])
                                        .then(function(translations) {
                                            toaster.pop({
                                                type: 'error',
                                                body: translations[options.messages.remove.error]
                                            });
                                        });
                                }
                                $log.debug("Error on removing the register.");
                            },
                            finally: function() {
                                controllerScope.actionRemove.isOpen = false;

                                if (angular.isFunction(options.remove.finally)) {
                                    options.remove.finally();
                                }
                                $log.debug("Running the finally method after trying to remove a register.");
                            }
                        });

                        if (angular.isFunction(options.remove.onConfirm)) {
                            options.remove.onConfirm();
                        }
                        $log.debug("The remove was confirmed.");
                    },
                };
            }
        };

        return {
            prepare: prepare
        };

    }
})();
