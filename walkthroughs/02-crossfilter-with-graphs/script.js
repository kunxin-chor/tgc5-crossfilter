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

    console.log(min_date);
    console.log(max_date);

    let monthlySpend = dateDimension.group().reduceSum(r => r.spend);
    console.table(monthlySpend.top(100));

    dc.lineChart('#graph')
    .width(1000)
    .height(300)
    .margins({top: 10, right:50, bottom:30, left:50})
    .dimension(dateDimension)
    .group(monthlySpend)
    .x(d3.time.scale().domain([min_date, max_date]))
    .xAxisLabel("Month")
    .yAxis().ticks(4);


    dc.renderAll();

   
})