// material-ui
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// third party
import ReactJson from 'react-json-view'

// utils
import { copyToClipboard } from 'utils/genericHelper'

//css
import './OptionParamsResponse.css'

// ==============================|| OPTION PARAMS RESPONSE ||============================== //

export const OptionParamsResponse = ({
    value,
    options
}: {
    value: string
    options: { name: string; inputParameters: string; exampleParameters: string; exampleResponse: string }[]
}) => {
    const theme = useTheme()

    const getSelectedValue = (value: string) => options.find((option) => option.name === value)

    const getSelectedOptionInputParams = (value: string) => {
        const selectedOption = options.find((option) => option.name === value)
        if (selectedOption) {
            return selectedOption.inputParameters || ''
        }
        return ''
    }

    const getSelectedOptionExampleParams = (value: string) => {
        const selectedOption = options.find((option) => option.name === value)
        if (selectedOption) {
            return selectedOption.exampleParameters || ''
        }
        return ''
    }

    const getSelectedOptionExampleResponse = (value: string) => {
        const selectedOption = options.find((option) => option.name === value)
        if (selectedOption) {
            return selectedOption.exampleResponse || {}
        }
        return {}
    }

    return (
        <>
            {getSelectedValue(value) && getSelectedOptionInputParams(value) && (
                <Box
                    sx={{
                        p: 1,
                        mt: 2,
                        backgroundColor: theme.palette.secondary.light,
                        borderRadius: `15px`,
                        position: 'relative'
                    }}
                >
                    <Typography sx={{ p: 1 }} variant='h6'>
                        Parameters
                    </Typography>
                    <div className='params' dangerouslySetInnerHTML={{ __html: getSelectedOptionInputParams(value) }} />
                </Box>
            )}

            {getSelectedValue(value) && getSelectedOptionExampleParams(value) && (
                <Box
                    sx={{
                        p: 1,
                        mt: 2,
                        backgroundColor: theme.palette.secondary.light,
                        borderRadius: `15px`,
                        position: 'relative'
                    }}
                >
                    <Typography sx={{ p: 1 }} variant='h6'>
                        Example Parameters
                    </Typography>
                    <ReactJson
                        collapsed
                        src={JSON.parse(getSelectedOptionExampleParams(value))}
                        enableClipboard={(e) => copyToClipboard(e)}
                    />
                </Box>
            )}

            {getSelectedValue(value) && getSelectedOptionExampleResponse(value) && (
                <Box
                    sx={{
                        p: 1,
                        mt: 2,
                        backgroundColor: theme.palette.secondary.light,
                        borderRadius: `15px`,
                        position: 'relative'
                    }}
                >
                    <Typography sx={{ p: 1 }} variant='h6'>
                        Example Response
                    </Typography>
                    <ReactJson collapsed src={getSelectedOptionExampleResponse(value)} enableClipboard={(e) => copyToClipboard(e)} />
                </Box>
            )}
        </>
    )
}
