(function () {
	angular.module('upFrota')
		.config(TranslateConfig);

	TranslateConfig.$inject = ['$translateProvider'];

	function TranslateConfig($translateProvider) {

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
