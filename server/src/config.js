import dotenv from 'dotenv'

dotenv.config()

export default {
  http: {
    prefix: process.env.HTTP_PREFIX || ''
  },
  meting: {
    url: process.env.METING_URL || '',
    api: process.env.METING_API || '', // upstream php api
    token: process.env.METING_TOKEN || 'token'
  }
}
