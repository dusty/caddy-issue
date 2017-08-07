module.exports = (req, res) => {
  console.log('url', req.url)
  let path = req.url.replace('secure', 'private')
  console.log('path', path)
  res.setHeader('X-Accel-Redirect', path)
  res.end()
}
