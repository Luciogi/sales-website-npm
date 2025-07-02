import { useState } from "react";
import dynamic from "next/dynamic";
import { promises as fs } from "fs";
import { TabItem, Tabs, Card } from "flowbite-react";

const ApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false, // Ensure ApexCharts is not imported during SSR
});

type MyComponentProps = {
  years: number[];
  traffic: any; // Replace 'any' with the actual type of 'traffic' if known
};
export default function Dashboard({ years, traffic }: MyComponentProps) {
  const [trafficPerYear, setTrafficPerYear] = useState({
    options: {
      chart: {
        id: "traffic-chart",
      },
      xaxis: {
        categories: years,
      },
    },
    series: [
      {
        name: "traffic",
        data: traffic,
      },
    ],
  });

  const labels = years.map((year) => year.toString());
  const [state, setState] = useState({
    series: traffic,
    options: {
      labels: labels,
    },
  });
  return (
    <>
      <h1 className="text-5xl font-extrabold dark:text-white text-center p-5 m-5">
        Welcome to Dashboard
      </h1>
      <Tabs aria-label="Default tabs" variant="fullWidth">
        <TabItem active title="Line Chart">
          <Card href="#" className="max-w">
            <ApexCharts
              options={trafficPerYear.options}
              series={trafficPerYear.series}
              type="line"
              height={350}
              width={"100%"}
            />
          </Card>
        </TabItem>
        <TabItem title="Bar Chart">
          <Card href="#" className="max-w">
            <ApexCharts
              options={trafficPerYear.options}
              series={trafficPerYear.series}
              type="bar"
              height={350}
              width={"100%"}
            />
          </Card>
        </TabItem>
        <TabItem title="Pie Chart">
          <Card href="#" className="max-w">
            <ApexCharts
              options={state.options}
              series={state.series}
              type="pie"
              height={350}
              width={"100%"}
            />
          </Card>
        </TabItem>
      </Tabs>
    </>
  );
}
interface TrafficData {
  [key: string]: any;
  Year: any;
  Traffic: any; // Adjust the properties according to your JSON structure
}
export async function getServerSideProps() {
  const data = await fs.readFile(process.cwd() + "/pages/data.json", "utf8");
  const json: any = Object.values(JSON.parse(data));

  // Collect unique years
  let years_set = new Set();
  Object.values(json).map((e: any) => {
    years_set.add(e.Year);
  });

  // Collect total traffic by year
  let traffic_per_year: any = {};
  years_set.forEach((year: any) => {
    traffic_per_year[year] = json
      .filter((row: any) => row.Year === year)
      .reduce((res: any, value: any) => {
        return res + value.Traffic;
      }, 0);
  });

  const years = Array.from(years_set); // Convert to Array
  const traffic = Object.values(traffic_per_year);

  console.log(years);
  console.log(traffic);
  return { props: { years, traffic } };
}
