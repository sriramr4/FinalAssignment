  const statedata =  d3.csv("./data/statedata.csv").then(function(data) 
  {
    return data   
  });
  
  statedata.then(function(data) {
  var max = (d3.max(data, function(d) { return parseInt(d.value); }));
   
  const svg = d3.select('svg');
  const svgContainer = d3.select('#container');
  
  const margin = 100;
  const width = 1000 - 2 * margin;
  const height = 600 - 2 * margin;


	
  const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

  const xScale = d3.scaleBand()
    .range([0, width])
    .domain(data.map((s) => s.state))
    .padding(0.4)
  
  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0,  d3.max(data, function(d) { return parseInt(d.value); })]);    

  const makeYLines = () => d3.axisLeft()
    .scale(yScale)

  chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("y", 5)
    .attr("x", -50)
    .attr("dy", "-.2em")
    .attr("transform", "rotate(-90)")  ;

  chart.append('g')
    .call(d3.axisLeft(yScale));

  chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
      .tickSize(-width, 0, 0)
      .tickFormat('')
    )

  const barGroups = chart.selectAll()
    .data(data)
    .enter()
    .append('g')
	
	  
    var tooltip = 
		d3.select("body")
		.append("div")
		.attr("class", "toolTip");
	

  barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.state))
    .attr('y', (g) => yScale(g.value))
    .attr('height', (g) => height - yScale(g.value))
    .attr('width', xScale.bandwidth())
     .on('click', function (actual, i) {        
         url = './uscountybystated3js.html?state=' + actual.state;
         document.location.href = url;      
     })
      .on("mousemove", function(d){
         tooltip
           .style("visibility", "visible")
		   .style("left", (d3.event.pageX + 15) + "px")		
		   .style("top", (d3.event.pageY - 100) + "px")
		   .style("opacity", .7)
           .style("display", "inline-block")
		   
           .html("<font color=black name = Times ><center><b> Number of Cases in "+(d.state)+"<br>"+ numberWithCommas(d.value) + "</b></font></center>");
     })
	 

    .on('mouseenter', function (actual, i) {
      d3.selectAll('.value')
        .attr('opacity', 0)
	
        
      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
		.attr('x', (a) => xScale(a.state) - 5)
        .attr('width', xScale.bandwidth() + 10)
		
      console.log(actual.state)
      const y = yScale(actual.value)
      

      barGroups.append('text')
        .attr('x', (a) => xScale(a.state) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.value) + 30)
        .attr('fill', 'Black')
        .attr('text-anchor', 'middle')
		.text(function(d) { return a.value; })
		
		

    })
    .on('mouseleave', function () {
      d3.selectAll('.value')
        .attr('opacity', 1)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('x', (a) => xScale(a.state))
        .attr('width', xScale.bandwidth())
		
	  
      chart.selectAll('#limit').remove()
      chart.selectAll('.divergence').remove()
	  
    })
	
	.on ('mouseout',function (){
		d3.selectAll('.tooltip')
			.style("visibility", "hidden");
	})
	
  barGroups 
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.state) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.value) + 30)
    .attr('text-anchor', 'middle')
  
  svg
    .append('text')
    .attr('class', 'title')
    .attr('x', -(height / 2) - margin)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Covid Cases')

  svg.append('text')
	.transition()
	.style('opacity',1)
    .attr('class', 'label')
    .attr('x', 800)
    .attr('y', 150)
    .attr('text-anchor', 'middle')
	.text('New York with Highest Number of Cases -' + numberWithCommas(max))


	svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Number of Covid-19 Cases in the United States')
	

  svg.append('text')
    .attr('class', 'source')
    .attr('x', width - margin / 2)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'start')
	

});
 document.body.innerHTML = document.body.innerHTML + "<br>"
  document.body.innerHTML = document.body.innerHTML + "<font size =5><B><Center>As of <I>8/01/2020 </I> Number of Covid Cases in the USA has reached to <BR><I> "+numberWithCommas(196385369)+"  </B></i></center> </font>";


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

