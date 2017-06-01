(function () {
  'use strict';
  angular
  .module('betApp')
  .config(config);
  
 function config($translateProvider) {
  
  // $translateProvider.translations('fr', translationsFR);

  // $translateProvider.translations('es', translationsES);

  // $translateProvider.translations('tr', translationsTR);

  // $translateProvider.translations('en', translationsEN);
 
  // $translateProvider.translations('de', translationsDE);
  
  // $translateProvider.preferredLanguage('en');
  
  $translateProvider
           .registerAvailableLanguageKeys(['en', 'de', 'tr', 'es', 'fr'], { 'en_*': 'en', 'de_*': 'de', 'tr_*': 'tr', 'es_*': 'es', 'fr_*': 'fr' })
           .determinePreferredLanguage()
           .fallbackLanguage('en')
           //.useStaticFilesLoader({ prefix: 'translation/lang-', suffix: '.json' })
		   .useUrlLoader(apiURL+'translation/get')
           .useLoaderCache(true)
           .useSanitizeValueStrategy('sanitizeParameters');
}
})();