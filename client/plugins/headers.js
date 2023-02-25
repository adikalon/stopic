export default function ({ $axios, req }) {
  if (req !== undefined) {
    const host = req.headers.host || ''
    const userAgent = req.headers['user-agent'] || ''
    const forv = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const real = req.headers['x-real-ip'] || req.socket.remoteAddress

    $axios.onRequest((config) => {
      config.headers.common.host = host
      config.headers.common['user-agent'] = userAgent
      config.headers.common['x-forwarded-for'] = forv
      config.headers.common['x-real-ip'] = real
    })
  }
}
