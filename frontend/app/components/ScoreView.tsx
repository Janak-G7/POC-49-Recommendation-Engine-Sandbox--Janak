"use client";
import { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { type Item } from "../lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, flexRender,
  type ColumnDef, type SortingState,
} from "@tanstack/react-table";

const SIG_COLORS: Record<string,string> = {
  quality:"#38BDF8", popularity:"#818CF8", recency:"#34D399",
  diversity:"#F59E0B", engagement:"#F87171",
};
const SIG_PLAIN: Record<string,string> = {
  quality:"How good the content is",
  popularity:"How many people clicked it",
  recency:"How fresh/recent it is",
  diversity:"Topic variety bonus",
  engagement:"How long users spent on it",
};
const CAT_COLOR: Record<string,string> = {
  Technology:"#38BDF8", Politics:"#818CF8", Science:"#34D399",
  Entertainment:"#F59E0B", Finance:"#A78BFA", Health:"#F87171",
};

interface Props { items: Item[] }

export default function ScoreView({ items }: Props) {
  const sorted = useMemo(() => [...items].sort((a,b) => b.composite_score - a.composite_score), [items]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id:"composite_score", desc:true }]);
  const [globalFilter, setGlobalFilter] = useState("");

  const focused = selected || sorted[0];

  const columns = useMemo<ColumnDef<Item>[]>(() => [
    {
      id:"rank", header:"#",
      cell: ({ row }) => <span style={{ color:"#64748B", fontWeight:600 }}>#{row.original.rank}</span>,
      enableSorting: false,
    },
    {
      accessorKey:"title", header:"Title",
      cell: ({ row }) => (
        <span style={{ color:"#E2E8F0", fontWeight:500, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey:"category", header:"Category",
      cell: ({ row }) => (
        <Badge style={{ background:`${CAT_COLOR[row.original.category]}15`, color:CAT_COLOR[row.original.category]||"#64748B", border:`0.5px solid ${CAT_COLOR[row.original.category]}40`, fontSize:9 }}>
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey:"source", header:"Source",
      cell: ({ row }) => <span style={{ color:"#64748B", fontSize:9 }}>{row.original.source}</span>,
    },
    {
      accessorKey:"quality_score", header:"Quality",
      cell: ({ row }) => <span style={{ color:"#34D399", fontWeight:600 }}>{(row.original.quality_score*100).toFixed(0)}%</span>,
    },
    {
      accessorKey:"base_popularity", header:"Popularity",
      cell: ({ row }) => <span style={{ color:"#64748B" }}>{(row.original.base_popularity*100).toFixed(0)}%</span>,
    },
    {
      accessorKey:"composite_score", header:"Score",
      cell: ({ row }) => <span style={{ color:"#38BDF8", fontWeight:700 }}>{row.original.composite_score.toFixed(4)}</span>,
    },
  ], []);

  const table = useReactTable({
    data: sorted,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const barOption = {
    backgroundColor: "transparent",
    grid: { top:8, bottom:70, left:8, right:8, containLabel:true },
    xAxis: {
      type:"category",
      data: sorted.slice(0,14).map(i => i.title.length>16 ? i.title.slice(0,16)+"…" : i.title),
      axisLabel: { color:"#64748B", fontSize:9, rotate:38 },
      axisLine: { lineStyle:{ color:"#1F2937" } },
    },
    yAxis: { type:"value", max:1, axisLabel:{ color:"#64748B", fontSize:9 }, splitLine:{ lineStyle:{ color:"#1F2937" } } },
    tooltip: {
      trigger:"axis", backgroundColor:"#0F1923", borderColor:"#1F2937", borderWidth:0.5,
      textStyle:{ color:"#E2E8F0", fontSize:11 },
      formatter: (params: any) => {
        const item = sorted[params[0].dataIndex];
        return `<div style="font-weight:600;margin-bottom:4px">${item?.title}</div>Score: <span style="color:#38BDF8;font-weight:700">${params[0].value}</span>`;
      },
    },
    series: [{
      type:"bar", barMaxWidth:28,
      data: sorted.slice(0,14).map((item,i) => ({
        value: item.composite_score,
        itemStyle: {
          color: item.id === focused?.id ? "#ffffff" : i===0?"#38BDF8":i===1?"#818CF8":i===2?"#34D399":"#1F2937",
          borderRadius:[3,3,0,0],
        },
      })),
    }],
  };

  const radarOption = focused ? {
    backgroundColor:"transparent",
    radar: {
      // BUG FIX: was hardcoded max:0.4, clipping any signal value above 0.4.
      // Now computed dynamically so all values fit without distortion.
      indicator: (() => {
        const vals = Object.values(focused.signal_breakdown || {});
        const dynamicMax = Math.max(...vals, 0.1) * 1.2;
        return Object.keys(focused.signal_breakdown||{}).map(k => ({ name: k.charAt(0).toUpperCase()+k.slice(1), max: parseFloat(dynamicMax.toFixed(3)) }));
      })(),
      axisName: { color:"#64748B", fontSize:10 },
      splitLine: { lineStyle:{ color:"#1F2937" } },
      splitArea: { areaStyle:{ color:["rgba(56,189,248,0.02)","transparent"] } },
      axisLine: { lineStyle:{ color:"#1F2937" } },
    },
    tooltip: { backgroundColor:"#0F1923", borderColor:"#1F2937", textStyle:{ color:"#E2E8F0", fontSize:11 } },
    series: [{
      type:"radar",
      data: [{ value: Object.values(focused.signal_breakdown||{}), name: focused.title,
        areaStyle:{ color:"rgba(56,189,248,0.1)" },
        lineStyle:{ color:"#38BDF8", width:1.5 },
        itemStyle:{ color:"#38BDF8" },
      }],
    }],
  } : null;

  return (
    <div className="flex flex-col gap-4">

      {/* Explainer */}
      <Card style={{ background:"#0F1923", border:"0.5px solid #1F2937" }}>
        <CardContent style={{ padding:"12px 16px" }}>
          <p style={{ fontSize:11, color:"#94A3B8", lineHeight:1.7, margin:0 }}>
            <span style={{ color:"#38BDF8", fontWeight:600 }}>What you're seeing:</span> Every item's final score is built from 5 signals. Click any bar to inspect how that item's score was constructed — signal by signal. Use the search and sort in the table below to explore the full ranking.
          </p>
        </CardContent>
      </Card>

      {/* Bar chart */}
      <Card style={{ background:"#0F1923", border:"0.5px solid #1F2937" }}>
        <CardHeader style={{ padding:"14px 16px 0" }}>
          <div style={{ fontSize:10, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            Score Distribution — click a bar to inspect
          </div>
        </CardHeader>
        <CardContent style={{ padding:"8px 16px 14px" }}>
          <ReactECharts option={barOption} style={{ height:220 }}
            onEvents={{ click: (p: any) => setSelected(sorted[p.dataIndex]) }} />
        </CardContent>
      </Card>

      {/* Signal decomposition */}
      {focused && (
        <Card style={{ background:"#0F1923", border:"0.5px solid rgba(56,189,248,0.2)" }} className="animate-fadeIn">
          <CardContent style={{ padding:"14px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div>
                <div style={{ fontSize:10, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Signal Decomposition</div>
                <div style={{ fontSize:13, fontWeight:600, color:"#E2E8F0" }}>{focused.title}</div>
                <div style={{ fontSize:10, color:"#64748B", marginTop:2 }}>{focused.category} · {focused.source}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:22, fontWeight:800, color:"#38BDF8" }}>{focused.composite_score.toFixed(4)}</div>
                <div style={{ fontSize:10, color:"#64748B" }}>composite score</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                {Object.entries(focused.signal_breakdown||{}).map(([signal, val]) => (
                  <div key={signal} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <div>
                        <span style={{ fontSize:11, fontWeight:600, color:"#E2E8F0", textTransform:"capitalize" }}>{signal}</span>
                        <div style={{ fontSize:9, color:"#64748B" }}>{SIG_PLAIN[signal]}</div>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:SIG_COLORS[signal]||"#38BDF8" }}>{(val as number).toFixed(4)}</span>
                    </div>
                    <div style={{ background:"#1F2937", height:5, borderRadius:3 }}>
                      <div style={{ background:SIG_COLORS[signal]||"#38BDF8", height:5, borderRadius:3, width:`${Math.min(((val as number)/focused.composite_score)*100,100)}%`, transition:"width 0.5s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
              {radarOption && <ReactECharts option={radarOption} style={{ height:200 }} />}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TanStack Table */}
      <Card style={{ background:"#0F1923", border:"0.5px solid #1F2937", overflow:"hidden" }}>
        <CardHeader style={{ padding:"10px 14px", borderBottom:"1px solid #1F2937" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:10, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.08em" }}>
              Full Ranking Table — click column headers to sort
            </div>
            <input
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              style={{
                background:"#0B1117", border:"0.5px solid #1F2937", borderRadius:5,
                padding:"4px 10px", fontSize:11, color:"#E2E8F0", outline:"none", width:140,
              }}
            />
          </div>
        </CardHeader>
        <CardContent style={{ padding:0 }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
              <thead>
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id} style={{ borderBottom:"1px solid #1F2937" }}>
                    {hg.headers.map(header => (
                      <th key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          padding:"8px 12px", textAlign:"left", color:"#64748B",
                          fontWeight:500, fontSize:10, textTransform:"uppercase",
                          letterSpacing:"0.06em", whiteSpace:"nowrap",
                          cursor: header.column.getCanSort() ? "pointer" : "default",
                          userSelect:"none",
                        }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? " ↑" : header.column.getIsSorted() === "desc" ? " ↓" : ""}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, i) => (
                  <tr key={row.id}
                    onClick={() => setSelected(row.original)}
                    style={{
                      borderBottom:"1px solid #1F2937", cursor:"pointer",
                      background: selected?.id === row.original.id ? "rgba(56,189,248,0.04)" : i%2===0 ? "transparent" : "rgba(255,255,255,0.01)",
                      transition:"background 0.15s",
                    }}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} style={{ padding:"7px 12px" }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}