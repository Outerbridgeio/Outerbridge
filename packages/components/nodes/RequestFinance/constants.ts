import { INodeParams } from '../../src'

export const salaryParameters = [
    {
        label: 'Salary Currency',
        name: 'salaryCurrency',
        description: 'Currency in which the salary will be issued in.',
        type: 'asyncOptions',
        loadMethod: 'getInvoiceCurrency',
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'Salary Amount',
        name: 'salaryAmount',
        description: 'Amount of salary to be paid',
        type: 'number',
        placeholder: '1000',
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'How do you want to pay?',
        name: 'salaryPaymentCurrency',
        type: 'asyncOptions',
        loadMethod: 'getPaymentCurrency',
        description: 'Currency in which the employer would like to pay in.',
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'Employee Type',
        name: 'employeeType',
        type: 'options',
        options: [
            {
                label: 'Existing',
                name: 'existing'
            },
            {
                label: 'New',
                name: 'new'
            }
        ],
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'Employee',
        name: 'existingEmployee',
        type: 'asyncOptions',
        loadMethod: 'getEmployees',
        show: {
            'actions.operation': ['createSalaryPayment'],
            'inputParameters.employeeType': ['existing']
        }
    },
    {
        label: 'Employee Email',
        name: 'employeeEmail',
        type: 'string',
        description: 'Email of the employee',
        default: '',
        show: {
            'actions.operation': ['createSalaryPayment'],
            'inputParameters.employeeType': ['new']
        }
    },
    {
        label: 'Employee Wallet Address',
        name: 'employeePaymentAddress',
        type: 'string',
        description: 'Wallet address of the employee to receive salary',
        default: '',
        show: {
            'actions.operation': ['createSalaryPayment'],
            'inputParameters.employeeType': ['new']
        }
    },
    {
        label: 'Employee First Name',
        name: 'employeeFirstName',
        type: 'string',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createSalaryPayment'],
            'inputParameters.employeeType': ['new']
        }
    },
    {
        label: 'Employee Last Name',
        name: 'employeeLastName',
        type: 'string',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createSalaryPayment'],
            'inputParameters.employeeType': ['new']
        }
    },
    {
        label: 'Owner Email',
        name: 'companyEmail',
        type: 'string',
        description:
            'Email of the owner that issues salary payment. Refer to <a target="_blank" href="https://app.request.finance/account/profile">Account page</a>',
        default: '',
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'Owner First Name',
        name: 'companyFirstName',
        description:
            'First name of the owner that issues salary payment. Refer to <a target="_blank" href="https://app.request.finance/account/profile">Account page</a>',
        type: 'string',
        default: '',
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'Company Last Name',
        name: 'companyLastName',
        description:
            'Last name of the owner that issues salary payment. Refer to <a target="_blank" href="https://app.request.finance/account/profile">Account page</a>',
        type: 'string',
        default: '',
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'Company Business Name',
        name: 'companyBusinessName',
        type: 'string',
        description:
            'Business name of the company. Refer to <a target="_blank" href="https://app.request.finance/account/profile">Account page</a>',
        optional: true,
        default: '',
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'Company Address Line 1',
        name: 'companyStreetAddress',
        type: 'string',
        description: 'Street, house, apartment of the company.',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'Company Address Line 2',
        name: 'companyExtendedAddress',
        type: 'string',
        description: 'Street, house, apartment of the company.',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'Company Postal Code',
        name: 'companyPostalCode',
        type: 'string',
        description: 'Post code of the company.',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'Company State',
        name: 'companyRegion',
        type: 'string',
        description: 'Region of the company (e.g. “California”).',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    },
    {
        label: 'Company Country',
        name: 'companyCountry',
        description: 'Country of the company (e.g. US).',
        type: 'asyncOptions',
        loadMethod: 'getCountry',
        optional: true,
        show: {
            'actions.operation': ['createSalaryPayment']
        }
    }
] as INodeParams[]

