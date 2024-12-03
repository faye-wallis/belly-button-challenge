// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let metadata = data.metadata;
    let filteredMetadata = metadata.filter(meta => meta.id === +sample)[0];

    let panel = d3.select("#sample-metadata");
    panel.html("");

    if (filteredMetadata) {
      Object.entries(filteredMetadata).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
      });
    } else {
      panel.append("h6").text("No metadata available for this sample.");
    }
  }).catch((error) => {
    console.error('Error fetching data:', error);
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSamples = samples.filter(s => s.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    otuIds = filteredSamples.otu_ids;
    otuLabels = filteredSamples.otu_labels;
    sampleValues = filteredSamples.sample_values;

    // Build a Bubble Chart

    let trace = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Viridis',
        showscale: true
      },
      text: otuLabels
    };

    let bubbleData = [trace];

    let bubbleLayout = {
      title: 'Bubble Chart Example',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values' }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let combinedData = otuIds.map((id, index) => ({
      otu_id: id,
      otu_label: otuLabels[index],
      sample_value: sampleValues[index]
    }));

    combinedData.sort((a, b) => b.sample_value - a.sample_value);
    let top10Data = combinedData.slice(0, 10);
    console.log("Top 10 Data (sorted):", top10Data);
    let barX = top10Data.map(data => data.sample_value);
    let barY = top10Data.map(data => `OTU ${data.otu_id}`);
    let barText = top10Data.map(data => data.otu_label);

    // Build a Bar Chart
    let barData = [{
      x: barX,
      y: barY,
      text: barText,
      type: 'bar',
      orientation: 'h'
    }];

    // Define layout for the bar chart
    let barLayout = {
      title: 'Top 10 OTUs',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);

  });
};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let panel = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
      panel.append("option")
        .text(name)
        .attr("value", name);
    });

    // Get the first sample from the list
    let sample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(sample);
    buildMetadata(sample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
