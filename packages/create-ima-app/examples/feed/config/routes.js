import { RouteNames } from '@ima/core';
import DetailController from 'app/page/detail/DetailController';
import DetailView from 'app/page/detail/DetailView';
import ErrorController from 'app/page/error/ErrorController';
import ErrorView from 'app/page/error/ErrorView';
import HomeController from 'app/page/home/HomeController';
import HomeView from 'app/page/home/HomeView';
import NotFoundController from 'app/page/notFound/NotFoundController';
import NotFoundView from 'app/page/notFound/NotFoundView';

export default (ns, oc, routesConfig, router) =>
  router
    .add('home', '/', HomeController, HomeView)
    .add('category', '/:category', HomeController, HomeView)
    .add('post', '/:category/:itemId', DetailController, DetailView)
    .add(RouteNames.ERROR, '/error', ErrorController, ErrorView)
    .add(RouteNames.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);
