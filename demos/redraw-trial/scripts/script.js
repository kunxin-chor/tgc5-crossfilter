let cf, chart,dim,group,pie;
axios.get('fruits.json').then(r=>{
    cf = crossfilter(r.data.fruits);  
    dim = cf.dimension('name');
    console.table(dim.top(10));
    group = dim.group().reduceSum(d=>d.price);
    console.table(group.top(10));
    chart = new dc.LineChart('#line-chart')
        .width(500)
        .height(300)
        .dimension(dim)
        .group(group)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .xAxisLabel('Fruit')
        .yAxisLabel('Price')
        .ordinalColors(d3.schemeSet1);

        chart.render();
    
    pie = dc.pieChart("#pie-chart");
    pie.height(275).width(275).dimension(dim).group(group);
    pie.render();
})

$("#load-more-btn").click(function(){

    // cf.remove(()=>true);
    cf.add( [
    {
      "name" : "Apple",
      "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/265px-Red_Apple.jpg",
      "price" : 40
    },
    {
      "name" : "Banana",
      "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Bananas_white_background_DS.jpg/320px-Bananas_white_background_DS.jpg",
      "price" : 120
    },
    {
      "name" : "Grapes",
      "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Table_grapes_on_white.jpg/320px-Table_grapes_on_white.jpg",
      "weight": 0.1,
      "price" : 75
    },
    {
      "name" : "Pineapple",
      "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Pineapple_and_cross_section.jpg/286px-Pineapple_and_cross_section.jpg",
      "price" : 260
    },
    {
       "name" : "Durian",
      "image" : "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Pineapple_and_cross_section.jpg/286px-Pineapple_and_cross_section.jpg",
      "price" : 300
    }
  ])
    chart.render();
    pie.render();
})