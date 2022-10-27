import { useSelector } from 'store'
import { forwardRef, ComponentProps } from 'react'
import { useTheme } from 'themes'
import { NodeParams } from 'utils'
import { ElementOf } from 'ts-essentials'
// material-ui
import { Box, Switch, Fab, FormControl, OutlinedInput, Popper, TextField, Typography, Stack, Button } from '@mui/material'
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'
import { TooltipWithParser } from 'ui-component'

// icons
import { IconX, IconUpload } from '@tabler/icons'

// third party
import lodash from 'lodash'
import Editor from 'react-simple-code-editor'
import PerfectScrollbar from 'react-perfect-scrollbar'
// @ts-expect-error no type definition
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// utils
import { convertDateStringToDateObject, getFileName, getFolderName } from 'utils/genericHelper'

//css
import './InputParameters.css'

const StyledPopper = styled(Popper)({
    boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)',
    borderRadius: '10px',
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 10,
            margin: 10
        }
    }
})

const DateCustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: ComponentProps<'button'>['onClick'] }>(
    function DateCustomInput({ value, onClick }, ref) {
        return (
            <button
                style={{
                    backgroundColor: '#fafafa',
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingRight: 12,
                    paddingLeft: 12,
                    borderRadius: 12,
                    width: '100%',
                    height: 50,
                    border: `1px solid #BDBDBD`,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textAlign: 'start',
                    color: '#212121',
                    opacity: 0.9
                }}
                type='button'
                onClick={onClick}
                ref={ref}
            >
                {value}
            </button>
        )
    }
)

// ==============================|| ARRAY INPUT PARAMETERS ||============================== //

