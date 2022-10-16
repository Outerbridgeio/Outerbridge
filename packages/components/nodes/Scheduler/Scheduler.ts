import { ICommonObject, ICronJobs, INode, INodeData, INodeParams, NodeType } from '../../src/Interface'
import { CronJob } from 'cron'
import { returnNodeExecutionData } from '../../src/utils'
import EventEmitter from 'events'

interface IScheduleTimes {
    mode: string
    timezone: string
    hour?: number
    minute?: number
    dayOfMonth?: number
    weekday: string
    value?: number
    unit?: string
}

class Scheduler extends EventEmitter implements INode {
    label: string
    name: string
    type: NodeType
    description?: string
    version: number
    icon?: string
    incoming: number
    outgoing: number
    inputParameters?: INodeParams[]
    cronJobs: ICronJobs

    constructor() {
        super()
        this.label = 'Scheduler'
        this.name = 'scheduler'
        this.icon = 'scheduler.svg'
        this.type = 'trigger'
        this.version = 1.0
        this.description = 'Start workflow at scheduled times'
        this.incoming = 0
        this.outgoing = 1
        this.cronJobs = {}
        this.inputParameters = [
            {
                label: 'Schedules',
                name: 'scheduleTimes',
                type: 'array',
                array: [
                    {
                        label: 'Mode',
                        name: 'mode',
                        type: 'options',
                        options: [
                            {
                                label: 'Every Day',
                                name: 'everyDay'
                            },
                            {
                                label: 'Every Week',
                                name: 'everyWeek'
                            },
                            {
                                label: 'Every Month',
                                name: 'everyMonth'
                            },
                            {
                                label: 'Every X',
                                name: 'everyX'
                            }
                        ],
                        default: 'everyDay'
                    },
                    {
                        label: 'Hour',
                        name: 'hour',
                        type: 'number',
                        hide: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyX']
                        },
                        default: new Date().getHours(),
                        description: '[24H Format] Scheduled hour to trigger workflow'
                    },
                    {
                        label: 'Minute',
                        name: 'minute',
                        type: 'number',
                        hide: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyX']
                        },
                        default: new Date().getMinutes(),
                        description: '[0 - 59] Scheduled minute to trigger workflow'
                    },
                    {
                        label: 'Day of Month',
                        name: 'dayOfMonth',
                        type: 'number',
                        show: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyMonth']
                        },
                        default: new Date().getDate(),
                        description: '[1 - 31] Scheduled day to trigger workflow'
                    },
                    {
                        label: 'Weekday',
                        name: 'weekday',
                        type: 'options',
                        show: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyWeek']
                        },
                        options: [
                            {
                                label: 'Monday',
                                name: '1'
                            },
                            {
                                label: 'Tuesday',
                                name: '2'
                            },
                            {
                                label: 'Wednesday',
                                name: '3'
                            },
                            {
                                label: 'Thursday',
                                name: '4'
                            },
                            {
                                label: 'Friday',
                                name: '5'
                            },
                            {
                                label: 'Saturday',
                                name: '6'
                            },
                            {
                                label: 'Sunday',
                                name: '0'
                            }
                        ],
                        default: new Date().getDay().toString(),
                        description: 'Scheduled weekday to trigger workflow'
                    },
                    {
                        label: 'Value',
                        name: 'value',
                        type: 'number',
                        show: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyX']
                        },
                        default: 1,
                        description: 'Scheduled X seconds/minutes/hours to trigger workflow'
                    },
                    {
                        label: 'Unit',
                        name: 'unit',
                        type: 'options',
                        show: {
                            'inputParameters.scheduleTimes[$index].mode': ['everyX']
                        },
                        options: [
                            {
                                label: 'Seconds',
                                name: 'seconds'
                            },
                            {
                                label: 'Minutes',
                                name: 'minutes'
                            },
                            {
                                label: 'Hours',
                                name: 'hours'
                            }
                        ],
                        default: 'hours',
                        description: 'Units of scheduled X seconds / minutes / hours'
                    }
                ]
            }
        ]
    }

    async runTrigger(nodeData: INodeData): Promise<void> {
        const inputParametersData = nodeData.inputParameters

        if (inputParametersData === undefined) {
            throw new Error('Required data missing')
        }

        const scheduleTimes = inputParametersData.scheduleTimes as unknown as IScheduleTimes[]

        const cronTimes: string[] = []

        for (const scheduleItem of scheduleTimes) {
            if (scheduleItem.mode === 'everyX') {
                if (scheduleItem.unit === 'seconds') {
                    // Every X seconds
                    cronTimes.push(`*/${scheduleItem.value} * * * * *`)
                } else if (scheduleItem.unit === 'minutes') {
                    // Every X minutes
                    cronTimes.push(`*/${scheduleItem.value} * * * *`)
                } else if (scheduleItem.unit === 'hours') {
                    // At 0 minutes past the hour, every X hours
                    cronTimes.push(`0 */${scheduleItem.value} * * *`)
                }
            }

            if (scheduleItem.mode === 'everyDay') {
                const minute = scheduleItem.minute || '0'
                const hour = scheduleItem.hour || '0'
                // At XX:XX AM/PM, every days
                cronTimes.push(`${minute} ${hour} */ * *`)
            }

            if (scheduleItem.mode === 'everyWeek') {
                const minute = scheduleItem.minute || '0'
                const hour = scheduleItem.hour || '0'
                const weekday = scheduleItem.weekday || '0'
                // At XX:XX AM/PM, only on Monday/Tuesday...
                cronTimes.push(`${minute} ${hour} * * ${weekday}`)
            }

            if (scheduleItem.mode === 'everyMonth') {
                const minute = scheduleItem.minute || '0'
                const hour = scheduleItem.hour || '0'
                const dayOfMonth = scheduleItem.dayOfMonth || '0'
                // At XX:XX AM/PM, on day X of the month
                cronTimes.push(`${minute} ${hour} ${dayOfMonth} * *`)
            }
        }

        const emitEventKey = nodeData.emitEventKey as string

        // The function to fire at the specified time
        const onTick = () => {
            const returnData: ICommonObject[] = []
            returnData.push({
                date: new Date().toDateString(),
                time: new Date().toTimeString(),
                cron: 'SUCCESS'
            })
            this.emit(emitEventKey, returnNodeExecutionData(returnData))
        }

        // Start the cron-jobs
        if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
            for (const cronTime of cronTimes) {
                // Automatically start the cron job
                this.cronJobs[emitEventKey].push(new CronJob(cronTime, onTick, undefined, true))
            }
        } else {
            for (const cronTime of cronTimes) {
                // Automatically start the cron job
                this.cronJobs[emitEventKey] = [new CronJob(cronTime, onTick, undefined, true)]
            }
        }
    }

    async removeTrigger(nodeData: INodeData): Promise<void> {
        const emitEventKey = nodeData.emitEventKey as string

        if (Object.prototype.hasOwnProperty.call(this.cronJobs, emitEventKey)) {
            const cronJobs = this.cronJobs[emitEventKey]
            for (const cronJob of cronJobs) {
                cronJob.stop()
            }
            this.removeAllListeners(emitEventKey)
        }
    }
}

module.exports = { nodeClass: Scheduler }
