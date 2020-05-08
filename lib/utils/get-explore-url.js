/**
 * @method getExploreUrl
 * @param  {String} rawUrl raw url from req.url
 * @return {String}
 */
const getExploreUrl = (rawUrl) => {
  const regex = /\/explore\//g
  return rawUrl.replace(regex, "")
}

module.exports = getExploreUrl
