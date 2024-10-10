import { bisector } from "d3";
import { Datum } from "../../types/domain";

export const closestDatum = (
  data: Datum[],
  accessor: (d: Datum) => Date,
  datum: Date
) => {
  var i = bisector(accessor).left(data, datum, 1);
  var d0 = data[i - 1];
  var d1 = data[i] || d0;
  return datum.getTime() - accessor(d0).getTime() >
    accessor(d1).getTime() - datum.getTime()
    ? d1
    : d0;
};
