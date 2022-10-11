#!/usr/bin/env node

import oclif, { run } from '@oclif/core'
import flush from '@oclif/core/flush'
// @ts-expect-error no declaration file
import handle from '@oclif/core/handle'

const path = require('path')
const project = path.join(__dirname, '..', 'tsconfig.json')

// In dev mode -> use ts-node and dev plugins
process.env.NODE_ENV = 'development'

require('ts-node').register({ project })

// In dev mode, always show stack traces
oclif.settings.debug = true

// Start the CLI
run().then(flush).catch(handle)
