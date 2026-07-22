import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Transaction } from "../../lib/types";

interface Props {
  data: Transaction[];
}

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: "Amount (LKR)",
    cell: ({ row }) => {
      const amount = row.original.amount;

      return (
        <span className={amount >= 0 ? "text-success" : "text-error"}>
          {amount >= 0 ? "+" : "-"}
          {Math.abs(amount).toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Balance (LKR)",
    cell: ({ getValue }) =>
      Number(getValue()).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <button className="transition-default group">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5"
        >
          <path
            d="M12 18L4.5 10.5L6.6 8.325L10.5 12.225V0H13.5V12.225L17.4 8.325L19.5 10.5L12 18ZM3 24C2.175 24 1.469 23.7065 0.882 23.1195C0.295 22.5325 0.001 21.826 0 21V16.5H3V21H21V16.5H24V21C24 21.825 23.7065 22.5315 23.1195 23.1195C22.5325 23.7075 21.826 24.001 21 24H3Z"
            className="group-hover:fill-primary transition-default fill-neutral-100"
          />
        </svg>
      </button>
    ),
  },
];

export default function RecentTransactions({ data }: Props) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full border-collapse">
      <thead className="text-left">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b border-neutral-800">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="px-2 py-4 font-normal text-neutral-100"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="border-b border-neutral-800">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-2 py-9 text-neutral-100">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
