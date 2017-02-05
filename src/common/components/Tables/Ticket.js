import createTable from './createTable';

const columns = [
  { dataField: 'id', title: 'ID', isKey: true, dataSort: true },
  { dataField: 'title', title: 'Название задачи', dataSort: true },
];

export default createTable({ columns });
