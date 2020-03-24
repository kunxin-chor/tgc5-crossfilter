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

        let c1 = dc.lineChart("#line-chart")
            .width(1000)
            .height(400)
          //  .brushOn(true)
            .dimension(quarterDimension)   // x axis
            .group(indexGroup)
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .yAxis().ticks(4);
    

        let yearDimension = cf.dimension( d => parseInt(d.quarter.substring(0,4)));
        let indexByYearGroup = yearDimension.group().reduceSum(d=>d.index);
        console.table(yearDimension.top(10));
        console.table(indexByYearGroup.top(10));
        
        let c2 = dc.lineChart('#line-chart-by-year')
            .width(1000)
            .height(400)
           // .brushOn(true)
            .dimension(yearDimension)
            .group(indexByYearGroup)
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .yAxis().ticks(4)        

        apply_resizing(c1, 20);
        apply_resizing(c2, 20);

        // after defining all the charts
        dc.renderAll();

    })
})