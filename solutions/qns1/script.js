axios.get('data.csv').then(function(response){
    csv({
        colParser: {
            'Unit Cost':'number'
        }
    }).fromString(response.data).then(function(data){
        let cf = crossfilter(data);
        // the first argument in the annoymous function refers
        // to the entire crossfilter instance (that is, the entire table)

        // create a dimension (i.e, a copy of the table) where the critera is the\
        // Item column.
        let itemDimension = cf.dimension(data=>data.Item);

        // show the top 3 rows by the sort order of the item name
        console.table(itemDimension.top());

        let unitCostDimension = cf.dimension(data=>data["Unit Cost"]);
        console.table(unitCostDimension.top(50));

        // filter to show only pencils
        // takes in one argument which is the filtering function
        // and the filtering function takes in one argument which
        // is the value of the critera column for a row.
        itemDimension.filter(function(item){
            return item == "Pencil";
        })
        console.log("After filtering for pencil only")
        console.table(itemDimension.top(50));

        // Show the top costing product only
        console.table(unitCostDimension.top(50));

        /////// SALES PERSON DIMENSION ///////////////////
        let salesPersonDimension = cf.dimension(data => data.Rep);
        console.log("Sales person dimension")
        console.table(salesPersonDimension.top(50));

        // END FILTERING
        itemDimension.filterAll();

        /////// SALES PERSON DIMENSION ///////////////////
        console.log("Sales person dimension")
        console.table(salesPersonDimension.top(50));

        salesPersonDimension.filter(r => r == "Jones");
        console.table(salesPersonDimension.top(50));

        itemDimension.filter(r => r == "Pencil");
        console.table(salesPersonDimension.top(50));

        console.log("SHOW ALL PENCIL SALES DONE BY ANYONE BUT JONES -->");
        salesPersonDimension.filter( r => r != "Jones");
        console.table(salesPersonDimension.top(50));


    })
}); // end axios