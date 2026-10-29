import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PieChart, BarChart2, TrendingUp, BookOpen, Sparkles } from 'lucide-react';

export interface CourseProgressItem {
  id: string;
  code: string;
  name: string;
  masteryPercentage: number;
  solvedQuestions: number;
  totalQuestions: number;
  color: string;
}

interface CourseProgressChartProps {
  data?: CourseProgressItem[];
  onCourseClick?: (courseId: string) => void;
}

const defaultCourseData: CourseProgressItem[] = [
  {
    id: 'mat101',
    code: 'MAT 101',
    name: 'Genel Matematik I',
    masteryPercentage: 82,
    solvedQuestions: 52,
    totalQuestions: 65,
    color: '#4f46e5', // indigo-600
  },
  {
    id: 'fiz101',
    code: 'FIZ 101',
    name: 'Genel Fizik I',
    masteryPercentage: 88,
    solvedQuestions: 44,
    totalQuestions: 50,
    color: '#06b6d4', // cyan-500
  },
  {
    id: 'bm102',
    code: 'BM 102',
    name: 'Ayrık Matematik',
    masteryPercentage: 78,
    solvedQuestions: 38,
    totalQuestions: 48,
    color: '#9333ea', // purple-600
  },
  {
    id: 'eem201',
    code: 'EEM 201',
    name: 'Devre Teorisi I',
    masteryPercentage: 70,
    solvedQuestions: 26,
    totalQuestions: 37,
    color: '#f59e0b', // amber-500
  },
  {
    id: 'eko101',
    code: 'EKO 101',
    name: 'Mikroekonomi',
    masteryPercentage: 91,
    solvedQuestions: 32,
    totalQuestions: 35,
    color: '#10b981', // emerald-500
  },
  {
    id: 'yzk101',
    code: 'YZK 101',
    name: 'YZ Destekli Kodlama',
    masteryPercentage: 86,
    solvedQuestions: 41,
    totalQuestions: 48,
    color: '#ec4899', // pink-500
  },
];

