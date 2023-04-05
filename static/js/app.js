// Use the D3 library to read in samples.json from the URL
// https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
const sampleUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
var sampleData = undefined;

d3.json(sampleUrl).then(function(data) {
    sampleData = data;
    const selector = d3.select("#selDataset");
//   console.log(data);
  data.names.forEach(function(name){
    // console.log(name);
    selector.append("option").text(name).property("value", name);
  });
});

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function drawBarGraph(sample) {
    var graphConfig = [{
        type: "bar",
        x: sample.sample_values.slice(0, 10),
        y: sample.otu_ids.slice(0, 10).map((id) => `OTU ${id}`),
        text: sample.otu_labels.slice(0, 10),
        orientation: "h"
    }];
    var layout = {yaxis: {autorange: 'reversed'}};
    Plotly.newPlot("bar", graphConfig, layout);
}

// Create a bubble chart that displays each sample.
function drawBubbleGraph(sample) {
    var graphConfig = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: "markers",
        marker: {
        color: sample.otu_ids,
        size: sample.sample_values
        }
      };
      
      var layout = {
        showlegend: false,
        height: 600,
        width: 1200
      };
      
      Plotly.newPlot("bubble", [graphConfig], layout);
}

// Display the sample metadata, i.e., an individual's demographic information.
function fillMetadata(metadata) {
    const metadataBox = document.getElementById("sample-metadata")
    metadataBox.innerHTML = "";
    for (const prop in metadata) {
        if (metadataBox.innerHTML !== "") {
            metadataBox.innerHTML += "<br/>";
        }
        metadataBox.innerHTML += `${prop}: ${metadata[prop]}`;
    }
}

function optionChanged(selectedOption){
    if (sampleData && selectedOption) {
        // console.log(selectedOption);
        var sample = sampleData.samples.find((s) => s.id == selectedOption);
        console.log(sample);
        console.log(sample.sample_values.slice(0, 10))
        console.log(sample.otu_ids.slice(0, 10))
        drawBarGraph(sample);
        drawBubbleGraph(sample);
        
        var metadata = sampleData.metadata.find((m) => m.id == selectedOption);
        fillMetadata(metadata);
        
    } else {
        console.log("Page is not ready.");
    }

}

// Functions needed to be created for each chart. All functions need to run
// together and then they are all plotted together.
// First time running sample metadata, it printed all the info on one line,
// so added if first is filled (not empty), then add a space (line break).