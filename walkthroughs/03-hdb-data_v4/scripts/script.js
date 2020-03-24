$(function(){
    let parameters = {
        resource_id: '52e93430-01b7-4de0-80df-bc83d0afed40', // the resource id
        limit:100
    };
    let apiURL = "https://data.gov.sg/api/action/datastore_search";
    axios.get(apiURL,{
        params: parameters
    }).then(function(response){
        let records = response.data.result.records;
        let cf = crossfilter(records);
        let quarterDimension = cf.dimension(d => d.quarter);
        let indexGroup = quarterDimension.group().reduceSum(d => d.index);

        let c1 = new dc.LineChart("#line-chart");
        c1
            .width(1000)
            .height(400)
            .margins({top:100, left:50, right:50, bottom:50})
           .brushOn(true)
            .dimension(quarterDimension)   // x axis
            .group(indexGroup)
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .yAxis().ticks(4);
    

        let yearDimension = cf.dimension( d => parseInt(d.quarter.substring(0,4)));
        let indexByYearGroup = yearDimension.group().reduceSum(d=>d.index);
        console.table(yearDimension.top(10));
        console.table(indexByYearGroup.top(10));
        
        let c2 = new dc.LineChart('#line-chart-by-year');
        c2
            .width(1000)
            .height(600)
            .margins({top:50, left:50, right:50, bottom:50})
            .brushOn(true)
            .dimension(yearDimension)
            .group(indexByYearGroup)
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .yAxis().ticks(4)        

        apply_resizing(c1, 20, 100);
        apply_resizing(c2, 20, 100);

        // after defining all the charts
        dc.renderAll();

    })
})