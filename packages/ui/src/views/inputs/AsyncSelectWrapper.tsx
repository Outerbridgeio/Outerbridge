import { useState, useEffect, ComponentProps } from 'react'
import { TooltipWithParser } from 'ui-component'
import { useTheme } from 'themes'
import { NodeData } from 'utils'
// material-ui
import { Typography, Stack } from '@mui/material'

// project imports
import { OptionParamsResponse } from './OptionParamsResponse'

// third party
import lodash from 'lodash'
import AsyncSelect from 'react-select/async'
import { StylesConfig, GroupBase, SingleValue } from 'react-select'
import { AsyncAdditionalProps } from 'react-select/dist/declarations/src/useAsync'
import axios from 'axios'

// icons
import { IconX } from '@tabler/icons'

// Constant
import { baseURL } from 'store/constant'

// ==============================|| ASYNC SELECT WRAPPER ||============================== //

type Option = {
    name: string
    label: string
    description: string
    inputParameters: string
    exampleParameters: string
    exampleResponse: string
    hide: Record<string, unknown>
    show: Record<string, unknown>
}

export const AsyncSelectWrapper = ({
    title,
    description,
    value,
    loadMethod,
    loadFromDbCollections,
    nodeFlowData,
    error,
    onChange,
    onMenuOpen,
    onSetError
}: {
    title: string
    description: string
    value: string
    loadMethod: string
    loadFromDbCollections: unknown[]
    nodeFlowData: NodeData
    error: string
    onChange: (value: SingleValue<Option>) => void
    onMenuOpen: ComponentProps<typeof AsyncSelect>['onMenuOpen']
    onSetError: (...args: any) => void
}) => {
    const theme = useTheme()

    const customStyles: StylesConfig<Option, false, GroupBase<Option>> = {
        option: (provided, state) => ({
            ...provided,
            paddingTop: 15,
            paddingBottom: 15,
            paddingLeft: 20,
            paddingRight: 20,
            cursor: 'pointer',
            fontWeight: '500',
            backgroundColor: state.isSelected ? theme.palette.primary.light : '',
            color: 'black',
            '&:hover': {
                backgroundColor: theme.palette.grey['200']
            }
        }),
        control: (provided) => ({
            ...provided,
            cursor: 'text',
            backgroundColor: '#fafafa',
            paddingTop: 8,
            paddingBottom: 8,
            paddingRight: 6,
            paddingLeft: 6,
            borderRadius: 12,
            '&:hover': {
                borderColor: theme.palette.grey['700']
            }
        }),
        singleValue: (provided) => ({
            ...provided,
            fontWeight: '600'
        }),
        menuList: (provided) => ({
            ...provided,
            boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)',
            borderRadius: '10px'
        })
    }

    const [asyncOptions, setAsyncOptions] = useState<Option[]>([])

    const getSelectedValue = (value: string) => asyncOptions.find((option) => option.name === value)

    const formatErrorMessage = (error: string) => {
        if (error) return `*${error.replace(/["]/g, '')}`
        return ''
    }

    const showHideOptions = (options: Option[]) => {
        let returnOptions = options
        const toBeDeleteOptions: typeof options = []
        const displayTypes = ['show', 'hide'] as const

        for (let x = 0; x < displayTypes.length; x++) {
            const displayType = displayTypes[x]!

            for (let i = 0; i < returnOptions.length; i++) {
                const option = returnOptions[i]!
                const displayOptions = option[displayType]

                if (displayOptions) {
                    Object.keys(displayOptions).forEach((path) => {
                        const comparisonValue = displayOptions[path]
                        const groundValue = lodash.get(nodeFlowData, path, '')

                        if (Array.isArray(comparisonValue)) {
                            if (displayType === 'show' && !comparisonValue.includes(groundValue)) {
                                toBeDeleteOptions.push(option)
                            }
                            if (displayType === 'hide' && comparisonValue.includes(groundValue)) {
                                toBeDeleteOptions.push(option)
                            }
                        } else if (typeof comparisonValue === 'string') {
                            if (
                                displayType === 'show' &&
                                !(comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue))
                            ) {
                                toBeDeleteOptions.push(option)
                            }
                            if (
                                displayType === 'hide' &&
                                (comparisonValue === groundValue || new RegExp(comparisonValue).test(groundValue))
                            ) {
                                toBeDeleteOptions.push(option)
                            }
                        }
                    })
                }
            }
        }

        for (let i = 0; i < toBeDeleteOptions.length; i++) {
            returnOptions = returnOptions.filter((opt) => JSON.stringify(opt) !== JSON.stringify(toBeDeleteOptions[i]))
        }

        return returnOptions
    }

    const loadOptions: AsyncAdditionalProps<Option, GroupBase<Option>>['loadOptions'] = (inputValue, callback) => {
        axios
            .post(`${baseURL}/api/v1/node-load-method/${nodeFlowData.name}`, { ...nodeFlowData, loadMethod, loadFromDbCollections })
            .then((response) => {
                const data: Option[] | undefined = response.data
                const filteredOption = (data || []).filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()))
                const options = showHideOptions(filteredOption)
                setAsyncOptions(options)
                callback(options)
            })
    }

    const formatOptionLabel = (
        { label, description }: { label: string; description: string },
        { context }: { context: 'menu' | 'value' }
    ) => (
        <>
            {context === 'menu' && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>{label}</div>
                    {description && <span style={{ fontWeight: 400, paddingTop: 10, paddingBottom: 10 }}>{description}</span>}
                </div>
            )}
            {context === 'value' && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>{label}</div>
                </div>
            )}
        </>
    )

    useEffect(() => () => setAsyncOptions([]), [])

    useEffect(() => {
        if (value !== undefined) {
            const selectedOption = asyncOptions.find((option) => option.name === value)
            if (!selectedOption) {
                onSetError()
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [asyncOptions])

    return (
        <>
            <Stack direction='row'>
                <Typography variant='overline'>{title}</Typography>
                {description && <TooltipWithParser title={description} />}
            </Stack>
            <div style={{ position: 'relative' }}>
                <AsyncSelect<Option>
                    key={JSON.stringify(nodeFlowData)} // to reload async select whenever flowdata changed
                    styles={customStyles}
                    value={getSelectedValue(value)} // ! logic change
                    formatOptionLabel={formatOptionLabel}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.name}
                    loadOptions={loadOptions}
                    defaultOptions
                    onChange={onChange}
                    onMenuOpen={onMenuOpen}
                />
                <button
                    style={{
                        minHeight: 10,
                        height: 27,
                        width: 30,
                        backgroundColor: '#FAFAFA',
                        color: theme.palette.grey['500'],
                        position: 'absolute',
                        right: 10,
                        top: 0,
                        bottom: 0,
                        margin: 'auto',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    title='Clear Selection'
                    type='button'
                    onClick={() => onChange(null)}
                >
                    <IconX />
                </button>
            </div>
            {error && <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>{formatErrorMessage(error)}</span>}

            <OptionParamsResponse value={value} options={asyncOptions} />
        </>
    )
}
