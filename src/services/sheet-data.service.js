export function convertColumns(FraTemplate){
    let colMap = new Map();
    FraTemplate.Columns.array.forEach((item, index ) => {
        if(item.Visibility == 'never') return;

        colMap.set(index + 1, {
            colTitle: item.title,
            colId: item.Col,
        });
    });

    return colMap;
}