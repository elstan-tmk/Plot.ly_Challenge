// Build function to read json file using d3

function buildMetadata(sample) {
    d3.json("../data/samples.json").then((data) => {
      var metadata= data.metadata;
      console.log(metadata)

      var buildingarray= metadata.filter(sampleobject => sampleobject.id == sample);
      var result= buildingarray[0];
      
      var paneldata = d3.select("#sample-metadata");

            paneldata.html("");
      Object.entries(result).forEach(([key, value]) => {
        paneldata.append("h6").text(`${key}: ${value}`);
      });    
    });
  }


function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  d3.json("../data/samples.json").then((data) => {
    var samples= data.samples;
    var buildingarray= samples.filter(sampleobject => sampleobject.id == sample);
    var result= buildingarray[0]

    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;


    // Build a Bubble Chart using the sample data
    var bubbleChart = {
      margin: { t: 0 },
      xaxis: { title: "Id's" },
      hovermode: "closest",
      };

      var bubbleData = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];

    Plotly.plot("bubble", bubbleData, bubbleChart);

    //  Build a bar Chart
    
    var bar_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"

      }
    ];

    var chartLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", bar_data, chartLayout);
  });
}
   
 
function init() {
  
  var selector = d3.select("#selDataset");

  d3.json("../data/samples.json").then((data) => {
    var name = data.names;

    name.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = name[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {

  buildCharts(newSample);
  buildMetadata(newSample);
}

init();