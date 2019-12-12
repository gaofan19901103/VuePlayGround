interface Column{
    id: string,
    name: string,
    type: string,
    style: ColumnStyle
}

interface ColumnStyle{
    width: number,
    color: string
}