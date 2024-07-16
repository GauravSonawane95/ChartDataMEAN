import { Component } from '@angular/core';
import {  OnInit } from '@angular/core';
import { ApiService,ChartData } from '../api.service';
import * as d3 from 'd3';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent {
  chartData: ChartData[] = [];
  filteredData: ChartData[] = [];
  filters: any = {
    end_year: '',
    topic: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    swot: '',
    country: '',
    city: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchChartData();
  }

  fetchChartData(): void {
    this.apiService.getChartData().subscribe((data: ChartData[]) => {
      this.chartData = data;
      this.filteredData = data;
      this.createCharts();
    });
  }

  applyFilters(): void {
    this.filteredData = this.chartData.filter(item => {
      return (!this.filters.end_year || item.end_year.includes(this.filters.end_year)) &&
             (!this.filters.topic || item.topic.includes(this.filters.topic)) &&
             (!this.filters.sector || item.sector.includes(this.filters.sector)) &&
             (!this.filters.region || item.region.includes(this.filters.region)) &&
             (!this.filters.pestle || item.pestle.includes(this.filters.pestle)) &&
             (!this.filters.source || item.source.includes(this.filters.source)) &&
             
             (!this.filters.country || item.country.includes(this.filters.country)) 
          
    });
    this.createCharts();
  }

  getUniqueValues(key: keyof ChartData): any[] {
    const values = this.chartData
      .map(item => item[key])
      .filter((value, index, self) => self.indexOf(value) === index);
    return values.filter(value => value !== undefined && value !== null && value !== '');
  }

  createCharts(): void {
    d3.select('#barChart').selectAll('*').remove();
    d3.select('#pieChart').selectAll('*').remove();
    d3.select('#lineChart').selectAll('*').remove();
    this.createBarChart();
    this.createPieChart();
    this.createLineChart();
  }

  createBarChart(): void {
    const svg = d3.select('#barChart')
      .append('svg')
      .attr('width', 500)
      .attr('height', 400);

    const margin = { top: 20, right: 30, bottom: 40, left: 90 },
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(this.filteredData, d => d.intensity) as number])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(this.filteredData.map(d => d.topic))
      .range([height, 0])
      .padding(0.1);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    g.selectAll('.bar')
      .data(this.filteredData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d.topic) as number)
      .attr('width', d => x(d.intensity))
      .attr('height', y.bandwidth());
  }

  createPieChart(): void {
    const width = 500,
          height = 400,
          radius = Math.min(width, height) / 2;

    const svg = d3.select('#pieChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(this.filteredData.map(d => d.topic))
      .range(d3.schemeCategory10);

    const pie = d3.pie<ChartData>()
      .value(d => d.likelihood);

    const arc = d3.arc<d3.PieArcDatum<ChartData>>()
      .innerRadius(0)
      .outerRadius(radius);

    const data_ready = pie(this.filteredData);

    svg.selectAll('path')
      .data(data_ready)
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.topic));
  }

  createLineChart(): void {
    const svg = d3.select('#lineChart')
      .append('svg')
      .attr('width', 500)
      .attr('height', 400);

    const margin = { top: 20, right: 30, bottom: 40, left: 50 },
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(this.filteredData, d => new Date(d.published)) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.filteredData, d => d.relevance) as number])
      .range([height, 0]);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    g.append('path')
      .datum(this.filteredData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', d3.line<ChartData>()
        .x(d => x(new Date(d.published)))
        .y(d => y(d.relevance))
      );
  }
}
