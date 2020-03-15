// this servie is trying to get the minium data set that a component needs
export function convertColumns(FraTemplate){
    let colMap = new Map();
    FraTemplate.Columns.forEach((item, index ) => {
        if(item.Visibility == 'never') return;

        colMap.set(index + 1, {
            colId: item.Col,
            colTitle: item.Title,
            width: item.Width || 90, // getting the width from CSS, css variable
            span: 1,
            freeze: false
        });
    });

    return colMap;
}

export function convertRows(FraMeta, convertColumns){
    let rows = JSON.parse(JSON.stringify(FraMeta.Rows));
    let rowMap = new Map();

    Object.keys(rows).forEach((key, index) =>{
        let row = {
            rowId: key,
            cells: {},
            freeze: false
        };

        for(let col of convertColumns.entries()){
            row.cells[col[0]] = {};
            row.cells[col[0]].x = col[1].width * (col[0] - 1);
            row.cells[col[0]].y = index * 30;  // this 30 is row height, get it dynamically.

            if(rows[key].Values[col[1].colId]){
                // we should apply value converter here.
                row.cells[col[0]].value = rows[key].Values[col[1].colId].Val || '';
            }
            else{
                row.cells[col[0]].value = '';
            }
        }

        rowMap.set(index + 1,row);
    });

    return rowMap;
}