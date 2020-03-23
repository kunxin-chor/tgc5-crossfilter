axios.get('transactions.json').then(function(response){

    // ALWAYS MASSAGE THE DATA (data wrangling) FIRST
    for (let eachEntry of response.data) {
        eachEntry.date = moment(eachEntry.date, "DD/MM/YYYY").toDate();
    }
    let cf = crossfilter(response.data);
    // person dimension
    let personDimension = cf.dimension('name');
    let personGroup= personDimension.group();
    let personSpending = personGroup.reduceSum(r => r.spend);
     console.table(personSpending.top(50));

    // date dimension

    let dateDimension = cf.dimension(r => r.date);
    // extract out the min date (or the smallest date)
    let min_date = dateDimension.bottom(1)[0].date;

    // extract out the maximum date (or the largest date)
    let max_date = dateDimension.top(1)[0].date;

    let monthlySpend = dateDimension.group().reduceSum(r => r.spend);
    console.table(monthlySpend.top(100));

    dc.lineChart('#graph')
    .width(1000)
    .height(300)
    .margins({top: 10, right:50, bottom:30, left:50})
    .dimension(dateDimension)
    .group(monthlySpend)
    .x(d3.scaleTime().domain([min_date, max_date]))
    .xAxisLabel("Month")
    .yAxis().ticks(4);

    dc.pieChart('#pie-chart')
    .colors(d3.scaleOrdinal().domain(["Alice", "Bob", "Tom"]).range(['red', 'green', 'blue']))
    .colorAccessor(function(d){
        return d.key;
    })
    .height(300)
    .radius(90)
    .dimension(personDimension)
    .group(personSpending)
    

    let barColorCount = 0;
    dc.barChart('#bar-chart')
    .width(300)
    .height(150)
    .margins({top: 10, right:50, bottom:30, left:50})
    .dimension(personDimension)
    .group(personSpending)
    .x(d3.scaleOrdinal())
    .colors(d3.scaleOrdinal().domain([0,1,2,3]).range(['red', 'green', 'blue']))
    .colorAccessor(function(d){
        return barColorCount++ % 2;
    })
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Person")
    .yAxis().ticks(5);


    // render all the charts
    dc.renderAll();

   
})