function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample   
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObject => sampleObject.id == sample);
    var result = resultArray[0]
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select(`#sample-metadata`);

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
        panel.append("h6").text(`${key}:${value}`);
    });

    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
});
}
function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = resultArray[0]
    var x = result.otu_ids;           
    var y = result.sample_values;
    var label = result.otu_labels;

    //Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
    var y_ticks = x.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var trace1 = {                                                                                           
      y: y_ticks,
      x: x.slice(0, 10).reverse(),
      text: label,
      type: "bar",
      orientation: "h"};

    var data1 = [trace1];

    Plotly.newPlot("bar", data1);       
    

    // @TODO: Build a Bubble Chart using the sample data
    var trace2 = {
      x: x,
      y: y,
      mode:"markers", 
      marker:{
        size: y,
        color: x,
        colorscale: "Rainbow",
        labels: label,
        type: 'scatter',
        opacity: 0.5}
      }
    var data2 = [trace2];

    var layout = {
      xaxis: { title: 'OTU ID' },
      showlegend: true
    };
    Plotly.newPlot("bubble", data2, layout); 
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((sampleNames) => {
    var samplenames = sampleNames.names
    samplenames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = samplenames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
