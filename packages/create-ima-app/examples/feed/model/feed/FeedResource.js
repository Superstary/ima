import AbstractResource from 'app/model/AbstractResource';

/**
 * Resource for feed.
 */
export default class FeedResource extends AbstractResource {
  /**
   * @param {HttpAgent} http
   * @param {string} url API URL (Base server + api specific path.)
   * @param {FeedFactory} feedFactory
   * @param {Cache} cache
   */
  constructor(http, url, feedFactory, cache) {
    super(http, url, feedFactory, cache);
  }

  /**
   * Method returns Feed entity with list of items. These items are capsuled
   * inside this entity.
   *   - If portalId is defined, it will return data for given portal.
   *   - If AfterItemId is defined, it will returns items following this item.
   *
   * @param {CategoryEntity=} [category=null] Category entity.
   * @param {ItemEntity=} [lastItem=null] Last item entity.
   * @return {Promise<FeedEntity>} Promise of feed entity
   */
  getEntity(category = null) {
    let data = {};

    if (category) {
      data.category = category.getId();
    }

    return super.getEntity(null, data);
  }
}
