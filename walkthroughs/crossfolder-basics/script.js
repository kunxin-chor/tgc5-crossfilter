let csvOptions = {
    colParser: {
        'Units':'Number'  // the Units column is meant to store numerical data
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


    })


    
})