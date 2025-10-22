'use client';

import { useTheme } from "@emotion/react";
import { Button, Card, CardContent, Divider, Grid, IconButton, Table, TableBody, TableContainer, Tooltip, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSettingsContext } from "src/components/settings";
import { TableEmptyRows, TableNoData, TableSelectedAction, TableSkeleton, emptyRows, useTable } from "src/components/table";
// import TernakTableHead from "../ternak-table-head";
import TernakTableRow from "../ternak-table-row";
import HistoryImportRow from "../history-import-row";
import OverviewKandang from "../overview-kandang";
import TernakTableToolbar from "../ternak-table-toolbar";

export default function ImportDataHistoryView() {

    const settings = useSettingsContext();
    const theme = useTheme();
    const table = useTable();
    const denseHeight = table.dense ? 60 : 80;

    const [filters, setFilters] = useState('');
    const [dataFiltered, setDataFiltered] = useState([]);
    const [ternakLoading, setTernakLoading] = useState(false);


    const data = [
        {
            id: '1',
            status: 'Sukses',
            messages: '',
            record: ''
        },
        {
            id: '2',
            status: 'Sukses',
            messages: '',
            record: ''
        },
        {
            id: '3',
            status: 'Sukses',
            messages: '',
            record: ''
        },
        {
            id: '4',
            status: 'Gagal',
            messages: 'The following errors were found',
            record: ''
        },
        {
            id: '5',
            status: 'Pending',
            messages: 'The following hold were found',
            record: ''
        },
    ];

    const TABLE_HEAD = [
        { id: 'row', label: 'Row' },
        { id: 'status', label: 'Status' },
        { id: 'messages', label: 'Messages' },
        { id: 'record', label: 'Record' },
        {}
    ];

    // const overviewKandang = [
    //     {
    //       title: 'Imported Successfully',
    //       value: '120',
    //       icon: '/assets/illustrations/kandang/check.png',
    //     },
    //     {
    //       title: 'Imported Pending',
    //       value: '120',
    //       icon: '/assets/illustrations/kandang/check.png',
    //     },
    //     {
    //       title: 'Imported Failed',
    //       value: '120',
    //       icon: '/assets/illustrations/kandang/check.png',
    //     },
    //   ];

    const overviewKandang = [
        {
            title: 'Imported Successfully',
            value: '120',
            icon: '/assets/illustrations/kandang/check.png',
            type: 'success',
        },
        {
            title: 'Imported Pending',
            value: '17',
            icon: '/assets/illustrations/kandang/pending.svg',
            type: 'pending',
        },
        {
            title: 'Imported Failed',
            value: '12',
            icon: '/assets/illustrations/kandang/failed.svg',
            type: 'failed',
        },
    ];
    const handleFilters = (name, value) => {
        setFilters(value);
        setDataFiltered(
            data.filter((item) => item.id.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
        );
    };

    const onCustomSort = (array, sort) => {
        if (sort === 'asc') {
            setDataFiltered(array.slice().sort((a, b) => b.name.localeCompare(a.name)));
            table.setOrder('desc');
        } else {
            setDataFiltered(array.slice().sort((a, b) => a.name.localeCompare(b.name)));
            table.setOrder('asc');
        }
    };


    useEffect(() => {
        if (data) {
            setDataFiltered(data);
        }
    }, []);

    useEffect(() => {
        settings.setPageTitle(document.title);
    }, [window.location.pathname]);


    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'xl'}>

                <Grid container spacing={3}>
                    {overviewKandang.map((item, index) => (
                        <Grid item key={index} xs={12} md={4}>
                            <OverviewKandang price={item.value} title={item.title} img={item.icon} type={item.type} />
                        </Grid>
                    ))}
                    <Box flexGrow={1}>
                        <TernakTableToolbar filters={filters} setFilters={setFilters} onFilters={handleFilters} />
                    </Box>
                    <Grid xs={12} mt={1}>
                        <Card>
                            <CardContent>
                                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                                    <TableSelectedAction
                                        dense={table.dense}
                                        numSelected={table.selected.length}
                                        rowCount={data.length}
                                        onSelectAllRows={(checked) =>
                                            table.onSelectAllRows(
                                                checked,
                                                data.map((row) => row.id)
                                            )
                                        }
                                        action={
                                            <Tooltip title="Delete">
                                                <IconButton color="primary" onClick={confirm.onTrue}>
                                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    />

                                    <Scrollbar>
                                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                            <TernakTableHead
                                                order={table.order}
                                                orderBy={table.orderBy}
                                                headLabel={TABLE_HEAD}
                                                rowCount={data.length}
                                                numSelected={table.selected.length}
                                                onSort={onCustomSort}
                                                onSelectAllRows={(checked) =>
                                                    table.onSelectAllRows(
                                                        checked,
                                                        data.map((row) => row.id)
                                                    )
                                                }
                                                data={dataFiltered}
                                            />

                                            <TableBody>
                                                {ternakLoading ? (
                                                    [...Array(table.rowsPerPage)].map((i, index) => (
                                                        <TableSkeleton key={index} sx={{ height: denseHeight }} />
                                                    ))
                                                ) : (
                                                    <>
                                                        {dataFiltered
                                                            ?.slice(
                                                                table.page * table.rowsPerPage,
                                                                table.page * table.rowsPerPage + table.rowsPerPage
                                                            )
                                                            ?.map((row) => (
                                                                <HistoryImportRow
                                                                    key={row.id}
                                                                    row={row}
                                                                    selected={table.selected.includes(row.id)}
                                                                    onSelectRow={() => table.onSelectRow(row.id)}
                                                                    onDeleteRow={() => handleDeleteRow(row.id)}
                                                                    onEditRow={() => handleEditRow(row.name)}
                                                                    onViewRow={() => handleViewRow(row.name)}
                                                                />
                                                            ))}
                                                    </>
                                                )}

                                                <TableEmptyRows
                                                    height={denseHeight}
                                                    emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
                                                />

                                                <TableNoData notFound={data.length === 0} />
                                            </TableBody>
                                        </Table>
                                    </Scrollbar>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}