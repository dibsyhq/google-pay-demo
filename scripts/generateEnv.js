import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
const { parsed } = config()

const { DIBSY_API_SK, ...env } = parsed

const content = `window.env = ${JSON.stringify(env)}`

fs.writeFileSync(path.resolve('public/assets/js', 'env.js'), content)