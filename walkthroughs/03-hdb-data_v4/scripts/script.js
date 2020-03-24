    let cf = null; // note: future crossfilter dataset

    let c1, c2;

$(function(){



    let parameters = {
        resource_id: '52e93430-01b7-4de0-80df-bc83d0afed40', // the resource id
        limit:100,
        offset:0
    };

    let apiURL = "https://data.gov.sg/api/action/datastore_search";
    $("#load-more-btn").click(function(){
        axios.get(apiURL,{
            params:parameters
        }).then(function(response){
            console.log(response.data);
            cf.add(response.data.result.records);
            // dc.renderAll();
            c1.colors(['red']);
            c2.colors(['green']);
            c1.redraw();
            c2.redraw();
            parameters.offset += response.data.result.records.length;
        })
    })


    axios.get(apiURL,{
        params: parameters
    }).then(function(response){
        // increase offset by 100
        parameters.offset += response.data.result.records.length;

        let records = response.data.result.records;
        cf = crossfilter(records);
        let quarterDimension = cf.dimension(d => d.quarter);
        let indexGroup = quarterDimension.group().reduceSum(d => d.index);

        c1 = new dc.LineChart("#line-chart");
        c1
            .width(1000)
            .height(400)
            .colors(['red'])
            .margins({top:100, left:50, right:50, bottom:50})
           .brushOn(false)
            .dimension(quarterDimension)   // x axis
            .group(indexGroup)
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .yAxis().ticks(4);
    

        let yearDimension = cf.dimension( d => parseInt(d.quarter.substring(0,4)));
        let indexByYearGroup = yearDimension.group().reduceSum(d=>d.index);
        console.table(yearDimension.top(10));
        console.table(indexByYearGroup.top(10));
        
        c2 = new dc.LineChart('#line-chart-by-year');
        c2
            .width(1000)
            .height(600)
            .colors(['green'])
            .margins({top:50, left:50, right:50, bottom:50})
            .brushOn(false)
            .dimension(yearDimension)
            .group(indexByYearGroup)
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .yAxis().ticks(4)        

        // apply_resizing(c1, 20, 100);
        // apply_resizing(c2, 20, 100);

        // after defining all the charts
        c1.render();
        c2.render();

    })
})