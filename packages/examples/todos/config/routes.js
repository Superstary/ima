import { RouteNames } from '@ima/core';
import ErrorController from '../page/error/ErrorController';
import ErrorView from '../page/error/ErrorView';
import HomeController from '../page/home/HomeController';
import HomeView from '../page/home/HomeView';
import NotFoundController from '../page/notFound/NotFoundController';
import NotFoundView from '../page/notFound/NotFoundView';

export default (ns, oc, routesConfig, router) =>
  router
    .add('home', '/', HomeController, HomeView)
    .add('filtered', '/:filter', HomeController, HomeView)
    .add(RouteNames.ERROR, '/error', ErrorController, ErrorView)
    .add(RouteNames.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);
