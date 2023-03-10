import PropTypes from 'prop-types'
import { Handle, Position } from 'reactflow'
import { useSelector } from 'react-redux'
// material-ui
import { styled, useTheme } from '@mui/material/styles'
import { Avatar, Box, Typography } from '@mui/material'

// project imports
import MainCard from 'ui-component/cards/MainCard'

// icons
import { IconCheck, IconExclamationMark } from '@tabler/icons'

// const
import { baseURL } from 'store/constant'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: '#ffffff',
    border: 'solid 1px',
    color: theme.darkTextPrimary,
    width: '200px',
    height: 'auto',
    padding: '10px',
    boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
    '&:hover': {
        borderColor: theme.palette.primary.main
    }
}))

const handlerPosition = [[['50%']], [['30%'], ['70%']]]

// ===========================|| CANVAS NODE ||=========================== //

const CanvasNode = ({ data }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    return (
        <>
            <CardWrapper
                content={false}
                sx={{
                    borderColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary
                }}
                border={false}
            >
                {data && data.outputResponses && data.outputResponses.submit && (
                    <Avatar
                        variant='rounded'
                        sx={{
                            ...theme.typography.smallAvatar,
                            borderRadius: '50%',
                            background: theme.palette.success.dark,
                            color: 'white',
                            ml: 2,
                            position: 'absolute',
                            top: -10,
                            right: -10
                        }}
                    >
                        <IconCheck />
                    </Avatar>
                )}

                {data && data.outputResponses && data.outputResponses.needRetest && (
                    <Avatar
                        variant='rounded'
                        sx={{
                            ...theme.typography.smallAvatar,
                            borderRadius: '50%',
                            background: theme.palette.warning.dark,
                            color: 'white',
                            ml: 2,
                            position: 'absolute',
                            top: -10,
                            right: -10
                        }}
                    >
                        <IconExclamationMark />
                    </Avatar>
                )}

                <Box>
                    {data.inputAnchors.map((inputAnchor, index) => (
                        <Handle
                            type='target'
                            position={customization.isHorizontal ? Position.Top : Position.Left}
                            key={inputAnchor.id}
                            id={inputAnchor.id}
                            style={{
                                height: 15,
                                width: 15,
                                top: customization.isHorizontal ? -7.5 : null,
                                backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                left: customization.isHorizontal ? handlerPosition[data.inputAnchors.length - 1][index] : null,
                                bottom: !customization.isHorizontal ? handlerPosition[data.inputAnchors.length - 1][index] : null
                            }}
                        />
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Box item style={{ width: 50, marginRight: 10 }}>
                            <div
                                style={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.largeAvatar,
                                    backgroundColor: 'white',
                                    cursor: 'grab'
                                }}
                            >
                                <img
                                    style={{ width: '100%', height: '100%' }}
                                    src={`${baseURL}/api/v1/node-icon/${data.name}`}
                                    alt='Notification'
                                />
                            </div>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500
                                }}
                            >
                                {data.label}
                            </Typography>
                        </Box>
                    </div>
                    {data.outputAnchors.map((outputAnchor, index) => (
                        <Handle
                            type='source'
                            position={customization.isHorizontal ? Position.Bottom : Position.Right}
                            key={outputAnchor.id}
                            id={outputAnchor.id}
                            style={{
                                height: 15,
                                width: 15,
                                bottom: customization.isHorizontal ? -7.5 : null,
                                backgroundColor: data.selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                left: customization.isHorizontal ? handlerPosition[data.outputAnchors.length - 1][index] : null,
                                top: !customization.isHorizontal ? handlerPosition[data.outputAnchors.length - 1][index] : null
                            }}
                        />
                    ))}
                </Box>
            </CardWrapper>
        </>
    )
}

CanvasNode.propTypes = {
    data: PropTypes.object
}

export default CanvasNode
