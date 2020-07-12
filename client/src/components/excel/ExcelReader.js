import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { clearErrors } from '../../actions/errorActions';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import { saveMaterial, saveItems } from '../../actions/woActions';
import { threshold } from '../../appConfig';
import { edgeBandThickness } from '../../appConfig';
import $ from 'jquery';
import { hasDuplicate } from '../../Utils/commonUtls';
import { uniqueKeys } from '../../appConfig';

class ExcelReader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data: [],
      cols: [],
      materials: [],
      items: [],
      isError: false,
      materialCodes:[]
    }
    this.handleFile = this.handleFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) {
      this.setState({ file: files[0] });
      setTimeout(() => {
        $('#btnUploadExcel').click();;
      }, 200)
      
    }
  };

  handleFile(e) {
    e.preventDefault();
    this.setState({
      data: []
    });
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      this.setState({ isError: false, materials : [], items:[]});
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });

      this.getMaterials(wb);

      if (this.state.materials.length > 0) {
        this.getItems(wb);
      }

      if (this.state.items.length > 0) {
        this.props.saveMaterial(this.state.materials);
        this.props.saveItems(this.state.items);
      }

    };

    if (rABS) {
      reader.readAsBinaryString(this.state.file);
    } else {
      reader.readAsArrayBuffer(this.state.file);
    };
  }

  getMaterials(wb) {

    const wsMaterials = wb.Sheets["materials"];

    if (!wsMaterials) {
      console.log('Not an Excel file, OR does not have a Sheet called "materials" ');
      return;
    }

    const dataMaterials = XLSX.utils.sheet_to_json(wsMaterials);

    if (dataMaterials.length < 2) {
      console.log('There is no data in the material Sheet');
      return;
    }

    // Validate Code ---------------------------------------------------------------

    let arrCode = dataMaterials.map(m => m.code);

    if (!arrCode.every((v) => { return (Number.isInteger(v) && v > 0 && v < 1000) })) {
      console.log('Material code must be a number between 1 and 1000');
      return;
    }

    let duplicates = arrCode.reduce(function (acc, el, i, arr) {
      if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
    }, []);

    if (duplicates && duplicates.length > 0) {
      console.log("Duplicate Codes found.. " + duplicates.join(","));
      return;
    }
    this.setState({ materialCodes: arrCode });


    // Validate Material ---------------------------------------------------------------

    let arrMaterial = dataMaterials.map(m => m.material);

    if (!arrMaterial.every((v) => { return (v.length > 3 && v.length < 50) })) {
      console.log('Material text length must be between 3 and 50');
      return;
    }

    // Validate Shade ---------------------------------------------------------------

    let arrShade = dataMaterials.map(m => m.shade);

    if (!arrShade.every((v) => { return (v.length > 3 && v.length < 50) })) {
      console.log('Shade text length must be between 3 and 50');
      return;
    }

    // Validate Thickness ---------------------------------------------------------------

    let arrThickness = dataMaterials.map(m => m.thickness);

    if (!arrThickness.every((v) => { return (!isNaN(v) && v > 0 && v < 50) })) {
      console.log('Thickness  must be a number between 1 and 50');
      return;
    }

    // Validate Grains ---------------------------------------------------------------

    let arrGrains = dataMaterials.map(m => m.grains);

    if (!arrGrains.every((v) => { return (v.toLowerCase() == "yes" || v.toLowerCase() == "no") })) {
      console.log('Value of Grains must be  yes or no');
      return;
    }

    dataMaterials.forEach(function (e, i) { e.grains = (e.grains == 'yes') });

    if (hasDuplicate(dataMaterials, uniqueKeys.material)) {
      console.log('There are duplicate material in the Excel. Please verify.');
      return;
    }

    this.setState({ materials: dataMaterials });


  }


  getItems(wb) {

    const wsItems = wb.Sheets["items"];

    if (!wsItems) {
      console.log('Excel file does not have a Sheet called and "items"');
      return;
    }

    const dataItems = XLSX.utils.sheet_to_json(wsItems);

    if (dataItems.length < 2) {
      console.log('There is no data in the items Sheet');
      return;
    }

    // Validate Code ---------------------------------------------------------------

    let arrCode = dataItems.map(i => i.code);

    if (!arrCode.every((v) => { return (Number.isInteger(v) && v > 0 && v < 1000) })) {
      console.log('Item code must be a number between 1 and 1000');
      return;
    }
    let uniqueCodes = arrCode.filter((v, i, a) => a.indexOf(v) === i);
    let matCodes = this.state.materialCodes;
    if (!uniqueCodes.every((v) => { return matCodes.includes(v) })) {
      console.log('Item has Material Code which is not defined in the materials list.');
      return;
    }

    // Validate Height ---------------------------------------------------------------
    let arrHeight = dataItems.map(i => i.height);
    if (!arrHeight.every((v) => { return (Number.isInteger(v) && v > threshold.minHeight && v < threshold.maxHeight) })) {
      console.log('Height must be a number between ' + threshold.minHeight + ' and  ' + threshold.maxHeight);
      return;
    }

    // Validate Width ---------------------------------------------------------------
    let arrWidth = dataItems.map(i => i.width);
    if (!arrWidth.every((v) => { return (Number.isInteger(v) && v > threshold.minWidth && v < threshold.maxWidth) })) {
      console.log('Width must be a number between ' + threshold.minWidth + ' and  ' + threshold.maxWidth);
      return;
    }

    // Validate Quantity ---------------------------------------------------------------
    let arrQuantity = dataItems.map(i => i.quantity);
    if (!arrQuantity.every((v) => { return (Number.isInteger(v) && v > threshold.minQuantity && v < threshold.maxQuantity) })) {
      console.log('Quantity must be a number between ' + threshold.minQuantity + ' and  ' + threshold.maxQuantity);
      return;
    }

    // Validate Edge Band ---------------------------------------------------------------
    let arrEB = [
      ...dataItems.map(i => i.eb_a),
      ...dataItems.map(i => i.eb_b),
      ...dataItems.map(i => i.eb_c),
      ...dataItems.map(i => i.eb_d)

    ];

    let uniqueEB = arrEB.filter((v, i, a) => a.indexOf(v) === i);
    if (!uniqueEB.every((v) => { return edgeBandThickness.includes(v) })) {
      console.log('Edge Band should be any of these - ' + edgeBandThickness.join(','));
      return;
    }

    // Validate ItemType ---------------------------------------------------------------

    let arrItemType = dataItems.map(i => i.itemtype);

    if (!arrItemType.every((v) => { return ( v.length < 150) })) {
      console.log('ItemType text length must be less than 150');
      return;
    }

    // Validate Remarks ---------------------------------------------------------------

    let arrRemarks = dataItems.map(i => i.remarks);

    if (!arrRemarks.every((v) => { return (v.length < 500) })) {
      console.log('Remarks text length must be less than 500');
      return;
    }

    if (hasDuplicate(dataItems, uniqueKeys.item)) {
      console.log('There are duplicate items in the Excel. Please verify.');
      return;
    }

    dataItems.forEach(function (e,i) { e.itemnumber = i + 1 });


    this.setState({ items: dataItems });

  }



  render() {
    return (

      <div className="form-inline">
        <div className="col-md-12 form-group">
          <input type="file" className="form-control col-sm-4 col-form-label" id="file" accept={SheetJSFT} onChange={this.handleChange} />
          <button type='submit' id="btnUploadExcel" className="form-control btn btn-secondary btn-sm" style={{ lineHeight: "1px", fontSize: "10px" }} onClick={this.handleFile} ><i className="icon-cloud-upload" ></i>Excel</button>

        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  wo: state.wo
});

export default connect(
  mapStateToProps,
  { clearErrors, saveMaterial, saveItems }
)(ExcelReader);

