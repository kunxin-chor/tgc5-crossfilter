let csvOptions = {
    checkType:true,
    colParser: {
        'Total':function(item) {
            // the replace is part known as 'regular expressions'
            return parseFloat(item.trim().replace(/,/g, ''));
        }
    }

}

axios.get('data.csv').then(function(response){
    csv(csvOptions).fromString(response.data).then(function(data){
        
        // create an instance of a crossfilter
        let cf = crossfilter(data);

        // compare a crossfilter instance to an excel file

        // count the number of rows
        console.log(cf.size());

        // a dimension represents ONE column
        // let unitDimension = cf.dimension(function(data){
        //     return data.Units
        // });
        let unitDimension = cf.dimension(data => data.Units);

        console.log("Top 5 transactions by units")
        console.table(unitDimension.top(5));

        console.log("Bottom 5 transactions by units")
        console.table(unitDimension.bottom(5))

        // create a dimension (or add in a new column) which indicates for that row if it sold more than 50 units
        let sold50OrMore = cf.dimension(data => data.Units > 50);
        console.log("Top 5 transactions by units, but minimal 51 and above")
        console.table(sold50OrMore.top(5));
        console.log("Bottom 5 transactions by units, but minimal 51 and above");
        console.table(sold50OrMore.bottom(5));

        console.log("AFTER FILTERING ---- ")
        sold50OrMore.filter(d => d== true);
        console.log("Top 5 transactions by units, but minimal 51 and above")
        console.table(sold50OrMore.top(5));
        console.log("Bottom 5 transactions by units, but minimal 51 and above");
        console.table(sold50OrMore.bottom(5));

        console.log("Top 5 transactions by units")
        console.table(unitDimension.top(5));

        console.log("Bottom 5 transactions by units")
        console.table(unitDimension.bottom(5))

        console.log("REMOVING FILTER----");
        sold50OrMore.filterAll();

        // GROUP BY ITEM NAME
        let itemDimension = cf.dimension(r => r.Item);
        let itemGroup  = itemDimension.group();

        console.table(itemDimension.top(50));

        itemGroup.reduceSum(r => r.Units) // for each group, add the Units column for all the rows
        console.table(itemGroup.top(10));

        // GROUP BY REP
        let repDimension = cf.dimension(r=>r.Rep);
        let repGroup = repDimension.group();
        repGroup.reduceSum(r => r.Total);
        console.table(repGroup.top(20));


    })


    
})