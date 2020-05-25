/**
 * @method getExploreUrl
 * @param  {String} rawUrl raw url from req.url
 * @return {String}
 */
const getExploreUrl = (rawUrl) => {
  return rawUrl.substr(1)
}

module.exports = getExploreUrl
