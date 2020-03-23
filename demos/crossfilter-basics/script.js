let cf = null;

axios.get("../../data/data.csv").then(function(response) {
  let data = csv({
      colParser:{
          'Units':'number',
          'Total':'number'
      }
  }).fromString(response.data).then(function(data) {
    console.log(data);
    cf = crossfilter(data);

    // count how many data points there
    console.log("Size = " + cf.size());

    // A dimension is one column, or one property
    let soldDimension = cf.dimension(d => d.Units);
    console.log("Top 3 sold in terms of units");
    console.table(soldDimension.top(3));

    console.log("Bottom 3 sold in terms of units");
    console.table(soldDimension.bottom(3));

    // derived dimension
    let sold50OrMore = cf.dimension(d => d.Units > 50);
    console.log("Dimension of sold more than 50 units");
    console.table(sold50OrMore.top(10))
    console.log("Size of dimension = " + sold50OrMore.top(Number.POSITIVE_INFINITY).length);

    // let do filtering
    // filtering is done on a dimension, but affect everything based on the same crossfilter
    sold50OrMore.filter(d => d == true);
    console.log("AFTER FILTERING ****");
    console.log("Dimension of sold more than 50 units");
    console.table(sold50OrMore.top(10))
    console.log("Size of dimension = " + sold50OrMore.top(Number.POSITIVE_INFINITY).length);    

    // Check the other dimensions
    console.log("AFTER FILTERING: bottom 3 units sold");
    console.table(soldDimension.bottom(3));
    

    // Reset the filter for the sold more than 50
    console.log("Removing filter ***");
    sold50OrMore.filterAll();
    console.log("Showing worst 3 sold in term of units")
    console.table(soldDimension.bottom(3));

    // Grouping data
    console.log("GROUPING DATA ***");
    console.log("Total units sold, by product type");

    // 1. create the dimension that we want to group by:
    let productDimension = cf.dimension(d => d.Item);

    // 2. Do the grouping and save it in another variable
    let productGroup = productDimension.group(); // --> we want to group the original data by the product dimension
    console.log("Grouping by product type");
    console.table(productGroup.all());

    // Get the total units sold for each group
    productGroup.reduceSum(d => d.Units);
    console.table(productGroup.all());
    

  });
});