export const invoiceParameters = [
    {
        label: 'Invoice Currency',
        name: 'invoiceCurrency',
        description:
            'Currency in which the invoice is denominated. For example, invoices can be denominated in USD, but buyers can pay in crypto.',
        type: 'asyncOptions',
        loadMethod: 'getInvoiceCurrency',
        show: {
            'actions.operation': ['createInvoice']
        }
    },
    {
        label: 'Invoice Items',
        name: 'invoiceItems',
        type: 'array',
        array: [
            {
                label: 'Name',
                name: 'name',
                type: 'string',
                description: 'Name of the product/service for which the invoice is created.',
                default: ''
            },
            {
                label: 'Unit Price',
                name: 'unitPrice',
                description: 'Price of the product/service, excl. taxes. Max 2 decimal places',
                type: 'number'
            },
            {
                label: 'Quantity',
                name: 'quantity',
                description: 'Quantity of the product/service that was provided.',
                type: 'number'
            },
            {
                label: 'Tax Type',
                name: 'taxType',
                description:
                    'Currency code in which the invoice is denominated. For example, invoices can be denominated in USD, but buyers can pay in crypto.',
                type: 'options',
                options: [
                    {
                        label: 'Fixed',
                        name: 'fixed'
                    },
                    {
                        label: 'Percentage',
                        name: 'percentage'
                    }
                ],
                optional: true
            },
            {
                label: 'Tax Amount',
                name: 'taxAmount',
                description: 'Amount of the tax.',
                type: 'number',
                show: {
                    'inputParameters.invoiceItems[$index].taxType': ['fixed', 'percentage']
                }
            }
        ],
        show: {
            'actions.operation': ['createInvoice']
        }
    },
    {
        label: 'Payment Address',
        name: 'paymentAddress',
        type: 'string',
        description: 'Address which will receive the payment.',
        default: '',
        placeholder: '0xE597E474889537A3A9120d1B5793cdFAEf6B6c10',
        show: {
            'actions.operation': ['createInvoice']
        }
    },
    {
        label: 'Payment Currency',
        name: 'paymentCurrency',
        description: 'Currency in which the invoice can be paid.',
        type: 'asyncOptions',
        loadMethod: 'getPaymentCurrency',
        show: {
            'actions.operation': ['createInvoice']
        }
    },
    {
        label: 'Payment Due Date',
        name: 'paymentDueDate',
        description: 'Due date of the invoice. Last date the buyer can pay.',
        type: 'date',
        optional: true,
        show: {
            'actions.operation': ['createInvoice']
        }
    },
    {
        label: 'Client Type',
        name: 'clientType',
        type: 'options',
        options: [
            {
                label: 'Existing',
                name: 'existing'
            },
            {
                label: 'New',
                name: 'new'
            }
        ],
        show: {
            'actions.operation': ['createInvoice']
        }
    },
    {
        label: 'Client',
        name: 'existingClient',
        type: 'asyncOptions',
        loadMethod: 'getClients',
        show: {
            'actions.operation': ['createInvoice'],
            'inputParameters.clientType': ['existing']
        }
    },
    {
        label: 'Client Email',
        name: 'buyerInfoEmail',
        type: 'string',
        description: 'Email of the buyer/customer/client',
        default: '',
        show: {
            'actions.operation': ['createInvoice'],
            'inputParameters.clientType': ['new']
        }
    },
    {
        label: 'Client Business Name',
        name: 'buyerInfoBusinessName',
        type: 'string',
        description: 'Business name of the buyer/customer/client',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createInvoice'],
            'inputParameters.clientType': ['new']
        }
    },
    {
        label: 'Client First Name',
        name: 'buyerInfoFirstName',
        type: 'string',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createInvoice'],
            'inputParameters.clientType': ['new']
        }
    },
    {
        label: 'Client Last Name',
        name: 'buyerInfoLastName',
        type: 'string',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createInvoice'],
            'inputParameters.clientType': ['new']
        }
    },
    {
        label: 'Client Address Line 1',
        name: 'buyerInfoStreetAddress',
        type: 'string',
        description: 'Street, house, apartment of the buyer.',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createInvoice'],
            'inputParameters.clientType': ['new']
        }
    },
    {
        label: 'Client Address Line 2',
        name: 'buyerInfoExtendedAddress',
        type: 'string',
        description: 'Street, house, apartment of the buyer.',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createInvoice'],
            'inputParameters.clientType': ['new']
        }
    },
    {
        label: 'Client Postal Code',
        name: 'buyerInfoPostalCode',
        type: 'string',
        description: 'Post code of the buyer.',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createInvoice'],
            'inputParameters.clientType': ['new']
        }
    },
    {
        label: 'Client State',
        name: 'buyerInfoRegion',
        type: 'string',
        description: 'Region of the buyer (e.g. “California”).',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createInvoice'],
            'inputParameters.clientType': ['new']
        }
    },
    {
        label: 'Client Country',
        name: 'buyerInfoCountry',
        description: 'Country of the buyer (e.g. US).',
        type: 'asyncOptions',
        loadMethod: 'getCountry',
        optional: true,
        show: {
            'actions.operation': ['createInvoice'],
            'inputParameters.clientType': ['new']
        }
    },
    {
        label: 'Client Tax Registration',
        name: 'buyerInfoTaxRegistration',
        type: 'string',
        description: 'Tax registration number of the buyer.',
        default: '',
        optional: true,
        show: {
            'actions.operation': ['createInvoice'],
            'inputParameters.clientType': ['new']
        }
    }
] as INodeParams[]