type Values = Record<string, unknown>
export const ArrayInputParameters = ({
    initialValues,
    arrayParams,
    paramsType,
    arrayGroupName,
    errors,
    onArrayInputChange,
    onArrayInputBlur,
    onArrayItemRemove,
    onArrayItemMouseUp,
    onEditVariableDialogOpen
}: {
    initialValues: Values[]
    arrayParams: NodeParams[][]
    paramsType: 'actions' | 'networks' | 'credentials' | 'inputParameters' | 'outputResponses'
    arrayGroupName: string
    errors?: Record<string, string>[]
    onArrayInputChange: (values: Values[]) => void
    onArrayInputBlur: (values: Values[]) => void
    onArrayItemRemove: (values: Values[]) => void
    onArrayItemMouseUp: (
        value: boolean,
        body?: {
            textBeforeCursorPosition: string
            textAfterCursorPosition: string
            path: string
            paramsType: 'actions' | 'networks' | 'credentials' | 'inputParameters' | 'outputResponses'
        }
    ) => void
    onEditVariableDialogOpen: (input: NodeParams, values: Values, index: number) => void
}) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const processUpdateValues = (inputValue: unknown, inputName: string, values: Values, index: number) => {
        const updateArrayValues = {
            ...values,
            [inputName]: inputValue
        }
        const updateInitialValues = initialValues
        updateInitialValues[index] = updateArrayValues
        return updateInitialValues
    }

    const onInputChange = (inputValue: unknown, inputName: string, values: Values, index: number) => {
        const updateInitialValues = processUpdateValues(inputValue, inputName, values, index)
        onArrayInputChange(updateInitialValues)
    }

    const onInputBlur = (inputValue: string, inputName: string, values: Values, index: number) => {
        const updateInitialValues = processUpdateValues(inputValue, inputName, values, index)
        onArrayInputBlur(updateInitialValues)
    }

    const onRemoveClick = (index: number) => {
        const updateInitialValues = initialValues
        updateInitialValues.splice(index, 1)
        onArrayItemRemove(updateInitialValues)
        onArrayItemMouseUp(false)
    }

    const onMouseUp = (e: React.FocusEvent<HTMLTextAreaElement, Element>, inputName: string, valueIndex: number) => {
        const cursorPosition = e.target.selectionEnd
        const textBeforeCursorPosition = e.target.value.substring(0, cursorPosition)
        const textAfterCursorPosition = e.target.value.substring(cursorPosition, e.target.value.length)
        const path = `${paramsType}.${arrayGroupName}[${valueIndex}].${inputName}`
        const body = {
            textBeforeCursorPosition,
            textAfterCursorPosition,
            path,
            paramsType
        }
        onArrayItemMouseUp(true, body)
    }

    const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>, values: Values, inputName: string, index: number) => {
        if (!e.target.files) return
        const files = e.target.files
        const reader = new FileReader()

        function readFile(fileIndex: number, base64Array: string[]) {
            if (fileIndex >= files.length) {
                onInputChange(JSON.stringify(base64Array), inputName, values, index)
                return
            }
            const file = files[fileIndex]!
            reader.onload = (evt) => {
                if (!evt?.target?.result) {
                    return
                }
                const { result } = evt.target
                const value = result + `,filepath:${file.webkitRelativePath}`
                base64Array.push(value)
                readFile(fileIndex + 1, lodash.cloneDeep(base64Array))
            }
            reader.readAsDataURL(file)
        }
        readFile(0, [])
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, values: Values, inputName: string, index: number) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }
        const { name } = file

        const reader = new FileReader()
        reader.onload = (evt) => {
            if (!evt?.target?.result) {
                return
            }
            const { result } = evt.target
            const value = result + `,filename:${name}`
            onInputChange(value, inputName, values, index)
        }
        reader.readAsDataURL(file)
    }

    const findMatchingOptions = (options: NodeParams['options'], value: string | null | undefined) =>
        options?.find((option) => option.name === value)

    const getDefaultOptionValue = () => ''

    return (
        <>
            {arrayParams.map((_, index) => {
                const params = arrayParams[index] || []
                const values = initialValues[index] || {}

                return (
                    <Box
                        sx={{
                            p: 2,
                            mb: 2,
                            backgroundColor: theme.palette.secondary.light,
                            borderRadius: `${customization.borderRadius}px`,
                            position: 'relative'
                        }}
                        key={index}
                    >
                        {arrayParams.length > 1 && (
                            <Fab
                                sx={{
                                    minHeight: 30,
                                    height: 30,
                                    width: 30,
                                    backgroundColor: theme.palette.secondary.light,
                                    color: theme.palette.secondary.main,
                                    position: 'absolute',
                                    right: -10,
                                    top: -10
                                }}
                                size='small'
                                onClick={() => onRemoveClick(index)}
                            >
                                <IconX />
                            </Fab>
                        )}

                        {params.map((input, paramIndex) => {
                            if (input.type === 'file' || input.type === 'folder') {
                                const inputName = input.name
                                const name = values[inputName]

                                return (
                                    <FormControl
                                        key={`${inputName}_${paramIndex}`}
                                        fullWidth
                                        sx={{ mb: 1, mt: 1 }}
                                        error={!!errors?.[index]?.[inputName]}
                                    >
                                        <Stack direction='row'>
                                            <Typography variant='overline'>{input.label}</Typography>
                                            {input.description && <TooltipWithParser title={input.description} />}
                                        </Stack>

                                        {input.type === 'file' && (
                                            <span
                                                style={{
                                                    fontWeight: 'bold',
                                                    color: theme.palette.grey['800'],
                                                    marginBottom: '1rem'
                                                }}
                                            >
                                                {name ? getFileName(name as string) : 'Choose a file to upload'}
                                            </span>
                                        )}

                                        {input.type === 'folder' && (
                                            <span
                                                style={{
                                                    fontWeight: 'bold',
                                                    color: theme.palette.grey['800'],
                                                    marginBottom: '1rem'
                                                }}
                                            >
                                                {name ? getFolderName(name as string) : 'Choose a folder to upload'}
                                            </span>
                                        )}

                                        <Button
                                            variant='outlined'
                                            component='label'
                                            fullWidth
                                            startIcon={<IconUpload />}
                                            sx={{ marginRight: '1rem' }}
                                        >
                                            {input.type === 'folder' ? 'Upload Folder' : 'Upload File'}
                                            {input.type === 'file' && (
                                                <input type='file' hidden onChange={(e) => handleFileUpload(e, values, inputName, index)} />
                                            )}
                                            {input.type === 'folder' && (
                                                <input
                                                    type='file'
                                                    // https://github.com/jsx-eslint/eslint-plugin-react/issues/3454
                                                    /* eslint-disable react/no-unknown-property */
                                                    // @ts-expect-error https://stackoverflow.com/a/73734709/5338829
                                                    directory=''
                                                    /* eslint-enable react/no-unknown-property */
                                                    webkitdirectory=''
                                                    hidden
                                                    onChange={(e) => handleFolderUpload(e, values, inputName, index)}
                                                />
                                            )}
                                        </Button>
                                    </FormControl>
                                )
                            }

                            if (input.type === 'json' || input.type === 'code') {
                                const inputName = input.name

                                return (
                                    <FormControl
                                        key={`${inputName}_${paramIndex}`}
                                        fullWidth
                                        sx={{ mb: 1, mt: 1 }}
                                        error={!!errors?.[index]?.[inputName]}
                                    >
                                        <Stack sx={{ position: 'relative' }} direction='row'>
                                            <Typography variant='overline'>{input.label}</Typography>
                                            {input.description && <TooltipWithParser title={input.description} />}
                                            <Button
                                                sx={{
                                                    position: 'absolute',
                                                    fontSize: '0.6875rem',
                                                    right: 0,
                                                    top: 5,
                                                    height: 25,
                                                    width: 'max-content'
                                                }}
                                                variant='outlined'
                                                onClick={() => onEditVariableDialogOpen(input, values, index)}
                                            >
                                                Edit Variables
                                            </Button>
                                        </Stack>
                                        <PerfectScrollbar
                                            style={{
                                                border: '1px solid',
                                                borderColor: theme.palette.grey['500'],
                                                borderRadius: '12px',
                                                height: '200px',
                                                maxHeight: '200px',
                                                overflowX: 'hidden',
                                                backgroundColor: 'white'
                                            }}
                                            onScroll={(e) => e.stopPropagation()}
                                        >
                                            <Editor
                                                placeholder={input.placeholder}
                                                value={(values[inputName] as string) || ''}
                                                onBlur={(e) => {
                                                    onInputBlur(
                                                        (e as React.FocusEvent<HTMLTextAreaElement, Element>).target.value,
                                                        inputName,
                                                        values,
                                                        index
                                                    )
                                                    onMouseUp(e as React.FocusEvent<HTMLTextAreaElement, Element>, inputName, index)
                                                }}
                                                onValueChange={(code) => onInputChange(code, inputName, values, index)}
                                                onMouseUp={(e) =>
                                                    onMouseUp(
                                                        // @ts-expect-error TODO
                                                        e,
                                                        inputName,
                                                        index
                                                    )
                                                }
                                                highlight={(code) => highlight(code, input.type === 'json' ? languages.json : languages.js)}
                                                padding={10}
                                                style={{
                                                    fontSize: '0.875rem',
                                                    minHeight: '200px',
                                                    width: '100%'
                                                }}
                                                textareaClassName='editor__textarea'
                                            />
                                        </PerfectScrollbar>
                                    </FormControl>
                                )
                            }

                            if (input.type === 'date') {
                                const inputName = input.name

                                return (
                                    <FormControl
                                        key={`${inputName}_${paramIndex}`}
                                        fullWidth
                                        sx={{ mb: 1, mt: 1 }}
                                        error={!!errors?.[index]?.[inputName]}
                                    >
                                        <Stack direction='row'>
                                            <Typography variant='overline'>{input.label}</Typography>
                                            {input.description && <TooltipWithParser title={input.description} />}
                                        </Stack>
                                        <DatePicker
                                            customInput={<DateCustomInput />}
                                            selected={convertDateStringToDateObject(values[inputName] as string) || null}
                                            showTimeSelect
                                            isClearable
                                            timeInputLabel='Time:'
                                            dateFormat='MM/dd/yyyy h:mm aa'
                                            onChange={(date) => {
                                                const inputValue = date ? date.toISOString() : null
                                                onInputChange(inputValue, inputName, values, index)
                                                onArrayItemMouseUp(false)
                                            }}
                                        />
                                    </FormControl>
                                )
                            }

                            if (input.type === 'string' || input.type === 'password' || input.type === 'number') {
                                const inputName = input.name

                                return (
                                    <FormControl
                                        key={`${inputName}_${paramIndex}`}
                                        fullWidth
                                        sx={{ mb: 1, mt: 1 }}
                                        error={!!errors?.[index]?.[inputName]}
                                    >
                                        <Stack sx={{ position: 'relative' }} direction='row'>
                                            <Typography variant='overline'>{input.label}</Typography>
                                            {input.description && <TooltipWithParser title={input.description} />}
                                            {(input.type === 'string' || input.type === 'number') && (
                                                <Button
                                                    sx={{
                                                        position: 'absolute',
                                                        fontSize: '0.6875rem',
                                                        right: 0,
                                                        top: 5,
                                                        height: 25,
                                                        width: 'max-content'
                                                    }}
                                                    variant='outlined'
                                                    onClick={() => onEditVariableDialogOpen(input, values, index)}
                                                >
                                                    Edit Variables
                                                </Button>
                                            )}
                                        </Stack>
                                        <OutlinedInput
                                            id={inputName}
                                            type={input.type === 'string' || input.type === 'number' ? 'text' : input.type}
                                            value={values[inputName] || ''}
                                            placeholder={input.placeholder}
                                            name={inputName}
                                            onBlur={(e) => {
                                                const inputValue = e.target.value
                                                onInputBlur(inputValue, inputName, values, index)
                                                onMouseUp(e as React.FocusEvent<HTMLTextAreaElement, Element>, inputName, index)
                                            }}
                                            onChange={(e) => {
                                                const inputValue = e.target.value
                                                onInputChange(inputValue, inputName, values, index)
                                            }}
                                            onMouseUp={(e) =>
                                                onMouseUp(
                                                    // @ts-expect-error TODO
                                                    e,
                                                    inputName,
                                                    index
                                                )
                                            }
                                        />
                                    </FormControl>
                                )
                            }

                            if (input.type === 'boolean') {
                                const inputName = input.name

                                return (
                                    <FormControl
                                        key={`${inputName}_${paramIndex}`}
                                        fullWidth
                                        sx={{ mb: 1, mt: 1 }}
                                        error={!!errors?.[index]?.[inputName]}
                                    >
                                        <Stack direction='row'>
                                            <Typography variant='overline'>{input.label}</Typography>
                                            {input.description && <TooltipWithParser title={input.description} />}
                                        </Stack>
                                        <Switch
                                            checked={!!values[inputName]}
                                            onChange={(event) => {
                                                onInputChange(event.target.checked, inputName, values, index)
                                            }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    </FormControl>
                                )
                            }

                            if (input.type === 'options') {
                                const inputName = input.name
                                const availableOptions = input.options || []

                                return (
                                    <FormControl key={`${inputName}_${paramIndex}`} fullWidth sx={{ mb: 1, mt: 1 }}>
                                        <Stack direction='row'>
                                            <Typography variant='overline'>{input.label}</Typography>
                                            {input.description && <TooltipWithParser title={input.description} />}
                                        </Stack>
                                        <Autocomplete
                                            id={inputName}
                                            freeSolo
                                            onOpen={() => onArrayItemMouseUp(false)}
                                            options={availableOptions}
                                            value={
                                                findMatchingOptions(availableOptions, values[inputName] as string) ||
                                                getDefaultOptionValue()
                                            }
                                            onChange={(e, selection) => {
                                                const value = selection
                                                    ? (selection as ElementOf<NonNullable<NodeParams['options']>>).name
                                                    : ''
                                                onInputBlur(value, inputName, values, index)
                                            }}
                                            PopperComponent={StyledPopper}
                                            renderInput={(params) => (
                                                <TextField {...params} value={values[inputName]} error={!!errors?.[index]?.[inputName]} />
                                            )}
                                            renderOption={(props, option) => (
                                                <Box component='li' {...props}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <Typography sx={{ p: 1 }} variant='h5'>
                                                            {option.label}
                                                        </Typography>
                                                        {option.description && <Typography sx={{ p: 1 }}>{option.description}</Typography>}
                                                    </div>
                                                </Box>
                                            )}
                                        />
                                    </FormControl>
                                )
                            }
                            return null
                        })}
                    </Box>
                )
            })}
        </>
    )
}
