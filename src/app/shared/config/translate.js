(function () {
	angular.module('upFrota')
		.config(translateConfig);

	translateConfig.$inject = ['$translateProvider'];

	function translateConfig($translateProvider) {

		$translateProvider.useStaticFilesLoader({
			prefix: 'i18n/',
			suffix: '.json'
		});

		$translateProvider.preferredLanguage('en-us');
		//Do not sanitaze
		$translateProvider.useSanitizeValueStrategy(null);
		// remember language with local storage
		$translateProvider.useLocalStorage();

		// change the language with them method bellow
		// $translate.use(langKey);
	}
})();
