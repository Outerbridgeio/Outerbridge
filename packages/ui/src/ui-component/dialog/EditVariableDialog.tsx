import { createPortal } from 'react-dom'
import { useState, useEffect, SyntheticEvent, ComponentProps } from 'react'
import { useTheme } from 'themes'
import { Node } from 'utils'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Box,
    List,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import ReactJson, { OnCopyProps } from 'react-json-view'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { IconArrowsMaximize } from '@tabler/icons'
import { ExpandDataDialog, Input, ExpandDialogProps } from './ExpandDataDialog'
import Editor from 'react-simple-code-editor'
// @ts-expect-error no declaration file
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism.css'

import './EditVariableDialog.css'

const isPositiveNumeric = (value: string | null | undefined) => /^\d+$/.test(`${value}`)

export const EditVariableDialog = ({
    show,
    dialogProps,
    onCancel,
    onConfirm
}: {
    show: boolean
    dialogProps: {
        values: Record<string, string>
        input: Input
        confirmButtonName: string
        cancelButtonName: string
        hideVariables?: boolean
        availableNodesForVariable?: Node[]
        arrayItemBody: {
            arrayItemValues: Record<string, string>
            arrayItemInput: Input
            arrayItemIndex: number
            initialValues: Record<string, unknown>
        }
    }
    onCancel: ComponentProps<typeof Button>['onClick']
    onConfirm: (value: Record<string, unknown>) => void
}) => {
    const portalElement = document.getElementById('portal')!

    const theme = useTheme()

    const [inputValue, setInputValue] = useState('')
    const [input, setInput] = useState<Input | null>(null)
    const [expanded, setExpanded] = useState<string | false>(false)
    const [showExpandDialog, setShowExpandDialog] = useState(false)
    const [expandDialogProps, setExpandDialogProps] = useState<ExpandDialogProps | null>(null) // ! logic changed
    const [copiedVariableBody, setCopiedVariableBody] = useState<{ textBeforeCursorPosition?: string; textAfterCursorPosition?: string }>(
        {}
    )
    const [languageType, setLanguageType] = useState(languages.js)

    const handleAccordionChange = (nodeLabel: string) => (event: SyntheticEvent<Element, Event>, isExpanded: boolean) => {
        setExpanded(isExpanded ? nodeLabel : false)
    }

    const onExpandDialogClicked = (data: object, node: Node) => {
        const dialogProp = {
            title: `Variable Data: ${node.data.label}`,
            data,
            node
        }
        setExpandDialogProps(dialogProp)
        setShowExpandDialog(true)
    }

    const onMouseUp = (
        e:
            | React.MouseEvent<HTMLDivElement, MouseEvent>
            | (React.FocusEvent<HTMLDivElement, Element> | React.FocusEvent<HTMLTextAreaElement, Element>)
    ) => {
        const selectionEnd: number | undefined = (e.target as EventTarget & HTMLTextAreaElement).selectionEnd
        const value: string | undefined = (e.target as EventTarget & HTMLTextAreaElement).value
        if (e.target && selectionEnd && (e.target as EventTarget & HTMLTextAreaElement).value) {
            const cursorPosition = selectionEnd
            const textBeforeCursorPosition = value.substring(0, cursorPosition)
            const textAfterCursorPosition = value.substring(cursorPosition, value.length)
            const body = {
                textBeforeCursorPosition,
                textAfterCursorPosition
            }
            setCopiedVariableBody(body)
        } else {
            setCopiedVariableBody({})
        }
    }

    const onClipboardCopy = (e: OnCopyProps, node: Node) => {
        const namespaces = e.namespace
        let returnVariablePath = `${node.id}`
        for (let i = 0; i < namespaces.length; i += 1) {
            const namespace = namespaces[i]
            if (namespace !== 'root') {
                if (isPositiveNumeric(namespace)) {
                    if (returnVariablePath.endsWith('.')) {
                        returnVariablePath = returnVariablePath.substring(0, returnVariablePath.length - 1)
                    }
                    returnVariablePath += `[${namespace}]`
                } else {
                    returnVariablePath += namespace
                }
                if (i !== namespaces.length - 1) {
                    returnVariablePath += '.'
                }
            }
        }
        if (copiedVariableBody) {
            let newInput = ''
            if (copiedVariableBody.textBeforeCursorPosition === undefined && copiedVariableBody.textAfterCursorPosition === undefined)
                newInput = `${inputValue}${`{{${returnVariablePath}}}`}`
            else
                newInput = `${copiedVariableBody.textBeforeCursorPosition}{{${returnVariablePath}}}${copiedVariableBody.textAfterCursorPosition}`
            setInputValue(newInput)
        }
    }

    const onSave = (value: string) => {
        // ArrayInputParameter
        if (dialogProps.arrayItemBody) {
            const updateArrayValues = {
                ...dialogProps.arrayItemBody.arrayItemValues,
                [dialogProps.arrayItemBody.arrayItemInput.name]: value
            }
            const updateInitialValues = dialogProps.arrayItemBody.initialValues
            updateInitialValues[dialogProps.arrayItemBody.arrayItemIndex] = updateArrayValues
            const updateValues = {
                ...dialogProps.values,
                [dialogProps.input.name]: updateInitialValues
            }
            onConfirm(updateValues)
        } else {
            // InputParameter
            const updateValues = {
                ...dialogProps.values,
                [dialogProps.input.name]: value,
                submit: null
            }
            onConfirm(updateValues)
        }
    }

    // Handle Accordian
    useEffect(() => {
        if (dialogProps.values && dialogProps.input) {
            let inputValues = dialogProps.values
            let input = dialogProps.input
            if (dialogProps.arrayItemBody) {
                inputValues = dialogProps.arrayItemBody.arrayItemValues
                input = dialogProps.arrayItemBody.arrayItemInput
            }
            setInput(input)
            setInputValue(inputValues[input.name]?.toString() || '')
            if (input.type === 'json' || input.type === 'string' || input.type === 'number') setLanguageType(languages.json)
            if (input.type === 'code') setLanguageType(languages.js)
        }
    }, [dialogProps])

    const component = show ? (
        <Dialog open={show} fullWidth maxWidth='lg' aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
            <DialogContent>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {input && (input.type === 'json' || input.type === 'string' || input.type === 'number' || input.type === 'code') && (
                        <div style={{ flex: 1 }}>
                            <Typography sx={{ mb: 2, ml: 1 }} variant='h4'>
                                Input
                            </Typography>
                            <PerfectScrollbar
                                style={{
                                    border: '1px solid',
                                    borderColor: theme.palette.grey['500'],
                                    borderRadius: '12px',
                                    height: '100%',
                                    maxHeight: 'calc(100vh - 220px)',
                                    overflowX: 'hidden',
                                    backgroundColor: 'white'
                                }}
                            >
                                <Editor
                                    value={inputValue}
                                    onValueChange={(code) => setInputValue(code)}
                                    placeholder={input.placeholder}
                                    highlight={(code) => highlight(code, languageType)}
                                    onMouseUp={(e) => onMouseUp(e)}
                                    onBlur={(e) => onMouseUp(e)}
                                    padding={10}
                                    style={{
                                        fontSize: '0.875rem',
                                        minHeight: 'calc(100vh - 220px)',
                                        width: '100%'
                                    }}
                                    textareaClassName='editor__textarea'
                                />
                            </PerfectScrollbar>
                        </div>
                    )}
                    {!dialogProps.hideVariables && (
                        <div style={{ flex: 1 }}>
                            <Typography sx={{ mb: 2, ml: 2 }} variant='h4'>
                                Variables
                            </Typography>
                            {dialogProps.availableNodesForVariable?.length === 0 && (
                                <div style={{ padding: 10, marginLeft: 10 }}>
                                    <span>No Variables. Try connect to other nodes. </span>
                                </div>
                            )}
                            {/* ! logic changed */}
                            {(dialogProps.availableNodesForVariable || { length: 0 }).length > 0 && (
                                <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 220px)', overflowX: 'hidden' }}>
                                    <Box sx={{ pl: 2, pr: 2 }}>
                                        <List
                                            sx={{
                                                width: '100%',
                                                py: 0,
                                                borderRadius: '10px',
                                                [theme.breakpoints.down('md')]: {
                                                    maxWidth: 300
                                                },
                                                '& .MuiListItemSecondaryAction-root': {
                                                    top: 22
                                                },
                                                '& .MuiDivider-root': {
                                                    my: 0
                                                },
                                                '& .list-container': {
                                                    pl: 7
                                                }
                                            }}
                                        >
                                            {dialogProps.availableNodesForVariable?.map((node, index) => (
                                                <Box key={index}>
                                                    <Accordion
                                                        expanded={expanded === node.data.label}
                                                        onChange={handleAccordionChange(node.data.label)}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMore />}
                                                            aria-controls={`${node.data.label}-content`}
                                                            id={`${node.data.label}-header`}
                                                        >
                                                            <Typography variant='h5'>{node.data.label}</Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <div style={{ position: 'relative' }}>
                                                                <ReactJson
                                                                    collapsed
                                                                    src={node.data.outputResponses?.output || {}}
                                                                    enableClipboard={(e) => onClipboardCopy(e, node)}
                                                                />
                                                                <IconButton
                                                                    size='small'
                                                                    sx={{
                                                                        height: 25,
                                                                        width: 25,
                                                                        position: 'absolute',
                                                                        top: -5,
                                                                        right: 5
                                                                    }}
                                                                    title='Expand Variable'
                                                                    color='primary'
                                                                    onClick={() =>
                                                                        onExpandDialogClicked(node.data.outputResponses?.output || {}, node)
                                                                    }
                                                                >
                                                                    <IconArrowsMaximize />
                                                                </IconButton>
                                                            </div>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </Box>
                                            ))}
                                        </List>
                                    </Box>
                                </PerfectScrollbar>
                            )}
                        </div>
                    )}
                    {expandDialogProps && (
                        <ExpandDataDialog
                            enableClipboard
                            show={showExpandDialog}
                            dialogProps={expandDialogProps}
                            onCancel={() => setShowExpandDialog(false)}
                            onCopyClick={(e, node) => {
                                onClipboardCopy(e, node)
                                setShowExpandDialog(false)
                            }}
                        />
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{dialogProps.cancelButtonName}</Button>
                <Button variant='contained' onClick={() => onSave(inputValue)}>
                    {dialogProps.confirmButtonName}
                </Button>
            </DialogActions>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}
