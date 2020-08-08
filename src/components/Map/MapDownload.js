
import React from 'react';

import jsPDF from 'jspdf';

import ColoredButton from 'components/Admin/Common/ColoredButton';
import Select from 'components/Admin/Common/Select';
import Accordian from './Accordian';
import icon from 'images/download.png';

function download (map, osmLayer, format, resolution) {
  var dims = {
    a3: [420, 297],
    a4: [297, 210]
  };
  var loading = 0;
  var loaded = 0;

  var dim = dims[format];
  var width = Math.round(dim[0] * resolution / 25.4);
  var height = Math.round(dim[1] * resolution / 25.4);
  var size =map.getSize();
  var extent = map.getView().calculateExtent(size);

  var source = osmLayer.getSource();

  var tileLoadStart = function() {
    ++loading;
  };

  var tileLoadEnd = function() {
    ++loaded;
    if (loading === loaded) {
      var canvas = this;
      window.setTimeout(function() {
        loading = 0;
        loaded = 0;
        var data = canvas.toDataURL('image/png');
        var pdf = new jsPDF('landscape', undefined, format);
        pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
        pdf.save('map.pdf');
        source.un('tileloadstart', tileLoadStart);
        source.un('tileloadend', tileLoadEnd, canvas);
        source.un('tileloaderror', tileLoadEnd, canvas);
        map.setSize(size);
        map.getView().fit(extent);
        map.renderSync();

        document.body.style.cursor = 'auto';
      }, 100);
    }
  };

  map.once('postcompose', function(event) {
    source.on('tileloadstart', tileLoadStart);
    source.on('tileloadend', tileLoadEnd, event.context.canvas);
    source.on('tileloaderror', tileLoadEnd, event.context.canvas);
  });

  map.setSize([width, height]);
  map.getView().fit(extent);
  map.renderSync();
}

    
class MapDownload extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      pageSize: 'a4',
      resolution: '150'
    };
  }

  onChange (field, value) {
    if (field === 'pageSize')
      this.setState ({pageSize: value});
    else if (field === 'resolution')
      this.setState ({resolution: value});
  }

  render () {
    const props = this.props;
    const pageSizeOptions = {a3: 'A3', a4: 'A4'};
    const resolutionOptions = {'150': '150 DPI', '300': '300 DPI'};

    return (
      <Accordian header='Download' icon={icon} section='download' setUi={this.props.setUi} ui={this.props.ui}
        body={
          <div>
            <Select options={pageSizeOptions} value={this.state.pageSize} onChange={this.onChange.bind(this)}
                id='rem-map-pagesize' label='Page Size' field='pageSize' />
            <Select options={resolutionOptions} value={this.state.resolution} onChange={this.onChange.bind(this)}
                id='rem-map-resolution' label='Resolution' field='resolution' />
            <ColoredButton label='Download'
                onClick={() => download(props.map, props.osmLayer, this.state.pageSize, this.state.resolution)} />
          </div>
        }
      />
    )
  }
}

export default MapDownload;
