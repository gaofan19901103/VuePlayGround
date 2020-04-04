// this servie is trying to get the minium data set that a component needs
// export function convertColumns(FraTemplate){
//     let columns = new Map();
//     FraTemplate.Columns.forEach((item, index ) => {
//         if(item.Visibility == 'never') return;

//         colMap.set(index + 1, {
//             colId: item.Col,
//             colTitle: item.Title,
//             width: item.Width || 90, // getting the width from CSS, css variable
//             span: 1,
//             freeze: false
//         });
//     });

//     return colMap;
// }

import { MetaHeader } from '../metaData.js'

export function convertColumns(FraMeta){
    let columnArray = [];

    FraMeta.Columns.forEach((item, index ) => {
        if(item.Visibility == 'never') return;

        let col = {
            colIndex: index,
            colId: item.Col,
            colTitle: item.Title,
            width: item.Width || 90, // getting the width from CSS, css variable
            span: 1,
            freeze: index < 3
        };

        col.x = index == 0 ? 0 : columnArray[index - 1].x + col.width;

        columnArray.push(col);
    });

    return columnArray;
}


// export function convertRows(FraMeta, convertColumns){
//     let rows = JSON.parse(JSON.stringify(FraMeta.Rows));
//     let rowMap = new Map();

//     Object.keys(rows).forEach((key, index) =>{
//         let row = {
//             rowId: key,
//             cells: {},
//             freeze: false
//         };

//         for(let col of convertColumns.entries()){
//             row.cells[col[0]] = {};
//             row.cells[col[0]].x = col[1].width * (col[0] - 1);
//             row.cells[col[0]].y = index * 30;  // this 30 is row height, get it dynamically.

//             if(rows[key].Values[col[1].colId]){
//                 // we should apply value converter here.
//                 row.cells[col[0]].value = rows[key].Values[col[1].colId].Val || '';
//             }
//             else{
//                 row.cells[col[0]].value = '';
//             }
//         }

//         rowMap.set(index + 1,row);
//     });

//     return rowMap;
// }

export function convertRows(FraMeta, convertColumns){
    let headerRow = getHeaderRows(convertColumns);

    let metaRows = JSON.parse(JSON.stringify(FraMeta.Rows));
    let metaRowArray = Object.keys(metaRows).map(x => {return { ...metaRows[x], ...{rowId: x} }});

    metaRowArray.unshift(MetaHeader);

    let result = [];
    //result = result.concat(headerRow);

    metaRowArray.forEach((row, rowIndex) =>{

        let item = {
            rowIndex: rowIndex,
            rowId: row.rowId,
            freeze: false,
            isHeader: !!row.IsHeader,
            height: row.Height || 20,
            cells: {}
        };

        item.y = rowIndex == 0 ? 0 : result[rowIndex - 1].y + (metaRowArray[rowIndex - 1].Height || 20);

        convertColumns.forEach((col, colIndex) =>{
            let cell = {};

            cell.rowId = row.rowId;
            cell.colId = col.colId;
            cell.x = colIndex == 0 ? 0 : item.cells[colIndex - 1].x  + convertColumns[colIndex - 1].width;
            cell.y = rowIndex == 0 ? 0 : result[rowIndex - 1].cells[colIndex].y + (metaRowArray[rowIndex - 1].Height || 20); // now the row height is always fixed, and this is simple, to make it dynamic I need to change the logic correspondingly in sheet.component.vue.
            cell.value = (row.Values[col.colId] && row.Values[col.colId].Val) || '';

            item.cells[colIndex] = cell;
        });

        result.push(item);
    });

    return result;
}

export function getHeaderRows(convertColumns){
    let headerRow = {
        rowIndex: 0,
        rowId: '',
        cells: {},
        freeze: true
    };

    convertColumns.forEach((item, colIndex) => {
        let cell = {};

        cell.x = colIndex == 0 ? 0 : headerRow.cells[colIndex - 1].x  + convertColumns[colIndex - 1].width;
        cell.y = 0; // to be changed
        cell.value = item.colTitle;

        headerRow.cells[colIndex] = cell;
    });

    return [headerRow];
}