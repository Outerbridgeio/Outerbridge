#!/usr/bin/env node

import { run, settings } from '@oclif/core'
import flush from '@oclif/core/flush'
import handle from '@oclif/core/handle'

const path = require('path')
const project = path.join(__dirname, '..', 'tsconfig.json')

// In dev mode -> use ts-node and dev plugins
process.env.NODE_ENV = 'development'

require('ts-node').register({ project })

// In dev mode, always show stack traces
settings.debug = true

// Start the CLI
run().then(flush).catch(handle)
