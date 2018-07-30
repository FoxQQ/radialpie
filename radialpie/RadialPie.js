class RadialPie extends  BasicChart{
    constructor(data){
        data=data.sort((a,b)=>a['value'] - b['value']);
        super(data);

        function mousemove(d,i){

            d3.select(this).attr('stroke',colors[i]);
            d3.select('#overg').append('text')
                .attr('dy',-ir/2)
                .attr('dx',-40)
                .attr('textLength',80)
                .text(d.country+':'+d.value)
                .attr('style','font: italic 1.0em sans-serif;')
                .attr('id','speed-text');

            //console.log(d3.event.clientX,d3.event.clientY );
            d3.select('#speed')
                .transition()
                .ease(d3.easeBounce)
                .duration(500)
                .attr('transform',`rotate(${(d.start_angle*rad2deg)})`); //+((d.value/sumvals)*full)/2)

        }

        function mouseout(d,i){
            d3.select(this).attr('stroke','#fff');
            //console.log(d);
            d3.select('#speed')
                .transition()
                .duration(200)
                .attr('transform',`rotate(${-start_angle*rad2deg})`);
            d3.select('#speed-text')
                .remove();
        }

        console.log(data);
        const rad2deg=57.2958;
       var pies = this.chart.append('g')
           .attr('transform',`translate(${this.width/2},${this.height/2})`);



       var sumvals = d3.sum(data, (d)=>d.value);

       var or = 100,
            ir = 80,
            angle=2/3,
            full=Math.PI*4/3,
            start_angle=-Math.PI*angle;
        data.forEach((d,i)=>{
            d['start_angle']=start_angle;
            start_angle+=(d.value/sumvals)*full+Math.PI/360;
        });

       var colors = ['#ff0000','#00ff00','#0000ff','#ff00ff','#00ffff'];

       var arcs = d3.arc()
           .innerRadius(ir)
           .outerRadius(or)
           .startAngle((d)=>d.start_angle)
           .endAngle((d)=>d.start_angle+(d.value/sumvals)*full);


        pies.selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', arcs)
            .attr('class',(d)=>d.country)
            .attr('fill',(d,i)=>colors[i])
            .attr('stroke','white')
            .attr('stroke-width','0.1em')
            .on('mouseover', mousemove)
            .on('mouseout', mouseout);

        var total_val  = this.chart.append('g')
            .attr('transform',`translate(${this.width/2},${this.height/2})`);

        let total_width=200;
        total_val.append('text')
            .attr('dx',-total_width/2)
            .attr('dy',ir)
            .attr('textLength',total_width)
            .classed('total-text',true)
            .attr('style','font: italic 2.5em sans-serif;')
            .text(sumvals);

        var overg = this.chart.append('g')
            .attr('id','overg')
            .attr('transform',`translate(${this.width/2},${this.height/2})`);

        overg.append('circle')
            .attr('cx',0)
            .attr('cy',0)
            .attr('r',10)
            .attr('fill','black');
        var speed = overg.append('line')
            .attr('x1',0)
            .attr('y1',0)
            .attr('x2',0)
            .attr('y2',-or)
            .attr('id','speed')
            .attr('style','stroke:black;stroke-width:2;')
            .attr('transform',`rotate(${-start_angle*rad2deg})`);

        ;
    }


}