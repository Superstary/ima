export var init = (ns) => { //jshint ignore:line

	//**************START VENDORS**************
	//RSVP
	ns.oc.bind('$Rsvp', ns.Vendor.Rsvp); // ???
	ns.oc.bind('$Promise', ns.Vendor.Rsvp.Promise);
	ns.oc.bind('$BindPromise', () => {
		return ns.oc.get('$Promise');
	});

	//React
	ns.oc.bind('$React', ns.Vendor.React);
	ns.oc.bind('$BindReact', () => {
		return ns.oc.get('$React');
	});

	//SuperAgent
	ns.oc.bind('$SuperAgent', () => {
		return ns.Vendor.SuperAgent;
	});
	//*************END VENDORS*****************

	//*************START CONSTANT**************
	ns.oc.bind('$SETTING', ns.Setting);
	ns.oc.bind('$ENV', ns.Setting.$Env);
	ns.oc.bind('$HTTP_CONFIG', ns.Setting.$Http);
	ns.oc.bind('$SOCKET_CONFIG', ns.Setting.$Socket);
	ns.oc.bind('$CACHE_CONFIG', ns.Setting.$Cache);
	ns.oc.bind('$ANIMATE_CONFIG', ns.Setting.$Animate);

	ns.oc.bind('$SECURE', ns.Setting.$Protocol === 'https:' ? true: false );
	ns.oc.bind('$PROTOCOL', ns.Setting.$Protocol );
	//*************END CONSTANT****************


	//*************START CORE**************
	//Helper
	if (typeof window !== 'undefined' && window !== null) {
		ns.oc.bind('$Window', ns.oc.create('Core.Helper.ClientWindow'));
	} else {
		ns.oc.bind('$Window', ns.oc.create('Core.Helper.ServerWindow'));
	}

	//Core Error
	ns.oc.bind('$Error', ns.Core.Error.CoreError);

	//Dictionary
	ns.oc.bind('$Dictionary', ns.oc.create('Core.Dictionary.Handler'));

	//Request & Respond
	ns.oc.bind('$Request', ns.oc.create('Core.Router.Request'));
	ns.oc.bind('$Respond', ns.oc.create('Core.Router.Respond'));

	//Storage
	ns.oc.bind('$CookieStorage', ns.oc.make('Core.Storage.Cookie', ['$Request', '$Respond', '$SECURE']));
	ns.oc.bind('$SessionStorage', ns.Core.Storage.Session);
	ns.oc.bind('$MapStorage', ns.Core.Storage.Map);
	ns.oc.bind('$SessionMapStorage', ns.Core.Storage.SessionMap, ['$MapStorage', '$SessionStorage']);

	//Dispatcher
	ns.oc.bind('$Dispatcher', ns.oc.make('Core.Dispatcher.Handler', ['$MapStorage']));

	//Animate
	ns.oc.bind('$Animate', ns.oc.make('Core.Animate.Handler', ['$Dispatcher', '$BindPromise', '$Window', '$CookieStorage', '$ANIMATE_CONFIG']));

	//Cache
	if (ns.oc.get('$Window').hasSessionStorage()) {
		ns.oc.bind('$CacheStorage', ns.oc.make('$SessionMapStorage'));
	} else {
		ns.oc.bind('$CacheStorage', ns.oc.make('$MapStorage'));
	}

	ns.oc.bind('$Cache', ns.oc.make('Core.Cache.Handler', ['$CacheStorage' ,'$CACHE_CONFIG']));
	ns.oc.bind('$CacheData', ns.Core.Cache.Data);

	//Render
	if (ns.oc.get('$Window').isClient()) {
		ns.oc.bind('$PageRender', ns.oc.make('Core.PageRender.Client', ['$Rsvp', '$BindReact', '$Animate', ns.Setting, '$Window']));
	} else {
		ns.oc.bind('$PageRender', ns.oc.make('Core.PageRender.Server', ['$Rsvp', '$BindReact', '$Animate', ns.Setting, '$Respond', '$Cache']));
	}

	//SEO
	ns.oc.bind('$Seo', ns.oc.make('Core.Seo.Handler', []));
	ns.oc.bind('$DecoratorController', ns.Core.Decorator.Controller);

	//Router
	ns.oc.bind('$RouterFactory', ns.oc.make('Core.Router.Factory', ['$Seo', '$Dictionary', ns.Setting]));
	if (ns.oc.get('$Window').isClient()) {
		ns.oc.bind('$Router', ns.oc.make('Core.Router.ClientHandler', ['$PageRender', '$RouterFactory', '$BindPromise', '$Window']));
	} else {
		ns.oc.bind('$Router', ns.oc.make('Core.Router.ServerHandler', ['$PageRender', '$RouterFactory', '$BindPromise', '$Request', '$Respond']));
	}
	ns.oc.bind('$Route', ns.Core.Router.Route);

	//SuperAgent
	ns.oc.bind('$HTTP_STATUS_CODE', ns.Core.Http.STATUS_CODE);
	ns.oc.bind('$HttpProxy', ns.oc.make('Core.Http.Proxy', ['$SuperAgent', '$BindPromise', '$HTTP_STATUS_CODE', '$Window']));
	ns.oc.bind('$Http', ns.oc.make('Core.Http.Handler', ['$HttpProxy', '$Cache', '$CookieStorage', '$Dictionary', '$BindPromise', '$HTTP_CONFIG']));

	//Sockets
	ns.oc.bind('$SocketFactory', ns.Core.Socket.Factory, [ns.oc.get('$Window').getWebSocket()]);
	ns.oc.bind('$SocketParser', ns.Core.Socket.Parser, []);
	ns.oc.bind('$SocketProxy', ns.Core.Socket.Proxy, ['$Dispatcher', '$SocketFactory', '$SocketParser', '$SOCKET_CONFIG', '$SECURE']);

	//*************END CORE****************

};
