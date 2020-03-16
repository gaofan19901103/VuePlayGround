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

export function convertColumns(FraTemplate){
    let columnArray = [];

    FraTemplate.Columns.forEach((item, index ) => {
        if(item.Visibility == 'never') return;

        columnArray.push({
            colIndex: index,
            colId: item.Col,
            colTitle: item.Title,
            width: item.Width || 90, // getting the width from CSS, css variable
            span: 1,
            freeze: false
        });
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
    let rows = JSON.parse(JSON.stringify(FraMeta.Rows));
    let rowArray = [];


    Object.keys(rows).forEach((key, rowIndex) =>{
        let row = {
            rowIndex: rowIndex + 1,
            rowId: key,
            cells: {},
            freeze: false
        };

        convertColumns.forEach((item, colIndex) => {
            row.cells[item.colId] = {};
            row.cells[item.colId].x = colIndex * item.width;
            row.cells[item.colId].y = (rowIndex + 1) * 30;  // this 30 is row height, get it dynamically.

            if(rows[key].Values[item.colId]){
                row.cells[item.colId].value = rows[key].Values[item.colId].Val || '';
            }
            else{
                row.cells[item.colId].value = '';
            }
        });

        rowArray.push(row);
    });

    return rowArray;
}

export function getHeaderRows(convertColumns){
    let headerRow = {
        rowIndex: 0,
        rowId: '',
        cells: {},
        freeze: true
    };

    convertColumns.forEach((item, colIndex) => {
        headerRow.cells[item.colId] = {};
        headerRow.cells[item.colId].x = colIndex * item.width;
        headerRow.cells[item.colId].y = 0;
        headerRow.cells[item.colId].value = item.colTitle;
    });

    return [headerRow];
}