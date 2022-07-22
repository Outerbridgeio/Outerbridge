import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Typography, Stack, IconButton, Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// project imports
import OptionParamsResponse from './OptionParamsResponse';

// third party
import lodash from 'lodash';
import AsyncSelect from 'react-select/async';

// icons
import { IconX } from '@tabler/icons';

// API
import nodesApi from "api/nodes";

// ==============================|| ASYNC SELECT WRAPPER ||============================== //

const AsyncSelectWrapper = ({
    title,
    description,
    value,
    loadMethod,
    loadFromDbCollections,
    nodeFlowData,
    error,
    onChange,
    onMenuOpen,
    onSetError,
}) => {

    const theme = useTheme();

    const customStyles = {
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
            "&:hover": {
                backgroundColor: theme.palette.grey['200']
            },
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
            "&:hover": {
                borderColor: theme.palette.grey['700']
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            fontWeight: '600',
        }),
        menuList: (provided) => ({
            ...provided,
            boxShadow: '0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)',
            borderRadius: '10px',
        }),
    }
    
    const [asyncOptions, setAsyncOptions] = useState([]);

    const getSelectedValue = (value) => asyncOptions.find((option) => option.name === value);

    const getDefaultOptionValue = () => ('');
  
    const formatErrorMessage = (error) => {
        if (error) return `*${error.replace(/["]/g, "")}`;
        return ""
    }

    const showHideOptions = (options) => {

        let returnOptions = options;
        const toBeDeleteOptions = [];
        const displayTypes = ['show', 'hide'];

        for (let x = 0; x < displayTypes.length; x+= 1) {
            const displayType = displayTypes[x];

            for (let i = 0; i < returnOptions.length; i+= 1) {
                const option = returnOptions[i];
                const displayOptions = option[displayType];
        
                if (displayOptions) {
                    Object.keys(displayOptions).forEach((path) => {
                        const comparisonValue = displayOptions[path];

                        if (path.includes("$index")) {
                            path = path.replace("$index", index);
                        }
                        const groundValue = lodash.get(nodeFlowData, path, '');

                        if (Array.isArray(comparisonValue)) {
                            if (displayType === 'show' && !comparisonValue.includes(groundValue)) {
                                toBeDeleteOptions.push(option);
                            }
                            if (displayType === 'hide' && comparisonValue.includes(groundValue)) {
                                toBeDeleteOptions.push(option);
                            }
                        }
                    });
                }
            }
        }

        for (let i = 0; i < toBeDeleteOptions.length; i+= 1) {
            returnOptions = returnOptions.filter((opt) => JSON.stringify(opt) !== JSON.stringify(toBeDeleteOptions[i]));
        }

        return returnOptions;
    }

    // eslint-disable-next-line
    const loadOptions = useCallback(
        lodash.debounce( async(inputText, callback) => {
            const nodeInstanceName = nodeFlowData.name;
            const response = await nodesApi.loadMethodNode(nodeInstanceName, { ...nodeFlowData, loadMethod, loadFromDbCollections });
            const options = showHideOptions(response.data || []);
            setAsyncOptions(options);
            callback(options);
        }, 500), [nodeFlowData]
    );

    const formatOptionLabel = ({ label, description }, {context}) => (
        <>
        {context === 'menu' && <div style={{ display: "flex", flexDirection: "column" }}>
            <div>{label}</div>
            {description && <span style={{ fontWeight: 400, paddingTop: 10, paddingBottom: 10 }}>{description}</span>}
        </div>}
        {context === 'value' && <div style={{ display: "flex", flexDirection: "column" }}>
            <div>{label}</div>
        </div>}
        </>
    );

    useEffect(() => () => setAsyncOptions([]), []);

    useEffect(() => {
        if (value !== undefined) {
            const selectedOption = asyncOptions.find((option) => option.name === value)
            if (!selectedOption) {
                onSetError();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [asyncOptions]); 

    return (
        <>
            <Stack direction="row">
                <Typography variant="overline">{title}</Typography>
                {description && (
                <Tooltip title={description} placement="right">
                    <IconButton ><Info style={{ height: 18, width: 18 }}/></IconButton>
                </Tooltip>
                )}
            </Stack>
            <div style={{position: 'relative'}}>
                <AsyncSelect
                    key={JSON.stringify(nodeFlowData)} // to reload async select whenever flowdata changed
                    styles={customStyles}
                    value={getSelectedValue(value) || getDefaultOptionValue()}
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
                        height: 27, width: 30, 
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
                    title="Clear Selection"
                    type='button'
                    onClick={() => onChange(null)}
                >
                    <IconX />
                </button>
            </div> 
            {error && (
                <span style={{ color: 'red', fontSize: '0.7rem', fontStyle: 'italic' }}>{formatErrorMessage(error)}</span>
            )}

            <OptionParamsResponse value={value} options={asyncOptions} />
        </>
    );
}

AsyncSelectWrapper.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    value: PropTypes.string,
    loadMethod: PropTypes.string,
    loadFromDbCollections: PropTypes.array,
    nodeFlowData: PropTypes.object,
    error: PropTypes.string,
    onChange: PropTypes.func,
    onMenuOpen: PropTypes.func,
    onSetError: PropTypes.func,
};

export default AsyncSelectWrapper;
