import {
    ICommonObject,
	INode, 
    INodeData, 
    INodeExecutionData,
    INodeParams, 
    NodeType,
} from '../../src/Interface';
import {
	handleErrorMessage,
    returnNodeExecutionData
} from '../../src/utils';
import Jimp from 'jimp'; 
import { promisify } from 'util';

class ImageEditor implements INode {
	
	label: string;
    name: string;
    type: NodeType;
    description: string;
    version: number;
	icon: string;
    incoming: number;
	outgoing: number;
    actions?: INodeParams[];
    inputParameters?: INodeParams[];

    constructor() {

		this.label = 'ImageEditor';
		this.name = 'imageEditor';
		this.icon = 'image-editor.svg';
		this.type = 'action';
		this.version = 1.0;
		this.description = 'Edit image with different manipulation methods';
		this.incoming = 1;
		this.outgoing = 1;
        this.actions = [
            {
                label: 'Selection Method',
				name: 'method',
				type: 'options',
                options: [
                    {
                        label: 'Crop',
                        name: 'crop',
                        description: 'Crop image'
                    },
                    {
                        label: 'Blur',
                        name: 'blur',
                        description: 'Quickly blur an image'
                    },
                    {
                        label: 'Gaussian',
                        name: 'gaussian',
                        description: 'Hardcore blur'
                    },
                    {
                        label: 'Invert',
                        name: 'invert',
                        description: 'Invert an images colors'
                    },
                    {
                        label: 'Resize',
                        name: 'resize',
                        description: 'Resize an image'
                    },
                    {
                        label: 'Cover',
                        name: 'cover',
                        description: 'Scale the image so the given width and height keeping the aspect ratio'
                    },
                    {
                        label: 'Rotate',
                        name: 'rotate',
                        description: 'Rotate an image'
                    },
                    {
                        label: 'Normalize',
                        name: 'normalize',
                        description: 'Normalize the colors in an image'
                    },
                    {
                        label: 'Dither',
                        name: 'dither',
                        description: 'Apply a dither effect to an image'
                    },
                    {
                        label: 'Scale',
                        name: 'scale',
                        description: 'Uniformly scales the image by a factor'
                    },
                ]
            },
            {
				label: 'Image Raw Data (Base64)',
				name: 'rawData',
				type: 'string',
				placeholder: 'data:image/png;base64,<base64_string>',
			},
        ]
		this.inputParameters = [
            /**
             * Blur or Gaussian
             */
             {
                label: 'Blur Pixel Radius',
                name: 'blurPixel',
                type: 'number',
                default: 5,
                show: {
                    'actions.method': ['blur', 'gaussian'],
                },
                description: 'The pixel radius of the blur',
            },
            /**
             * Crop
             */
            {
                label: 'Width',
                name: 'width',
                type: 'number',
                default: 500,
                show: {
                    'actions.method': ['crop'],
                },
                description: 'Crop width',
            },
            {
                label: 'Height',
                name: 'height',
                type: 'number',
                default: 500,
                show: {
                    'actions.method': ['crop'],
                },
                description: 'Crop height',
            },
            {
                label: 'Position X',
                name: 'positionX',
                type: 'number',
                default: 10,
                show: {
                    'actions.method': ['crop'],
                },
                description: 'X (horizontal) position to crop from',
            },
            {
                label: 'Position Y',
                name: 'positionY',
                type: 'number',
                default: 10,
                show: {
                    'actions.method': ['crop'],
                },
                description: 'Y (vertical) position to crop from',
            },
            /**
             * Resize or Cover
             */
             {
                label: 'Width',
                name: 'width',
                type: 'number',
                default: 500,
                show: {
                    'actions.method': ['resize', 'cover'],
                },
                description: 'Resize width',
            },
            {
                label: 'Height',
                name: 'height',
                type: 'number',
                default: 500,
                show: {
                    'actions.method': ['resize', 'cover'],
                },
                description: 'Resize height',
            },
            /**
             * Rotate
             */
             {
                label: 'Rotation Degree',
                name: 'degree',
                type: 'number',
                default: 90,
                show: {
                    'actions.method': ['rotate'],
                },
            },
            /**
             * Scale
             */
             {
                label: 'Scale Factor',
                name: 'factor',
                type: 'number',
                default: 2,
                show: {
                    'actions.method': ['scale'],
                },
            },
		] as INodeParams[];
	};

	async run(nodeData: INodeData): Promise<INodeExecutionData[] | null> {

		const inputParametersData = nodeData.inputParameters;
		const actionsData = nodeData.actions;

		if (inputParametersData === undefined || actionsData === undefined) {
            throw new Error('Required data missing');
        }

        const returnData: ICommonObject = {};

		const rawData = actionsData.rawData as string;
        const method = actionsData.method as string;

        try {
            const imageData = rawData.split(',').pop() || '';
            const image = await Jimp.read(Buffer.from(imageData, 'base64'));

            if (method === 'crop') {
                const positionX = parseInt(inputParametersData.positionX as string, 10);
                const positionY = parseInt(inputParametersData.positionY as string, 10);
                const height = parseInt(inputParametersData.height as string, 10);
                const width = parseInt(inputParametersData.width as string, 10);

                image.crop(positionX, positionY, width, height, (err) => {
                    if (err) throw handleErrorMessage(err);
                });

            } else if (method === 'blur' || method === 'gaussian') {
                const blurPixel = parseInt(inputParametersData.blurPixel as string, 10);

                if (method === 'blur') {
                    image.blur(blurPixel, (err) => {
                        if (err) throw handleErrorMessage(err);
                    });
                } else if (method === 'gaussian') {
                    image.gaussian(blurPixel, (err) => {
                        if (err) throw handleErrorMessage(err);
                    });
                }

            } else if (method === 'invert') {
                image.invert((err) => {
                    if (err) throw handleErrorMessage(err);
                });
                
            } else if (method === 'resize'|| method === 'cover') {
                const height = parseInt(inputParametersData.height as string, 10);
                const width = parseInt(inputParametersData.width as string, 10);

                if (method === 'resize') {
                    image.resize(width, height, (err) => {
                        if (err) throw handleErrorMessage(err);
                    });
                } else if (method === 'cover') {
                    image.cover(width, height, (err) => {
                        if (err) throw handleErrorMessage(err);
                    });
                }
                
            } else if (method === 'rotate') {
                const degree = parseInt(inputParametersData.degree as string, 10);

                image.rotate(degree, (err) => {
                    if (err) throw handleErrorMessage(err);
                });
                
            } else if (method === 'normalize') {
                image.normalize((err) => {
                    if (err) throw handleErrorMessage(err);
                });
                
            } else if (method === 'dither') {
                image.dither565((err) => {
                    if (err) throw handleErrorMessage(err);
                });
                
            } else if (method === 'scale') {
                const factor = parseInt(inputParametersData.factor as string, 10);

                image.scale(factor, (err) => {
                    if (err) throw handleErrorMessage(err);
                });
                
            } 


            const toBase64 = promisify(image.getBase64).bind(image);
            const mimeType = rawData.split(',')[0].split(';')[0].split(':')[1];
            const finalImage = await toBase64(mimeType);

            const attachment = {
                contentType: mimeType,
                content: finalImage
            }
            returnData['data'] = finalImage;
            returnData.attachments = [attachment];
    
        } catch (error) {
            throw handleErrorMessage(error);
        }

        return returnNodeExecutionData(returnData);
	}
}

module.exports = { nodeClass: ImageEditor }