export const CourseProgressChart: React.FC<CourseProgressChartProps> = ({
  data = defaultCourseData,
  onCourseClick,
}) => {
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [hoveredCourse, setHoveredCourse] = useState<CourseProgressItem | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Calculate average overall mastery
  const avgMastery = Math.round(
    data.reduce((acc, c) => acc + c.masteryPercentage, 0) / data.length
  );
  const totalSolved = data.reduce((acc, c) => acc + c.solvedQuestions, 0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 420;
    const height = 280;

    if (chartType === 'donut') {
      renderDonutChart(svg, width, height);
    } else {
      renderBarChart(svg, width, height);
    }
  }, [chartType, data]);

  // D3 Donut Chart Renderer
  const renderDonutChart = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    width: number,
    height: number
  ) => {
    const radius = Math.min(width, height) / 2 - 20;
    const innerRadius = radius * 0.58;

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<CourseProgressItem>()
      .value((d) => d.solvedQuestions)
      .sort(null)
      .padAngle(0.035);

    const arc = d3
      .arc<d3.PieArcDatum<CourseProgressItem>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(8);

    const arcHover = d3
      .arc<d3.PieArcDatum<CourseProgressItem>>()
      .innerRadius(innerRadius - 4)
      .outerRadius(radius + 8)
      .cornerRadius(8);

    const arcs = g
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .style('cursor', 'pointer');

    arcs
      .append('path')
      .attr('d', arc as any)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .style('transition', 'all 0.25s ease')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arcHover as any)
          .style('filter', 'drop-shadow(0px 6px 12px rgba(0,0,0,0.18))');
        setHoveredCourse(d.data);
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arc as any)
          .style('filter', 'none');
        setHoveredCourse(null);
      })
      .on('click', (_event, d) => {
        if (onCourseClick) onCourseClick(d.data.id);
      });

    // Donut Center Text
    const centerG = g.append('g').attr('text-anchor', 'middle');

    centerG
      .append('text')
      .attr('dy', '-0.2em')
      .attr('font-size', '22px')
      .attr('font-weight', '900')
      .attr('fill', '#1e293b')
      .text(`%${avgMastery}`);

    centerG
      .append('text')
      .attr('dy', '1.3em')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('fill', '#64748b')
      .attr('letter-spacing', '0.05em')
      .text('ORTALAMA HAKİMİYET');
  };

  // D3 Bar Chart Renderer
  const renderBarChart = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    width: number,
    height: number
  ) => {
    const margin = { top: 20, right: 30, bottom: 40, left: 75 };
    const chartW = width - margin.left - margin.right;
    const chartH = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.code))
      .range([0, chartH])
      .padding(0.35);

    const x = d3.scaleLinear().domain([0, 100]).range([0, chartW]);

    // Background track bars (100%)
    g.selectAll('.track-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('y', (d) => y(d.code) || 0)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', chartW)
      .attr('fill', '#f1f5f9')
      .attr('rx', 6);

    // Active progress bars
    g.selectAll('.value-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'value-bar')
      .attr('y', (d) => y(d.code) || 0)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('width', 0) // start at 0 for transition
      .attr('fill', (d) => d.color)
      .attr('rx', 6)
      .style('cursor', 'pointer')
      .on('mouseenter', function (_event, d) {
        d3.select(this).style('opacity', '0.85');
        setHoveredCourse(d);
      })
      .on('mouseleave', function () {
        d3.select(this).style('opacity', '1');
        setHoveredCourse(null);
      })
      .on('click', (_event, d) => {
        if (onCourseClick) onCourseClick(d.id);
      })
      .transition()
      .duration(650)
      .attr('width', (d) => x(d.masteryPercentage));

    // Value percentage text inside or next to bars
    g.selectAll('.label-text')
      .data(data)
      .enter()
      .append('text')
      .attr('x', (d) => x(d.masteryPercentage) + 6)
      .attr('y', (d) => (y(d.code) || 0) + y.bandwidth() / 2 + 4)
      .attr('font-size', '11px')
      .attr('font-weight', '800')
      .attr('fill', '#334155')
      .text((d) => `%${d.masteryPercentage}`);

    // Y Axis (Course Codes)
    g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .select('.domain')
      .remove();

    g.selectAll('.tick text')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('fill', '#1e293b');

    // Bottom Axis (Grid line at 50% and 100%)
    const xAxis = d3
      .axisBottom(x)
      .ticks(4)
      .tickFormat((d) => `%${d}`);

    g.append('g')
      .attr('transform', `translate(0, ${chartH})`)
      .call(xAxis)
      .select('.domain')
      .attr('stroke', '#cbd5e1');

    g.selectAll('.tick line').attr('stroke', '#e2e8f0');
    g.selectAll('.tick text').attr('font-size', '10px').attr('fill', '#64748b');
  };

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5"
    >
      {/* Header and Toggle Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Ders Bazlı İlerleme & Konu Hakimiyeti
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              D3.js
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Aktif dönem derslerindeki çözülen soru oranları ve genel başarı eğrisi
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setChartType('donut')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              chartType === 'donut'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Pasta Grafik</span>
          </button>

          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              chartType === 'bar'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Çubuk Grafik</span>
          </button>
        </div>
      </div>

      {/* Main Chart and Dynamic Hover Tooltip / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Container */}
        <div className="md:col-span-7 flex items-center justify-center relative">
          <svg
            ref={svgRef}
            viewBox="0 0 420 280"
            className="w-full max-w-[420px] h-auto select-none overflow-visible"
          />
        </div>

        {/* Interactive Legend and Course Stats List */}
        <div className="md:col-span-5 space-y-2.5">
          {data.map((c) => {
            const isHovered = hoveredCourse?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => onCourseClick && onCourseClick(c.id)}
                className={`cursor-pointer p-2.5 rounded-xl border transition flex items-center justify-between text-xs ${
                  isHovered
                    ? 'border-indigo-400 bg-indigo-50/50 shadow-sm scale-[1.02]'
                    : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <div>
                    <span className="font-bold text-slate-800">{c.code}</span>
                    <span className="text-[11px] text-slate-500 block line-clamp-1">
                      {c.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900">%{c.masteryPercentage}</span>
                  <span className="text-[10px] text-slate-500 block">
                    {c.solvedQuestions} / {c.totalQuestions} Soru
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Inspector Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <span>
            {hoveredCourse ? (
              <span>
                Seçili: <strong className="text-slate-900">{hoveredCourse.name}</strong> ({hoveredCourse.solvedQuestions} çözülmüş soru, %{hoveredCourse.masteryPercentage} başarı)
              </span>
            ) : (
              <span>
                Toplam Çözülen: <strong className="text-slate-900">{totalSolved} Soru</strong> • Dönem Ortalaması: <strong className="text-indigo-600">%{avgMastery}</strong>
              </span>
            )}
          </span>
        </div>

        <span className="text-[11px] text-slate-400">
          Grafik dilimine veya ders adına tıklayarak derse gidebilirsiniz.
        </span>
      </div>
    </div>
  );
};
