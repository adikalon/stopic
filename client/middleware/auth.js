export default async function (context) {
  const auth = context.req.headers.cookie.replaceAll('; ', ';').split(';').filter((cookie) => {
    return /^auth/.test(cookie)
  })[0]?.replace('auth=', '')

  if (!auth) {
    return context.redirect('/admin/login')
  }

  let url = 'http://server:3000/api/visitor/auth'

  if (process.client) {
    url = `${process.env.apiUrl}/api/visitor/auth`
  }

  try {
    await context.app.$axios.post(url, null, {
      headers: {
        Authorization: auth
      }
    })
  } catch (err) {
    return context.redirect('/admin/login')
  }
}
