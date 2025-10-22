import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { ArrowDropDownIcon } from '@mui/x-date-pickers'
import React from 'react'
import Iconify from 'src/components/iconify'

const AccordionItem = ({ title, data }) => {

    const splitCamelCase = (str) => {
        return str.replace(/([a-z])([A-Z])/g, '$1 $2');
    };

    return (
        <Accordion sx={{ width: '100%' }}>
            <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel2-content"
                id="panel1-header"
            >
                <Iconify icon="mdi:medical-bag" width={18} sx={{ color : 'info', mt : '1px' }} />
                <Typography variant='body2' ml={1}>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {typeof data === 'object' && data !== null ? (
                    <Stack spacing={1}>
                        {Object.entries(data).map(([key, value]) => (
                            <Typography key={key} variant='body2' sx={{ textTransform: 'capitalize' }}>
                                &#x2022; {splitCamelCase(key)} : {value}
                            </Typography>
                        ))}
                    </Stack>
                )  : (
                    <Typography variant='body2'>
                        {data}
                    </Typography>
                )}
            </AccordionDetails>
        </Accordion>
    )
}

export default AccordionItem