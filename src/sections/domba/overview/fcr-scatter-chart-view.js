import { useEffect, useState } from 'react';
import { useGetData, useGetFulLData } from 'src/api/custom-domba-api';
import { useAuthContext } from 'src/auth/hooks';
import Chart, { useChart } from 'src/components/chart';

export default function FCRScatterChartView({ series }) {
  const { data: dataPen, getFullData: getPen } = useGetFulLData();
  const { data: dataWelfare, getFullData: getTernak } = useGetFulLData();

  const { user } = useAuthContext();

  const [chartData, setChartData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pensData = await getPen('pen', '', `kandang.peternakan = "${user.id}"`);

        if (pensData) {
          const seriesData = await Promise.all(
            pensData.map(async (pen) => {
              const welfareData = await getTernak('ternak', '', `pen = "${pen.id}"`);
              const penSeries = {
                name: pen.namaPen,
                data: welfareData.map((item) => [parseInt(item.noFID), item.fcr]),
              };
              return penSeries;
            })
          );

          seriesData.sort((a, b) => {
            const penNumberA = parseInt(a.name.replace('Pen ', ''));
            const penNumberB = parseInt(b.name.replace('Pen ', ''));
            return penNumberA - penNumberB;
          });
          setChartData(seriesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    chart: {
      height: 350,
      type: 'scatter',
      zoom: {
        enabled: true,
        type: 'xy',
      },
      toolbar: {
        show: false, // Hide the toolbar (which includes zoom controls)
      },
    },
    xaxis: {
      type: 'category',
      categories: chartData?.flatMap((series) => series.data.map((data) => parseInt(data[0]))), // Assuming IDs are unique and can be used as categories
      title: {
        text: 'ID Ternak',
      },
    },
    yaxis: {
      tickAmount: 7,
      title: {
        text: 'FCR',
      },
    },
    tooltip: {
      x: {
        show: true,
        formatter: (val) => `ID: ${val}`,
      },
      y: {
        formatter: (val) => `FCR: ${val}`,
      },
    },
    markers: {
      size: 5,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
  };

  return (
    <>
      {chartData && (
        <>
          <Chart
            options={chartOptions}
            series={chartData}
            type="scatter"
            height={350}
            width={'100%'}
          />
        </>
      )}
    </>
  );
}
