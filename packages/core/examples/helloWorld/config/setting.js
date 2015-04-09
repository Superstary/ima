export var init = (ns, config) => { // jshint ignore:line

	var nsSetting = ns.namespace('Setting');

	var settings = {
		dev: {
			$Http: {
				baseUrl: config.protocol + '//localhost:3001/api', // jshint ignore:line
				timeout: 2000,
				repeatRequest: 1,
				ttl: 0,
				accept: 'application/json',
				cachePrefix: 'http.',
				cachePrefixPromise: 'http.promise.'
			},
			$Socket:{
				webSocketUrl: '//localhost:3031',
				maxRepeatedAttempts: 2
			},
			$Cache: {
				cached: true,
				TTL: 60000
			},
			$Animate: {
				state: {

				}
			},
			$PageRender: {
				scripts: [
					'/static/js/shim.js',
					'/static/js/vendor.client.js',
					'/static/js/locale/'+config.language+'.js',
					'/static/js/app.client.js'
				],
				masterView: 'App.Component.Layout.Master.View',
				masterElementId: 'page'
			},
			$Static: {
				image: '/static/img/'
			}
		},
		prod: {
			$Http: {
				baseUrl: config.protocol + '//www.example.com/api', // jshint ignore:line
				timeout: 2000,
				repeatRequest: 1,
				ttl: 0,
				accept: 'application/json',
				cachePrefix: 'http.',
				cachePrefixPromise: 'http.promise.'
			},
			$Socket:{
				webSocketUrl: '//www.example.com',
				maxRepeatedAttempts: 2
			},
			$Cache: {
				cached: true,
				TTL: 60000
			},
			$Animate: {
				state: {

				}
			},
			$PageRender: {
				scripts: [
					'/static/js/locale/'+config.language+'.js',
					'/static/js/app.bundle.js'
				],
				masterView: 'App.Component.Layout.Master.View',
				masterElementId: 'page'
			},
			$Static: {
				image: '/static/img/'
			}
		},
		test: {
			$Http: {
				baseUrl: config.protocol + '//localhost:3001/api', // jshint ignore:line
					timeout: 2000,
					repeatRequest: 1,
					ttl: 0,
					accept: 'application/json',
					cachePrefix: 'http.',
					cachePrefixPromise: 'http.promise.'
			},
			$Socket:{
				webSocketUrl: '//localhost:3031',
				maxRepeatedAttempts: 2
			},
			$Cache: {
				cached: true,
					TTL: 60000
			},
			$Animate: {
				state: {

				}
			},
			$PageRender: {
				scripts: [
					'/static/js/locale/'+config.language+'.js',
					'/static/js/app.bundle.js'
				],
					masterView: 'App.Component.Layout.Master.View',
					masterElementId: 'page'
			},
			$Static: {
				image: '/static/img/'
			}
		}
	};

	var envSettings = settings[config.env]; // jshint ignore:line

	for (var envKey of Object.keys(envSettings)) {
		nsSetting[envKey] = envSettings[envKey];
	}

	nsSetting['$Env'] = config.env; // jshint ignore:line
	nsSetting['$Protocol'] = config.protocol; // jshint ignore:line
	nsSetting['$Language'] = config.language; // jshint ignore:line
	nsSetting['$Domain'] = config.domain; // jshint ignore:line
	nsSetting['$Root'] = config.root; // jshint ignore:line
	nsSetting['$LanguagePartPath'] = config.languagePartPath; // jshint ignore:line
};
