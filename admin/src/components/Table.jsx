import '../styles/table.scss';

export default function Table({ columns, data, actions, emptyText = 'Geen items gevonden.' }) {
  if (!data?.length) {
    return (
      <div className="data-table-wrap">
        <div className="empty-state">
          <span className="material-icons-round">inbox</span>
          {emptyText}
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => <th key={col.key}>{col.label}</th>)}
            {actions && <th>Acties</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map(col => (
                <td key={col.key} title={typeof row[col.key] === 'string' ? row[col.key] : undefined}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
              {actions && (
                <td>
                  <div className="data-table__actions">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
