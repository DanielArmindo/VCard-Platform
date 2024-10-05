import { useSelector } from "react-redux";
import AdminStatistics from "./AdminStatistics";
import VcardStatistics from "./VcardStatistics";
import { useLoaderData } from "react-router-dom";
import '../../assets/statistics.css'

const Statistics = () => {
  const user = useSelector((state) => state.user);
  const type = user?.user_type;
  const dataPromise = useLoaderData();
  return (
    <>
      {type === "A" && <AdminStatistics data={dataPromise} />}
      {type === "V" && <VcardStatistics data={dataPromise} />}
    </>
  );
};

export default Statistics;
