#!/usr/bin/env node

import { run } from '@oclif/core'
import flush from '@oclif/core/flush'
import handle from '@oclif/core/handle'

run().then(flush).catch(handle)
